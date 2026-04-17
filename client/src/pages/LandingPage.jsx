import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Zap, PieChart, TrendingUp, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl">💸</span>
            <h1 className="text-2xl font-black text-emerald-500 tracking-tighter">LeakLess AI</h1>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-slate-400 hover:text-white font-bold text-sm transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Scan My Finances Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-emerald-500 text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles className="w-4 h-4" /> The World's First Revenue Leak AI
          </div>
          <h2 
            className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]"
          >
            You earned ₹1,00,000.<br />
            You received ₹80,000.<br />
            <span className="text-rose-500">Where did ₹20,000 go?</span>
          </h2>
          <p 
            className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            LeakLess AI is your AI CFO that scans your bank statements to find hidden subscriptions, micro-spending patterns, and settlement leaks. 
          </p>
          <div 
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link
              to="/register"
              className="group bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-3"
            >
              Stop the Leaks Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-slate-500 text-sm font-medium">Join 12,000+ users recovering ₹8.4Cr monthly.</p>
          </div>
        </div>
      </header>

      {/* Problem Section */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">The Invisible Drain</h2>
            <p className="text-slate-400">Traditional apps track spending. We track <span className="text-rose-500 font-bold">leaks</span>.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Failed Settlements', desc: 'Hidden fees and failed payment reversals that never hit your bank.', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { title: 'Ghost Subscriptions', desc: 'Recurring ₹499/mo charges for tools you haven\'t opened in 90 days.', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-500/10' },
              { title: 'Micro-Spending Spikes', desc: 'Small ₹50-₹200 impulse buys that add up to ₹15,000+ monthly.', icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            ].map((card, i) => (
              <div 
                key={i}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Meet Your AI CFO</h2>
            <p className="text-slate-400">Automated intelligence to recover every lost Rupee.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Leak Detection Engine', desc: 'Real-time scanning of your ledger for 14+ specific leakage patterns.', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { title: 'AI CFO Chat', desc: 'Privacy-first advice. Ask "Why is my burn rate high?" and get answers.', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              { title: 'Recovery Simulator', desc: 'See your trajectory if you fix just 30% of your current leaks.', icon: PieChart, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ].map((card, i) => (
              <div 
                key={i}
                className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">{card.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">💸</span>
                <h1 className="text-xl font-black text-white">LeakLess AI</h1>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Recovering lost revenue for individuals and small businesses using privacy-first artificial intelligence.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Product</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/leaks" className="text-slate-500 hover:text-emerald-500 transition-colors">Leak Detector</Link></li>
                <li><Link to="/simulators/reality-check" className="text-slate-500 hover:text-emerald-500 transition-colors">Reality Check</Link></li>
                <li><Link to="/register" className="text-slate-500 hover:text-emerald-500 transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Legal</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/privacy" className="text-slate-500 hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-slate-500 hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/support" className="text-slate-500 hover:text-emerald-500 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white uppercase tracking-widest text-xs mb-6">Contact</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><a href="mailto:support@leakless.ai" className="text-slate-500 hover:text-emerald-500 transition-colors">support@leakless.ai</a></li>
                <li className="text-slate-500">Bangalore, India</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-xs font-bold uppercase tracking-widest">
            <p>© 2026 LeakLess AI. Built for the financial freedom of 1.4B people.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> ISO 27001 Certified</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> GDPR Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
