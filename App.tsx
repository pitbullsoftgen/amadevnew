
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  Search, 
  RefreshCcw, 
  Share2, 
  ShieldCheck, 
  CheckCircle, 
  Lock, 
  Zap, 
  ChevronRight,
  Menu,
  X,
  ArrowRight,
  Gift,
  Shield,
  MousePointer2,
  DollarSign,
  CreditCard,
  Trophy,
  Coins,
  Settings,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Globe,
  Loader2
} from 'lucide-react';

// --- CLOUDFLARE KV COMPATIBLE STORAGE LAYER ---

// Note: API_BASE is now empty because we use relative paths (/api/config)
// which Cloudflare Pages Functions automatically resolves.
const API_URL = '/api/config'; 

interface RedirectLink {
  id: string;
  label: string;
  url: string;
  isPrimary: boolean;
  createdAt: number;
}

const StorageService = {
  getLinks: async (): Promise<RedirectLink[]> => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Database Fetch Failed");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn("Cloudflare KV not connected yet, falling back to LocalStorage.");
      const raw = localStorage.getItem('amz_wave_links');
      if (!raw) {
        return [{ id: 'default_id', label: 'Default Amazon', url: 'https://amazon.com', isPrimary: true, createdAt: Date.now() }];
      }
      try { return JSON.parse(raw); } catch { return []; }
    }
  },

  saveLinks: async (links: RedirectLink[]): Promise<boolean> => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(links)
      });
      
      if (res.ok) {
        window.dispatchEvent(new Event('storage_update'));
        return true;
      }
    } catch (e) {
      console.warn("API unavailable, saving to LocalStorage.");
    }
    
    localStorage.setItem('amz_wave_links', JSON.stringify(links));
    window.dispatchEvent(new Event('storage_update'));
    return true;
  },

  getPrimaryUrl: async (): Promise<string> => {
    const links = await StorageService.getLinks();
    const primary = links.find(l => l.isPrimary);
    return primary ? primary.url : 'https://www.amazon.com';
  }
};

// --- LANDING PAGE COMPONENTS (UNCHANGED DESIGN) ---

