import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, AlertTriangle, Phone, Laptop, Bike, Calculator, ArrowRight, Save, CheckCircle2, Zap } from 'lucide-react';
import { calculateDelayCost } from '../utils/financialSimulators';
import { formatINR } from '../utils/formatINR';
import { financeService } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const PRESETS = [
  { name: 'New iPhone', amount: 80000, icon: Phone, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { name: 'Gaming Laptop', amount: 120000, icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Royal Enfield', amount: 250000, icon: Bike, color: 'text-amber-500', bg: 'bg-amber-500/10' },
];

export default function DelayCostPage() {
  const [monthlySIP, setMonthlySIP] = useState('');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    if (!monthlySIP || monthlySIP <= 0) return;
    const calcResult = calculateDelayCost(parseFloat(monthlySIP), parseInt(years));
    setResult(calcResult);
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await financeService.saveSimulation({
        type: 'delay-cost',
        inputData: { monthlySIP: parseFloat(monthlySIP), years: parseInt(years) },
        resultData: result,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const applyPreset = (preset) => {
    // Assuming preset amount is total cost, we calculate monthly SIP needed to buy it in 1 year
    // or just set it as a monthly SIP target. Let's set it as a target SIP.
    setMonthlySIP((preset.amount / 12).toFixed(0));
    const calcResult = calculateDelayCost(preset.amount / 12, parseInt(years));
    setResult(calcResult);
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
            <Calculator className="w-10 h-10 text-emerald-500" />
            Delay Cost Calculator
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Compare the long-term wealth gap between immediate spending and strategic investing.</p>
        </motion.div>

        {/* Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-6 uppercase tracking-wider text-sm">Opportunity Cost of Luxuries</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESETS.map((preset, index) => {
              const Icon = preset.icon;
              return (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all group text-left flex items-center gap-6"
                >
                  <div className={`w-14 h-14 ${preset.bg} ${preset.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-200">{preset.name}</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">₹{preset.amount.toLocaleString()}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Monthly SIP Amount (₹)</label>
              <input
                type="number"
                value={monthlySIP}
                onChange={(e) => setMonthlySIP(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-xl transition-all"
                placeholder="10000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Period (Years)</label>
              <select
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-xl transition-all"
              >
                {[5, 10, 15, 20, 30].map(y => <option key={y} value={y}>{y} Years</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
              >
                <TrendingUp className="w-6 h-6" />
                <span>See Wealth Gap</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-3xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-rose-500">Scenario: Spending</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl">
                      <span className="text-slate-400 font-bold">Total Outflow</span>
                      <span className="text-xl font-black text-slate-100">{formatINR(result.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl">
                      <span className="text-slate-400 font-bold">Wealth Created</span>
                      <span className="text-xl font-black text-rose-500">₹0</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-500">Scenario: Investing</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl">
                      <span className="text-slate-400 font-bold">Total Principal</span>
                      <span className="text-xl font-black text-slate-100">{formatINR(result.totalSpent)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl">
                      <span className="text-slate-400 font-bold">Final Wealth</span>
                      <span className="text-3xl font-black text-emerald-500">{formatINR(result.investmentValue)}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 rounded-3xl shadow-2xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
                  <Zap className="w-40 h-40 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white mb-8 uppercase tracking-widest">💰 The Wealth Gap</h3>
                  <div className="grid md:grid-cols-3 gap-12">
                    <div>
                      <p className="text-blue-100/70 text-xs font-bold uppercase tracking-widest mb-2">Extra Wealth Created</p>
                      <p className="text-5xl font-black text-white tracking-tighter">{formatINR(result.wealthGap)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-blue-100 text-lg leading-relaxed font-medium">
                        Choosing to invest instead of spending that amount creates a wealth gap of <span className="bg-white/20 px-2 py-0.5 rounded font-black">{formatINR(result.wealthGap)}</span>. 
                        This is more than <span className="underline decoration-wavy underline-offset-4">{Math.round(result.wealthGap / result.totalSpent)}x</span> your initial principal.
                      </p>
                    </div>
                  </div>
                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saved}
                      className={`flex items-center gap-2 px-8 py-4 ${saved ? 'bg-emerald-500' : 'bg-white text-blue-600 hover:bg-blue-50'} font-black rounded-2xl transition-all shadow-xl`}
                    >
                      {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                      {saved ? 'Result Saved' : 'Archive Simulation'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
