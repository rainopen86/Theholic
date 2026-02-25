import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("logopick.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    imageUrl TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    budget TEXT,
    message TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const portfolioCount = db.prepare("SELECT COUNT(*) as count FROM portfolio").get() as { count: number };
if (portfolioCount.count === 0) {
  const insertPortfolio = db.prepare("INSERT INTO portfolio (title, category, imageUrl, description) VALUES (?, ?, ?, ?)");
  const samples = [
    ["Modern Tech Logo", "Technology", "https://picsum.photos/seed/tech1/800/600", "A sleek, minimalist logo for a software startup."],
    ["Organic Cafe Branding", "Food & Beverage", "https://picsum.photos/seed/cafe1/800/600", "Warm and inviting brand identity for a local coffee shop."],
    ["Luxury Fashion Mark", "Fashion", "https://picsum.photos/seed/fashion1/800/600", "Elegant and high-end logo design for a boutique brand."],
    ["Creative Studio Identity", "Creative", "https://picsum.photos/seed/studio1/800/600", "Bold and vibrant identity for a design collective."],
    ["Eco-Friendly Product Logo", "Sustainability", "https://picsum.photos/seed/eco1/800/600", "Nature-inspired branding for sustainable products."],
    ["Fitness App Icon", "Health", "https://picsum.photos/seed/fitness1/800/600", "Dynamic and energetic visual identity for a fitness platform."]
  ];
  samples.forEach(s => insertPortfolio.run(...s));
}

const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  const insertSetting = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
  insertSetting.run("site_name", "로고픽 (LogoPick)");
  insertSetting.run("hero_title", "당신의 브랜드를 완성하는 단 하나의 로고");
  insertSetting.run("hero_subtitle", "세련된 감각과 전문성으로 소상공인과 크리에이터의 가치를 시각화합니다.");
  insertSetting.run("accent_color", "#D4AF37");
  insertSetting.run("bg_color", "#0A192F");
  insertSetting.run("seo_description", "로고픽 - 프리미엄 로고 및 브랜드 아이덴티티 디자인 서비스");
  insertSetting.run("seo_keywords", "로고제작, 브랜딩, 디자인, 소상공인로고, 스타트업로고");
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get("/api/portfolio", (req, res) => {
    const items = db.prepare("SELECT * FROM portfolio ORDER BY id DESC").all();
    res.json(items);
  });

  app.post("/api/portfolio", (req, res) => {
    const { title, category, imageUrl, description } = req.body;
    const result = db.prepare("INSERT INTO portfolio (title, category, imageUrl, description) VALUES (?, ?, ?, ?)").run(title, category, imageUrl, description);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/portfolio/:id", (req, res) => {
    db.prepare("DELETE FROM portfolio WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/settings", (req, res) => {
    const rows = db.prepare("SELECT * FROM settings").all() as { key: string, value: string }[];
    const settings = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    Object.entries(updates).forEach(([key, value]) => {
      upsert.run(key, String(value));
    });
    res.json({ success: true });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, budget, message } = req.body;
    db.prepare("INSERT INTO contacts (name, email, budget, message) VALUES (?, ?, ?, ?)").run(name, email, budget, message);
    res.json({ success: true });
  });

  app.get("/api/contacts", (req, res) => {
    const items = db.prepare("SELECT * FROM contacts ORDER BY createdAt DESC").all();
    res.json(items);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
