import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle, CheckCircle, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';
import { financeService } from '../services/api';
import { calculateFinancialHealth } from '../utils/financialSimulators';
import { formatINR } from '../utils/formatINR';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useToast } from '../components/ui/Toast';

export default function RealityCheckPage() {
  const toast = useToast();
  const [profile, setProfile] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    income: '',
    expenses: '',
    savings: '',
    debt: '',
    emergencyFund: '',
    investments: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await financeService.getProfile();
      if (data.profile) {
        setProfile(data.profile);
        setFormData({
          income: data.profile.income || '',
          expenses: data.profile.expenses || '',
          savings: data.profile.savings || '',
          debt: data.profile.debt || '',
          emergencyFund: data.profile.emergencyFund || '',
          investments: data.profile.investments || '',
        });
        if (data.profile.income > 0) {
          calculateHealth(data.profile);
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateHealth = (data) => {
    const score = calculateFinancialHealth(data);
    setHealthScore(score);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const profileData = {
        income: parseFloat(formData.income) || 0,
        expenses: parseFloat(formData.expenses) || 0,
        savings: parseFloat(formData.savings) || 0,
        debt: parseFloat(formData.debt) || 0,
        emergencyFund: parseFloat(formData.emergencyFund) || 0,
        investments: parseFloat(formData.investments) || 0,
      };

      await financeService.saveProfile(profileData);
      calculateHealth(profileData);
      setProfile(profileData);
      toast.success('Financial profile updated successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const shareScore = () => {
    const text = `My LeakLess AI score: ${healthScore?.score}/100 🏆 I recovered ₹${formatINR(12000)} this month!`;
    navigator.clipboard.writeText(text);
    toast.info('Score copied to clipboard!');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
            Financial Reality Check
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Uncover the truth about your financial health score.</p>
        </motion.div>

        {healthScore && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8">
              <button 
                onClick={shareScore}
                className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 font-bold text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share Score
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              {/* Health Score Circle */}
              <div className="text-center flex flex-col items-center">
                <div className="relative">
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="transparent"
                      className="text-slate-900"
                    />
                    <motion.circle
                      cx="112"
                      cy="112"
                      r="100"
                      stroke={healthScore.score >= 70 ? '#10b981' : healthScore.score >= 50 ? '#f59e0b' : '#f43f5e'}
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="628.3"
                      initial={{ strokeDashoffset: 628.3 }}
                      animate={{ strokeDashoffset: 628.3 - (628.3 * healthScore.score) / 100 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-slate-100">{healthScore.score}</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Health Score</span>
                  </div>
                </div>
                <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest ${
                  healthScore.score >= 70 ? 'bg-emerald-500/10 text-emerald-500' : 
                  healthScore.score >= 50 ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-rose-500/10 text-rose-500'
                }`}>
                  Grade: {healthScore.grade}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4">
                <h3 className="text-slate-100 font-bold text-lg mb-6 uppercase tracking-wider">Vital Signs</h3>
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-400 text-sm font-bold">Savings Rate</span>
                    <span className="text-2xl font-black text-emerald-500">{healthScore.savingsRate}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(healthScore.savingsRate, 100)}%` }} />
                  </div>
                </div>
                <div className="bg-slate-900/50 border border-slate-700/50 p-6 rounded-2xl">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-slate-400 text-sm font-bold">Emergency Runway</span>
                    <span className="text-2xl font-black text-blue-500">{healthScore.monthsOfRunway} <span className="text-xs text-slate-500">Months</span></span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(healthScore.monthsOfRunway * 10, 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="space-y-4">
                <h3 className="text-slate-100 font-bold text-lg mb-6 uppercase tracking-wider">CFO Insights</h3>
                <div className="space-y-3">
                  {healthScore.insights.map((insight, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-xl border border-slate-700/30"
                    >
                      {insight.toLowerCase().includes('critical') || insight.toLowerCase().includes('low') ? (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <span className="text-sm text-slate-300 leading-relaxed">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Update Your Profile</h2>
              <p className="text-slate-500 text-sm">Keep your financial data current for accurate health scoring.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Monthly Income (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="50,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Monthly Expenses (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.expenses}
                    onChange={(e) => setFormData({ ...formData, expenses: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="30,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Liquid Savings (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.savings}
                    onChange={(e) => setFormData({ ...formData, savings: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="1,00,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Total Debt (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.debt}
                    onChange={(e) => setFormData({ ...formData, debt: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500/50 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Investments (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.investments}
                    onChange={(e) => setFormData({ ...formData, investments: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="2,50,000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Emergency Fund (₹)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</div>
                  <input
                    type="number"
                    value={formData.emergencyFund}
                    onChange={(e) => setFormData({ ...formData, emergencyFund: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-8 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                    placeholder="50,000"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-700/50">
              <button
                type="submit"
                disabled={saving}
                className={`flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Run Diagnostic
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