const Header = ({ onStartNow }: { onStartNow: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#131921]/95 backdrop-blur-md py-2 shadow-lg' : 'bg-[#131921] py-4'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <img 
            src="https://raw.githubusercontent.com/saddamjairi/amzw/main/images/log0.png" 
            alt="Amazon Wave Logo" 
            className="h-10 md:h-14 w-auto group-hover:scale-105 transition-transform object-contain"
          />
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-gray-300">
          <a href="#rewards" className="hover:text-[#FF9900] transition-colors">Rewards</a>
          <a href="#how-it-works" className="hover:text-[#FF9900] transition-colors">How it Works</a>
          <a href="#benefits" className="hover:text-[#FF9900] transition-colors">Benefits</a>
          <button 
            onClick={onStartNow}
            className="bg-[#FF9900] hover:bg-orange-500 text-[#131921] py-2.5 px-6 rounded-md transition-all transform active:scale-95 shadow-md font-black"
          >
            Start Now
          </button>
        </nav>

        <button className="lg:hidden text-white p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-[#131921] border-t border-gray-800 py-6 absolute w-full left-0 animate-in fade-in slide-in-from-top-4 shadow-2xl">
          <nav className="flex flex-col items-center gap-6 font-bold uppercase tracking-widest text-white">
            <a href="#rewards" className="hover:text-[#FF9900]" onClick={() => setIsMenuOpen(false)}>Rewards</a>
            <a href="#how-it-works" className="hover:text-[#FF9900]" onClick={() => setIsMenuOpen(false)}>How it Works</a>
            <a href="#benefits" className="hover:text-[#FF9900]" onClick={() => setIsMenuOpen(false)}>Benefits</a>
            <button 
              onClick={() => { setIsMenuOpen(false); onStartNow(); }}
              className="bg-[#FF9900] text-[#131921] py-4 px-12 rounded-lg w-10/12 shadow-lg active:scale-95 transition-transform font-black"
            >
              Start Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

const FlyingRewards = () => {
  const particles = useMemo(() => {
    const icons = [<Gift />, <DollarSign />, <CreditCard />, <Coins />, <Trophy />];
    return [...Array(20)].map((_, i) => ({
      icon: icons[i % icons.length],
      left: Math.random() * 100,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * 20,
      size: 45 + Math.random() * 50,
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(115vh) rotate(0deg); opacity: 0; }
          15% { opacity: 0.4; }
          85% { opacity: 0.4; }
          100% { transform: translateY(-35vh) rotate(360deg); opacity: 0; }
        }
        .reward-particle {
          position: absolute;
          animation: floatUp linear infinite;
          color: rgba(255, 153, 0, 0.45);
          filter: drop-shadow(0 0 10px rgba(255, 153, 0, 0.15));
          will-change: transform, opacity;
        }
      `}</style>
      {particles.map((p, i) => (
        <div key={i} className="reward-particle" style={{ left: `${p.left}%`, animationDuration: `${p.duration}s`, animationDelay: `-${p.delay}s`, fontSize: `${p.size}px`, transform: `rotate(${p.rotation}deg)` }}>
          {p.icon}
        </div>
      ))}
    </div>
  );
};

const Hero = ({ onAction }: { onAction: () => void }) => (
  <section className="relative min-h-[90vh] flex items-center amazon-gradient text-white pt-12 pb-24 overflow-hidden">
    <FlyingRewards />
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center relative z-10 gap-8 lg:gap-16">
      <div className="lg:w-7/12 text-center lg:text-left mb-12 lg:mb-0">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-6 border border-white/20 animate-pulse shadow-xl">
          <Gift size={18} className="text-[#FF9900]" />
          <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em]">Earn Up to $750</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tighter">
          Premium Rewards <br /><span className="text-[#FF9900] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">Awaits You</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed opacity-90">
          A premium rewards platform designed by Amazon, allowing eligible users to turn reviews, surveys, spins, and sharing into real value and income.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
          <button onClick={onAction} className="w-full sm:w-auto bg-[#FF9900] hover:bg-orange-500 text-[#131921] text-xl md:text-2xl font-black py-6 px-16 rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95 transform">
            Start Now <ChevronRight size={28} strokeWidth={3} />
          </button>
          <div className="flex items-center gap-4 bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#131921] bg-gray-600 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" />
                </div>
              ))}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] md:text-sm font-black text-white uppercase tracking-tighter">Join 50k+ Members</span>
              <div className="flex text-[#FF9900]">
                {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-5/12 flex justify-center relative w-full px-2 md:px-4 lg:px-0">
        <div className="relative w-full max-w-xs md:max-w-md lg:max-w-lg group">
          <div className="relative z-10 transform group-hover:-translate-y-4 transition-transform duration-700 ease-out">
            <img 
              src="https://raw.githubusercontent.com/saddamjairi/amzw/main/images/new_acard.png" 
              alt="Amazon Premium Rewards" 
              className="w-full h-auto drop-shadow-[0_30px_50px_rgba(255,153,0,0.3)] rounded-[2rem] md:rounded-[2.5rem] object-contain"
            />
            <div className="absolute -top-6 -right-2 md:-top-10 md:-right-4 bg-[#FF9900] text-[#131921] font-black px-6 py-3 md:px-10 md:py-5 rounded-2xl md:rounded-3xl text-3xl md:text-6xl shadow-2xl rotate-12 border-4 border-white z-30 flex flex-col items-center">
              <span className="text-[8px] md:text-xs leading-none mb-1 opacity-80 font-black">VALUE</span> $750
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-[#FF9900]/10 rounded-full blur-[60px] md:blur-[100px] -z-10"></div>
        </div>
      </div>
    </div>
  </section>
);

const TrustSection = () => (
  <div className="bg-white border-y border-gray-100 py-16">
    <div className="container mx-auto px-4 text-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
        {[
          { icon: <ShieldCheck size={24} className="text-green-500" />, text: "SSL SECURE" },
          { icon: <CheckCircle size={24} className="text-blue-500" />, text: "VERIFIED PAYOUTS" },
          { icon: <Lock size={24} className="text-gray-400" />, text: "256-BIT ENCRYPTION" },
          { icon: <Zap size={24} className="text-[#FF9900]" />, text: "INSTANT DELIVERY" }
        ].map((badge, idx) => (
          <div key={idx} className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left transition-transform hover:scale-105">
            <div className="p-4 bg-gray-50 rounded-2xl shadow-sm">{badge.icon}</div>
            <span className="text-[10px] md:text-sm font-black tracking-widest text-gray-600 uppercase">{badge.text}</span>
          </div>
        ))}
      </div>
      <div className="max-w-4xl mx-auto mt-12">
        <div className="inline-block px-10 py-6 bg-green-50 border-2 border-green-100 rounded-3xl shadow-xl">
          <p className="text-lg md:text-2xl font-black text-[#131921] uppercase tracking-tight leading-relaxed">
            <span className="text-green-500 mr-2">●</span> 
            Earnings are <span className="bg-green-100 px-3 py-1 rounded-xl text-green-700">guaranteed</span> after completing a short survey.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const WithdrawalSection = ({ onAction }: { onAction: () => void }) => (
  <section className="pt-24 pb-8 bg-gray-50 border-b border-gray-100">
    <div className="container mx-auto px-4 text-center">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-black text-[#131921] mb-6 tracking-tighter">Ready for Withdrawal</h2>
        <p className="text-gray-500 font-bold text-xl md:text-2xl max-w-2xl mx-auto">Access the current pool of premium gift cards available for instant claim.</p>
      </div>
      <div className="max-w-6xl mx-auto mb-16 relative group px-2">
        <img 
          src="https://raw.githubusercontent.com/saddamjairi/amzw/main/images/ghgh.png" 
          alt="Dashboard" 
          className="w-full h-auto rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border-4 md:border-8 border-white transition-all duration-700"
        />
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-t from-[#131921]/30 to-transparent pointer-events-none"></div>
      </div>
      <div className="mb-0">
        <button onClick={onAction} className="bg-[#FF9900] hover:bg-orange-500 text-[#131921] font-black py-5 px-10 md:py-6 md:px-16 rounded-2xl md:rounded-3xl text-xl md:text-3xl shadow-2xl transition-all active:scale-95 transform border-4 border-white inline-flex items-center gap-4 hover:-translate-y-2">
          START WITHDRAWAL <ChevronRight size={32} strokeWidth={4} />
        </button>
      </div>
    </div>
  </section>
);

const ValueProposition = () => {
  const rewardImages = [
    "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/slazzer-preview-7r8lb.png",
    "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/slazzer-preview-fm0e0.png",
    "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/slazzer-preview-h11or.png",
    "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/slazzer-preview-svhx9.png",
    "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/slazzer-preview-tsgd9.png"
  ];
  return (
    <section className="pt-8 pb-10 bg-white relative overflow-hidden" id="benefits">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-[#131921] mb-12 leading-[1.1] md:leading-[0.95] tracking-tighter">
            Your Actions <span className="text-[#FF9900]">Have Real Value</span>
          </h2>
          <div className="max-w-5xl mx-auto border-2 border-gray-100 rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 bg-white shadow-sm relative overflow-hidden mb-16">
             <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-gray-600 text-lg md:text-2xl font-medium leading-relaxed">
               <p>Our platform is a <span className="text-[#131921] font-black underline decoration-[#FF9900] decoration-8 underline-offset-8">completely free</span> rewards system designed to empower users to earn through Amazon engagement.</p>
               <p>By submitting reviews and completing surveys, you unlock verified earning opportunities delivered directly to your neural ID.</p>
             </div>
          </div>
          <div className="w-full py-12 md:py-16 px-6 md:px-12 bg-[#131921]/5 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-inner mb-12 overflow-x-auto">
            <div className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-8 md:gap-16 lg:gap-20 items-center min-w-max md:min-w-0">
              {rewardImages.map((src, i) => (
                <div key={i} className="w-20 md:w-36 lg:w-48 transition-all duration-500 hover:scale-110 group">
                  <img src={src} alt="Reward" className="w-full h-auto object-contain drop-shadow-xl group-hover:drop-shadow-2xl" />
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.5em] md:tracking-[1em] text-gray-400 blink-highlight inline-block">Official Hub Infrastructure</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const EarningSystem = ({ onAction }: { onAction: () => void }) => {
  const cards = [
    { title: "Product Reviews", subtitle: "Review & Earn", description: "Submit a verified product review and earn rewards ranging from $5 to $750.", icon: <Star size={32} />, img: "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/750-n.png", color: "bg-orange-50" },
    { title: "Feedback Campaign", subtitle: "Survey & Win", description: "Complete a quick survey and receive a chance to win digital gift cards worth up to $750.", icon: <Search size={32} />, img: "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/950-n.png", color: "bg-blue-50" },
    { title: "Interactive Rewards", subtitle: "Spin & Win", description: "Spin the interactive reward wheel for a chance to win coupons, cashback, or exclusive bonuses.", icon: <RefreshCcw size={32} />, img: "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/1000-n.png", color: "bg-purple-50" },
    { title: "Social Commission", subtitle: "Share & Earn", description: "Share top promotions and earn bonus entries plus commissions for every referral.", icon: <Share2 size={32} />, img: "https://raw.githubusercontent.com/saddamjairi/amzw/main/images/1200-n.png", color: "bg-green-50" }
  ];

  return (
    <section className="pt-10 pb-24 bg-gray-50" id="rewards">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-16 text-[#131921] tracking-tighter">Unified Earning System</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="flex flex-col bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group text-left">
              <div className={`h-48 md:h-56 relative overflow-hidden flex items-center justify-center ${card.color}`}>
                <img src={card.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl text-[#FF9900]">{card.icon}</div>
              </div>
              <div className="p-8 md:p-10 flex-grow flex flex-col">
                <h3 className="text-xl md:text-2xl font-black mb-2 text-[#131921]">{card.title}</h3>
                <p className="text-[#FF9900] font-black mb-4 md:mb-6 text-xs md:text-sm uppercase tracking-widest">{card.subtitle}</p>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8">{card.description}</p>
                <button onClick={onAction} className="mt-auto flex items-center gap-2 text-[#131921] font-black text-sm hover:text-[#FF9900] transition-colors uppercase border-b-2 border-[#131921] w-fit">
                  ACTIVE NOW <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Steps = () => (
  <section className="py-24 bg-white" id="how-it-works">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl md:text-7xl font-black text-[#131921] tracking-tighter mb-20">Start Earning Now</h2>
      <div className="grid md:grid-cols-3 gap-12 md:gap-16 max-w-6xl mx-auto">
        {[
          { num: "01", title: "Connect", icon: <MousePointer2 size={40} />, text: "Create an account or sync your existing Amazon account to unlock the Rewards Menu." },
          { num: "02", title: "Participate", icon: <Gift size={40} />, text: "Select a provided product and submit a review or participate in daily surveys." },
          { num: "03", title: "Earn", icon: <Zap size={40} />, text: "Rewards are delivered instantly to your verified email or added to your wallet." }
        ].map((step, idx) => (
          <div key={idx} className="relative p-10 md:p-12 bg-gray-50 rounded-[2.5rem] md:rounded-[3.5rem] text-center border-2 border-transparent hover:border-[#FF9900]/30 transition-all group">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#FF9900] text-[#131921] font-black rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl border-4 border-white shadow-xl z-20 transition-transform group-hover:scale-110">
              {step.num}
            </div>
            <div className="mb-8 flex justify-center text-[#131921]/10 group-hover:text-[#FF9900] transition-colors">{step.icon}</div>
            <h3 className="text-2xl md:text-3xl font-black mb-4 text-[#131921]">{step.title}</h3>
            <p className="text-gray-500 text-sm md:text-lg font-bold leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Subscribe = ({ onAction }: { onAction: () => void }) => (
  <section className="py-20 md:py-24 bg-[#131921] text-white relative overflow-hidden text-center">
    <div className="container mx-auto px-4 relative z-10">
      <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">Join the Evolution</h2>
      <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-medium">Secure your priority spot and unlock exclusive rewards.</p>
      <div className="max-w-2xl mx-auto bg-white/5 p-2 md:p-3 rounded-2xl md:rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <form className="flex flex-col sm:flex-row gap-2 md:gap-3" onSubmit={(e) => { e.preventDefault(); onAction(); }}>
          <input type="email" required placeholder="ENTER EMAIL" className="flex-grow py-4 px-6 md:py-5 md:px-8 rounded-xl md:rounded-2xl bg-[#131921]/60 border border-white/10 text-white font-black uppercase text-base md:text-lg outline-none focus:ring-4 focus:ring-[#FF9900]/30 transition-all" />
          <button className="bg-[#FF9900] hover:bg-orange-500 text-[#131921] font-black py-4 px-10 md:py-5 md:px-12 rounded-xl md:rounded-2xl transition-all shadow-xl active:scale-95 whitespace-nowrap">JOIN NOW</button>
        </form>
      </div>
    </div>
  </section>
);

const SecondaryCTA = ({ onAction }: { onAction: () => void }) => (
  <section className="py-24 md:py-32 bg-[#FF9900] relative overflow-hidden">
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-16 relative z-10">
      <div className="lg:w-1/2 text-center lg:text-left">
        <h2 className="text-5xl md:text-8xl font-black text-[#131921] mb-8 leading-[1] md:leading-[0.95] tracking-tighter">
          Your Premium <br />Reward Journey
        </h2>
        <p className="text-[#131921] font-black text-xl md:text-3xl mb-8 uppercase tracking-tighter">
          WIN UP TO $1000 DAILY VOUCHERS
        </p>
        <p className="text-[#131921]/90 text-lg md:text-2xl font-bold leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
          Amazon Wave is the next-generation ecosystem. Join over 100+ daily winners. Payouts processed every 24 hours.
        </p>
      </div>
      <div className="lg:w-1/2 flex flex-col items-center">
        <img src="https://raw.githubusercontent.com/saddamjairi/amzw/main/images/bundle.png" className="w-full max-w-md md:max-w-lg drop-shadow-2xl rounded-[2rem] md:rounded-[3rem] mb-12 hover:scale-105 transition-transform duration-700" />
        <button onClick={onAction} className="w-full max-w-lg bg-[#131921] hover:bg-black text-white font-black py-6 md:py-7 px-12 md:px-16 rounded-2xl md:rounded-3xl shadow-2xl text-xl md:text-3xl flex items-center justify-center gap-4 transition-all hover:-translate-y-2 border-b-4 md:border-b-8 border-black">
          START NOW <ChevronRight size={36} strokeWidth={4} />
        </button>
      </div>
    </div>
  </section>
);

const Certifications = () => (
  <section className="py-16 bg-gray-50 border-t border-gray-100">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-2">
          <Shield size={32} className="text-[#131921]" />
          <span className="font-black text-xl tracking-tighter uppercase">TrustE</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={32} className="text-[#131921]" />
          <span className="font-black text-xl tracking-tighter uppercase">Norton</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={32} className="text-[#131921]" />
          <span className="font-black text-xl tracking-tighter uppercase">McAfee</span>
        </div>
        <div className="flex items-center gap-2 text-2xl font-black">
          <span className="text-[#FF9900] uppercase">PCI</span> DSS
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ onAdminClick }: { onAdminClick: () => void }) => (
  <footer className="bg-[#131921] text-white pt-20 pb-12 border-t border-white/5">
    <div className="container mx-auto px-4 text-center">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-20 mb-20 text-left">
        <div className="text-center md:text-left">
          <img src="https://raw.githubusercontent.com/saddamjairi/amzw/main/images/log0.png" className="h-12 md:h-16 mb-8 object-contain" />
          <p className="text-gray-500 font-bold">The premium evolution of the rewards ecosystem. Secure, instant, and transparent.</p>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#FF9900]">Navigation</h4>
          <ul className="text-gray-400 space-y-4 font-black text-sm uppercase">
            <li><button className="hover:text-white transition-colors">Rewards Portal</button></li>
            <li><button className="hover:text-white transition-colors">Affiliate Node</button></li>
            <li><button className="hover:text-white transition-colors">Community Hub</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#FF9900]">Legal Docs</h4>
          <ul className="text-gray-400 space-y-4 font-black text-sm uppercase">
            {/* HIDDEN ADMIN CONSOLE: Only visible on hover */}
            <li className="opacity-0 hover:opacity-100 transition-opacity duration-300">
              <button onClick={onAdminClick} className="hover:text-[#FF9900] transition-colors flex items-center gap-2">Admin Console <ExternalLink size={14}/></button>
            </li>
            <li><span>Privacy Policy</span></li>
            <li><span>Terms of Use</span></li>
            <li><span>Compliance Shield</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-[#FF9900]">Identity</h4>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Neural ID Verification Hub v4.0</p>
        </div>
      </div>
      <p className="text-[10px] font-black tracking-[0.4em] text-gray-700">© 2026 AMAZON WAVE INFRASTRUCTURE • ALL RIGHTS RESERVED</p>
    </div>
  </footer>
);

// --- ADMIN SYSTEM ---

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (u === 'test' && p === 'root') onLogin();
    else setErr('ACCESS DENIED. Check credentials.');
  };

  return (
    <div className="min-h-screen amazon-gradient flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 md:p-12 shadow-2xl">
        <h1 className="text-3xl font-black text-[#131921] text-center mb-8 tracking-tighter">Admin Console</h1>
        <form onSubmit={handle} className="space-y-6">
          <input type="text" placeholder="USER ID" value={u} onChange={e=>setU(e.target.value)} className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF9900] font-bold" />
          <input type="password" placeholder="SECURITY KEY" value={p} onChange={e=>setP(e.target.value)} className="w-full bg-gray-50 p-5 rounded-2xl outline-none border-2 border-transparent focus:border-[#FF9900] font-bold" />
          {err && <p className="text-red-500 text-xs font-bold text-center">{err}</p>}
          <button className="w-full bg-[#131921] text-white font-black py-5 rounded-2xl active:scale-95 shadow-lg hover:bg-black transition-colors">AUTHENTICATE</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    const data = await StorageService.getLinks();
    setLinks(data.sort((a,b) => b.createdAt - a.createdAt));
    setLoading(false);
  };

  const handleSave = async (updatedLinks: RedirectLink[]) => {
    setSaving(true);
    await StorageService.saveLinks(updatedLinks);
    setLinks([...updatedLinks]);
    setSaving(false);
  };

  const addLink = () => {
    if (!newUrl) return;
    const nl: RedirectLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: newLabel || 'Internal Link',
      url: newUrl,
      isPrimary: links.length === 0,
      createdAt: Date.now()
    };
    handleSave([...links, nl]);
    setNewLabel(''); setNewUrl('');
  };

  const deleteLink = (id: string) => {
    const next = links.filter(l => l.id !== id);
    if (next.length > 0 && !next.some(l => l.isPrimary)) next[0].isPrimary = true;
    handleSave(next);
  };

  const setPrimary = (id: string) => {
    handleSave(links.map(l => ({ ...l, isPrimary: l.id === id })));
  };

  const startEdit = (link: RedirectLink) => {
    setEditId(link.id);
    setNewLabel(link.label);
    setNewUrl(link.url);
  };

  const saveEdit = () => {
    const next = links.map(l => l.id === editId ? { ...l, label: newLabel, url: newUrl } : l);
    handleSave(next);
    setEditId(null); setNewLabel(''); setNewUrl('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-[#131921]">
      <nav className="bg-[#131921] text-white py-6 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Globe className="text-[#FF9900]" />
          <span className="font-black uppercase text-xs md:text-sm tracking-widest">Global Router Node</span>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-[10px] md:text-xs font-black bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all"><LogOut size={14}/> DISCONNECT</button>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-4">
            Path Management
            {saving && <Loader2 className="animate-spin text-[#FF9900]" size={24} />}
          </h2>
          <div className="text-[10px] font-black bg-white px-6 py-3 rounded-2xl border border-gray-200 shadow-sm uppercase text-gray-400">
            CONNECTED TO CLOUDFLARE KV (APP_DB)
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 mb-10">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Link Title (e.g. Campaign 1)" className="bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold outline-none" value={newLabel} onChange={e=>setNewLabel(e.target.value)} />
            <div className="flex gap-2">
              <input type="url" placeholder="Target Destination URL" className="flex-grow bg-gray-50 border-2 border-gray-100 p-4 rounded-xl font-bold outline-none" value={newUrl} onChange={e=>setNewUrl(e.target.value)} />
              <button onClick={editId ? saveEdit : addLink} className="bg-[#FF9900] text-[#131921] font-black px-8 rounded-xl hover:bg-orange-500 transition-all shadow-lg flex items-center gap-2 whitespace-nowrap">
                {editId ? 'UPDATE' : 'ADD NEW'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-32 flex flex-col items-center justify-center text-gray-300 gap-4">
              <Loader2 className="animate-spin" size={48} />
              <span className="font-black tracking-widest text-xs uppercase">Querying Infrastructure...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    <th className="px-8 py-6">Label</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6">Target Address</th>
                    <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {links.map(link => (
                    <tr key={link.id} className={`group hover:bg-gray-50/50 transition-colors ${link.isPrimary ? 'bg-orange-50/20' : ''}`}>
                      <td className="px-8 py-6 font-black text-[#131921]">{link.label}</td>
                      <td className="px-8 py-6">
                        {link.isPrimary ? (
                          <div className="flex items-center gap-2 text-green-600 font-black text-xs uppercase bg-green-50 px-3 py-1.5 rounded-full w-fit">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Active Redirect
                          </div>
                        ) : (
                          <button onClick={() => setPrimary(link.id)} className="text-xs font-black text-gray-400 hover:text-[#FF9900] uppercase transition-colors">Set As Primary</button>
                        )}
                      </td>
                      <td className="px-8 py-6"><code className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-600 truncate max-w-xs block">{link.url}</code></td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(link)} className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-all"><Edit3 size={16} /></button>
                          <button onClick={() => deleteLink(link.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {links.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-gray-400 font-bold italic">No links configured yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [view, setView] = useState<'landing' | 'login' | 'admin'>('landing');
  const [currentRedirect, setCurrentRedirect] = useState('https://www.amazon.com');

  useEffect(() => {
    refreshRedirect();
    // Real-Time Sync Event Listener
    window.addEventListener('storage_update', refreshRedirect);
    return () => window.removeEventListener('storage_update', refreshRedirect);
  }, []);

  const refreshRedirect = async () => {
    const url = await StorageService.getPrimaryUrl();
    setCurrentRedirect(url);
  };

  const handleGlobalAction = () => {
    window.location.href = currentRedirect;
  };

  if (view === 'login') return <AdminLogin onLogin={() => setView('admin')} />;
  if (view === 'admin') return <AdminDashboard onLogout={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-white selection:bg-[#FF9900] selection:text-[#131921] antialiased overflow-x-hidden">
      <Header onStartNow={handleGlobalAction} />
      <Hero onAction={handleGlobalAction} />
      <TrustSection />
      <WithdrawalSection onAction={handleGlobalAction} />
      <ValueProposition />
      <EarningSystem onAction={handleGlobalAction} />
      <Steps />
      <Subscribe onAction={handleGlobalAction} />
      <SecondaryCTA onAction={handleGlobalAction} />
      <Certifications />
      <Footer onAdminClick={() => setView('login')} />
    </div>
  );
}
