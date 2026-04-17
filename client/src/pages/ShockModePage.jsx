import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingDown, Shield, DollarSign, Zap, ShieldAlert, ArrowRight, Save, CheckCircle2, HeartPulse } from 'lucide-react';
import { calculateShockMode } from '../utils/financialSimulators';
import { formatINR } from '../utils/formatINR';
import { financeService } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const SHOCK_TYPES = [
  { id: 'job-loss', name: 'Job Loss', icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'medical-emergency', name: 'Medical Emergency', icon: HeartPulse, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'market-crash', name: 'Market Crash', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'income-reduction', name: '30% Pay Cut', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
];

export default function ShockModePage() {
  const [financialData, setFinancialData] = useState({
    income: '',
    expenses: '',
    savings: '',
    emergencyFund: '',
  });
  const [shockType, setShockType] = useState('job-loss');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    if (!financialData.income || !financialData.expenses) return;
    const calcResult = calculateShockMode(
      {
        income: parseFloat(financialData.income),
        expenses: parseFloat(financialData.expenses),
        savings: parseFloat(financialData.savings) || 0,
        emergencyFund: parseFloat(financialData.emergencyFund) || 0,
      },
      shockType
    );
    setResult(calcResult);
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await financeService.saveSimulation({
        type: 'shock-mode',
        inputData: { ...financialData, shockType },
        resultData: result,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
            <ShieldAlert className="w-10 h-10 text-rose-500" />
            Shock Mode Simulator
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Stress test your finances against life's unexpected emergencies.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Financial Data Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-500" />
              Financial Resilience Profile
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly Income (₹)</label>
                <input
                  type="number"
                  value={financialData.income}
                  onChange={(e) => setFinancialData({ ...financialData, income: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly Expenses (₹)</label>
                <input
                  type="number"
                  value={financialData.expenses}
                  onChange={(e) => setFinancialData({ ...financialData, expenses: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                  placeholder="35000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Savings (₹)</label>
                <input
                  type="number"
                  value={financialData.savings}
                  onChange={(e) => setFinancialData({ ...financialData, savings: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                  placeholder="200000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Emergency Fund (₹)</label>
                <input
                  type="number"
                  value={financialData.emergencyFund}
                  onChange={(e) => setFinancialData({ ...financialData, emergencyFund: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
                  placeholder="100000"
                />
              </div>
            </div>
          </motion.div>

          {/* Shock Type Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl flex flex-col"
          >
            <h3 className="text-2xl font-bold text-slate-100 mb-8">Select Emergency Scenario</h3>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {SHOCK_TYPES.map((shock) => {
                const Icon = shock.icon;
                const isSelected = shockType === shock.id;
                return (
                  <button
                    key={shock.id}
                    onClick={() => setShockType(shock.id)}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${
                      isSelected
                        ? `border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10`
                        : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
                    }`}
                  >
                    <Icon className={`w-10 h-10 mb-3 transition-transform group-hover:scale-110 ${
                      isSelected ? 'text-rose-500' : 'text-slate-500'
                    }`} />
                    <div className={`text-sm font-bold ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>{shock.name}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleCalculate}
              className="w-full mt-8 py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 group"
            >
              <Zap className="w-6 h-6" />
              <span>Simulate Impact</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-8"
            >
              {/* Resilience Score Card */}
              <div className={`p-10 rounded-3xl border-2 shadow-2xl relative overflow-hidden group ${
                result.financialResilience === 'Strong'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : result.financialResilience === 'Moderate'
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-rose-500/5 border-rose-500/20'
              }`}>
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Shield className={`w-40 h-40 ${
                    result.financialResilience === 'Strong' ? 'text-emerald-500' : 
                    result.financialResilience === 'Moderate' ? 'text-amber-500' : 'text-rose-500'
                  }`} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-3xl font-black text-slate-100 uppercase tracking-tighter">Resilience: {result.financialResilience}</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-12">
                    <div>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Runway Duration</p>
                      <p className="text-5xl font-black text-slate-100 tracking-tighter">{result.monthsOfRunway} <span className="text-xl text-slate-500 uppercase">Months</span></p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-slate-300 text-lg leading-relaxed font-medium mb-8">
                        {result.recommendation}
                      </p>
                      <div className="flex gap-4">
                        <button
                          onClick={handleSave}
                          disabled={saved}
                          className={`flex items-center gap-2 px-8 py-4 ${saved ? 'bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'} text-white font-black rounded-2xl transition-all shadow-lg`}
                        >
                          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                          {saved ? 'Shock Report Saved' : 'Archive Stress Test'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recovery Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Total Buffer</p>
                  <p className="text-3xl font-black text-emerald-500">{formatINR(result.totalBuffer)}</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Survival Spend</p>
                  <p className="text-3xl font-black text-rose-500">{formatINR(result.survivalSpend)}<span className="text-xs text-slate-500 font-bold">/mo</span></p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Recovery Window</p>
                  <p className="text-3xl font-black text-blue-500">{(result.monthsOfRunway * 30).toFixed(0)} <span className="text-xs text-slate-500 font-bold">DAYS</span></p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
