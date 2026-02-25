import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Instagram, Twitter, Mail, Phone, 
  ArrowRight, Check, LayoutDashboard, LogOut, 
  Plus, Trash2, Settings as SettingsIcon, Image as ImageIcon,
  MessageSquare, Send
} from 'lucide-react';
import { PortfolioItem, SiteSettings, Contact } from './types';
import { INITIAL_PORTFOLIO, INITIAL_SETTINGS } from './data';

// --- Data Service (LocalStorage Fallback for Static Hosting) ---
const dataService = {
  getPortfolio: (): PortfolioItem[] => {
    const saved = localStorage.getItem('lp_portfolio');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lp_portfolio', JSON.stringify(INITIAL_PORTFOLIO));
    return INITIAL_PORTFOLIO;
  },
  savePortfolio: (items: PortfolioItem[]) => {
    localStorage.setItem('lp_portfolio', JSON.stringify(items));
  },
  getSettings: (): SiteSettings => {
    const saved = localStorage.getItem('lp_settings');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('lp_settings', JSON.stringify(INITIAL_SETTINGS));
    return INITIAL_SETTINGS;
  },
  saveSettings: (settings: SiteSettings) => {
    localStorage.setItem('lp_settings', JSON.stringify(settings));
  },
  getContacts: (): Contact[] => {
    const saved = localStorage.getItem('lp_contacts');
    return saved ? JSON.parse(saved) : [];
  },
  addContact: (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    const contacts = dataService.getContacts();
    const newContact = {
      ...contact,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('lp_contacts', JSON.stringify([newContact, ...contacts]));
  }
};

// --- Components ---
// ... (Navbar, Hero, Services, Portfolio, Testimonials, ContactForm, Footer components remain mostly the same, 
// but we'll update the data fetching logic in App and AdminDashboard)

const Navbar = ({ onAdminClick, isAdmin }: { onAdminClick: () => void, isAdmin: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: '홈', href: '#' },
    { name: '서비스', href: '#services' },
    { name: '포트폴리오', href: '#portfolio' },
    { name: '후기', href: '#testimonials' },
    { name: '문의하기', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0A192F]/90 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter text-white">
          LOGO<span className="text-[#D4AF37]">PICK</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-[#D4AF37] transition-colors">
              {link.name}
            </a>
          ))}
          <button 
            onClick={onAdminClick}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <LayoutDashboard size={20} />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#0A192F] border-b border-white/10 px-6 py-8 space-y-4"
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-medium text-gray-300 hover:text-[#D4AF37]"
              >
                {link.name}
              </a>
            ))}
            <button 
              onClick={() => { onAdminClick(); setIsMobileMenuOpen(false); }}
              className="flex items-center space-x-2 text-gray-400"
            >
              <LayoutDashboard size={20} />
              <span>관리자 대시보드</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ settings }: { settings: SiteSettings }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0A192F]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#191970] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-6">
            Premium Branding Agency
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {settings.hero_title}
          </h1>
          <p className="text-lg text-gray-400 mb-10 max-w-lg leading-relaxed">
            {settings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="px-8 py-4 bg-[#D4AF37] text-[#0A192F] font-bold rounded-lg hover:bg-[#C5A028] transition-all flex items-center justify-center group">
              무료 상담 시작하기
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </a>
            <a href="#portfolio" className="px-8 py-4 bg-white/5 text-white font-bold rounded-lg border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center">
              포트폴리오 보기
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <img 
              src="https://picsum.photos/seed/branding/1000/1200" 
              alt="Branding Showcase" 
              className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Floating elements */}
          <div className="absolute -top-6 -right-6 bg-[#D4AF37] p-6 rounded-xl shadow-xl hidden lg:block">
            <div className="text-3xl font-bold text-[#0A192F]">500+</div>
            <div className="text-xs font-bold text-[#0A192F]/70 uppercase tracking-tighter">Completed Projects</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const packages = [
    {
      name: '베이직 (Basic)',
      price: '₩190,000',
      description: '스타트업과 개인을 위한 핵심 로고 패키지',
      features: ['로고 시안 2종', '수정 2회', '고해상도 파일 (PNG, JPG)', '상업적 이용 가능'],
      popular: false
    },
    {
      name: '스탠다드 (Standard)',
      price: '₩390,000',
      description: '브랜드의 정체성을 확립하는 종합 패키지',
      features: ['로고 시안 3종', '무제한 수정', '원본 파일 (AI, PDF)', '명함 디자인 1종', '브랜드 가이드라인'],
      popular: true
    },
    {
      name: '프리미엄 (Premium)',
      price: '₩890,000',
      description: '완벽한 브랜드 경험을 위한 올인원 패키지',
      features: ['로고 시안 5종', '무제한 수정', '원본 파일 일체', '명함 + 봉투 + 서식지', 'SNS 프로필 세트', '브랜드 스토리텔링'],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0A192F] mb-4">서비스 패키지</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">당신의 비즈니스 규모와 필요에 맞는 최적의 브랜딩 솔루션을 선택하세요.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative p-8 rounded-2xl border ${pkg.popular ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-2xl scale-105 z-10' : 'bg-white text-[#0A192F] border-gray-200 shadow-sm'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0A192F] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold mb-4">{pkg.price}</div>
              <p className={`text-sm mb-8 ${pkg.popular ? 'text-gray-400' : 'text-gray-500'}`}>{pkg.description}</p>
              
              <ul className="space-y-4 mb-10">
                {pkg.features.map(feature => (
                  <li key={feature} className="flex items-start text-sm">
                    <Check className={`mr-2 shrink-0 ${pkg.popular ? 'text-[#D4AF37]' : 'text-emerald-500'}`} size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-lg font-bold transition-all ${pkg.popular ? 'bg-[#D4AF37] text-[#0A192F] hover:bg-[#C5A028]' : 'bg-[#0A192F] text-white hover:bg-[#191970]'}`}>
                상담 신청하기
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Portfolio = ({ items }: { items: PortfolioItem[] }) => {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))];

  const filteredItems = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold text-[#0A192F] mb-4">포트폴리오</h2>
            <p className="text-gray-500">로고픽이 완성한 다양한 브랜드 아이덴티티를 확인해보세요.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filter === cat ? 'bg-[#D4AF37] text-[#0A192F]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0A192F]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-8 text-center">
                  <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">{item.category}</span>
                  <h3 className="text-white text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      name: '김민수',
      role: 'IT 스타트업 대표',
      content: '로고픽 덕분에 우리 회사의 비전이 명확하게 시각화되었습니다. 시안 하나하나에 정성이 느껴졌고, 수정 과정도 매우 매끄러웠습니다.',
      avatar: 'https://picsum.photos/seed/user1/100/100'
    },
    {
      name: '이지은',
      role: '카페 오너',
      content: '따뜻하고 감성적인 로고를 원했는데, 기대 이상으로 예쁜 결과물이 나왔어요. 손님들도 로고가 너무 예쁘다고 칭찬해주십니다.',
      avatar: 'https://picsum.photos/seed/user2/100/100'
    },
    {
      name: '박준형',
      role: '유튜브 크리에이터',
      content: '채널의 성격을 잘 파악해서 독창적인 로고를 만들어주셨어요. 브랜딩의 중요성을 다시 한번 깨닫게 된 프로젝트였습니다.',
      avatar: 'https://picsum.photos/seed/user3/100/100'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#0A192F] text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
        <div className="text-[20vw] font-bold text-white whitespace-nowrap select-none">TESTIMONIALS TESTIMONIALS</div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">클라이언트 후기</h2>
          <p className="text-gray-400">로고픽과 함께한 고객들의 생생한 목소리를 들어보세요.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm"
            >
              <div className="flex items-center mb-6">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full mr-4 border border-[#D4AF37]/30" referrerPolicy="no-referrer" />
                <div>
                  <div className="font-bold">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.role}</div>
                </div>
              </div>
              <p className="text-gray-300 italic leading-relaxed">"{review.content}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', budget: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      dataService.addContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', budget: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold text-[#0A192F] mb-6">프로젝트 의뢰하기</h2>
          <p className="text-gray-500 mb-10">
            새로운 브랜드의 시작을 로고픽과 함께하세요. <br />
            상세한 정보를 남겨주시면 24시간 이내에 연락드리겠습니다.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#0A192F] rounded-full flex items-center justify-center text-[#D4AF37] mr-4">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Email</div>
                <div className="font-bold text-[#0A192F]">contact@logopick.com</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#0A192F] rounded-full flex items-center justify-center text-[#D4AF37] mr-4">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Phone</div>
                <div className="font-bold text-[#0A192F]">02-1234-5678</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#0A192F] rounded-full flex items-center justify-center text-[#D4AF37] mr-4">
                <Instagram size={20} />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">Social</div>
                <div className="font-bold text-[#0A192F]">@logopick_official</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F8F9FA] p-8 rounded-2xl border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">성함</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">이메일</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="example@email.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">예상 예산</label>
              <select 
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="">예산을 선택해주세요</option>
                <option value="under-30">30만원 미만</option>
                <option value="30-50">30만원 ~ 50만원</option>
                <option value="50-100">50만원 ~ 100만원</option>
                <option value="over-100">100만원 이상</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">문의 내용</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37] transition-colors"
                placeholder="어떤 브랜드인가요? 원하시는 스타일은 무엇인가요?"
              />
            </div>
            <button 
              disabled={status === 'loading'}
              className="w-full py-4 bg-[#0A192F] text-white font-bold rounded-lg hover:bg-[#191970] transition-all flex items-center justify-center"
            >
              {status === 'loading' ? '전송 중...' : status === 'success' ? '전송 완료!' : '의뢰 보내기'}
              <Send className="ml-2" size={18} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#0A192F] py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-bold text-white">
          LOGO<span className="text-[#D4AF37]">PICK</span>
        </div>
        <div className="text-gray-500 text-sm">
          © 2024 LogoPick Branding Agency. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

// --- Admin Dashboard ---

const AdminDashboard = ({ onExit }: { onExit: () => void }) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings' | 'contacts'>('portfolio');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newItem, setNewItem] = useState({ title: '', category: '', imageUrl: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setPortfolio(dataService.getPortfolio());
    setSettings(dataService.getSettings());
    setContacts(dataService.getContacts());
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    const current = dataService.getPortfolio();
    const newItemWithId = { ...newItem, id: Date.now() };
    dataService.savePortfolio([newItemWithId, ...current]);
    setNewItem({ title: '', category: '', imageUrl: '', description: '' });
    fetchData();
  };

  const handleDeletePortfolio = (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const current = dataService.getPortfolio();
    dataService.savePortfolio(current.filter(item => item.id !== id));
    fetchData();
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    dataService.saveSettings(settings);
    alert('설정이 저장되었습니다. (브라우저 로컬 스토리지에 저장됨)');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0A192F] text-white p-6 flex flex-col">
        <div className="text-xl font-bold mb-12">
          LOGO<span className="text-[#D4AF37]">ADMIN</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('portfolio')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'portfolio' ? 'bg-[#D4AF37] text-[#0A192F]' : 'hover:bg-white/5'}`}
          >
            <ImageIcon size={18} />
            <span className="font-bold text-sm">포트폴리오 관리</span>
          </button>
          <button 
            onClick={() => setActiveTab('contacts')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'contacts' ? 'bg-[#D4AF37] text-[#0A192F]' : 'hover:bg-white/5'}`}
          >
            <MessageSquare size={18} />
            <span className="font-bold text-sm">문의 내역</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-[#D4AF37] text-[#0A192F]' : 'hover:bg-white/5'}`}
          >
            <SettingsIcon size={18} />
            <span className="font-bold text-sm">사이트 설정</span>
          </button>
        </nav>

        <button 
          onClick={onExit}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors mt-auto"
        >
          <LogOut size={18} />
          <span className="font-bold text-sm">나가기</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'portfolio' && '포트폴리오 관리'}
            {activeTab === 'contacts' && '문의 내역'}
            {activeTab === 'settings' && '사이트 설정'}
          </h1>
        </header>

        {activeTab === 'portfolio' && (
          <div className="space-y-10">
            {/* Add New */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold mb-6 flex items-center">
                <Plus className="mr-2" size={20} /> 새 작업물 추가
              </h2>
              <form onSubmit={handleAddPortfolio} className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">제목</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.title}
                    onChange={e => setNewItem({...newItem, title: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">카테고리</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">이미지 URL</label>
                  <input 
                    required
                    type="text" 
                    value={newItem.imageUrl}
                    onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">설명</label>
                  <textarea 
                    rows={3}
                    value={newItem.description}
                    onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2"
                  />
                </div>
                <button className="col-span-2 py-3 bg-[#0A192F] text-white font-bold rounded-lg">추가하기</button>
              </form>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map(item => (
                <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-4 flex justify-between items-start">
                    <div>
                      <div className="text-xs font-bold text-[#D4AF37] uppercase">{item.category}</div>
                      <div className="font-bold">{item.title}</div>
                    </div>
                    <button 
                      onClick={() => handleDeletePortfolio(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">날짜</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">이름</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">이메일</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">예산</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">메시지</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contacts.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold">{c.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{c.budget}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{c.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'settings' && settings && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-2xl">
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">사이트 이름</label>
                <input 
                  type="text" 
                  value={settings.site_name}
                  onChange={e => setSettings({...settings, site_name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">히어로 제목</label>
                <input 
                  type="text" 
                  value={settings.hero_title}
                  onChange={e => setSettings({...settings, hero_title: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">히어로 부제목</label>
                <textarea 
                  rows={2}
                  value={settings.hero_subtitle}
                  onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">포인트 색상</label>
                  <input 
                    type="color" 
                    value={settings.accent_color}
                    onChange={e => setSettings({...settings, accent_color: e.target.value})}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">배경 색상</label>
                  <input 
                    type="color" 
                    value={settings.bg_color}
                    onChange={e => setSettings({...settings, bg_color: e.target.value})}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold mb-4">SEO 설정</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Description</label>
                    <textarea 
                      rows={2}
                      value={settings.seo_description}
                      onChange={e => setSettings({...settings, seo_description: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meta Keywords</label>
                    <input 
                      type="text" 
                      value={settings.seo_keywords}
                      onChange={e => setSettings({...settings, seo_keywords: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              </div>
              <button className="w-full py-4 bg-[#0A192F] text-white font-bold rounded-lg">설정 저장하기</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    setPortfolio(dataService.getPortfolio());
    setSettings(dataService.getSettings());
  }, [isAdmin]);

  if (isAdmin) {
    return <AdminDashboard onExit={() => setIsAdmin(false)} />;
  }

  if (!settings) return <div className="min-h-screen bg-[#0A192F] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="font-sans selection:bg-[#D4AF37] selection:text-[#0A192F]">
      <Navbar onAdminClick={() => setIsAdmin(true)} isAdmin={isAdmin} />
      <Hero settings={settings} />
      <Services />
      <Portfolio items={portfolio} />
      <Testimonials />
      <ContactForm />
      <Footer />
    </div>
  );
}
