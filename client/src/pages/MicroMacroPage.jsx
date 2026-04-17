import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Coffee, ShoppingCart, Car, Zap, Calculator, ArrowRight, Save, CheckCircle2 } from 'lucide-react';
import { calculateMicroToMacro } from '../utils/financialSimulators';
import { formatINR } from '../utils/formatINR';
import { financeService } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

const PRESETS = [
  { name: 'Daily Coffee', amount: 150, frequency: 'daily', icon: Coffee, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Online Shopping', amount: 2000, frequency: 'weekly', icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Cab Rides', amount: 300, frequency: 'daily', icon: Car, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Subscriptions', amount: 999, frequency: 'monthly', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function MicroMacroPage() {
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    if (!amount || amount <= 0) return;
    const calcResult = calculateMicroToMacro(parseFloat(amount), frequency);
    setResult(calcResult);
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await financeService.saveSimulation({
        type: 'micro-macro',
        inputData: { amount: parseFloat(amount), frequency },
        resultData: result,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const applyPreset = (preset) => {
    setAmount(preset.amount.toString());
    setFrequency(preset.frequency);
    const calcResult = calculateMicroToMacro(preset.amount, preset.frequency);
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
            <TrendingUp className="w-10 h-10 text-emerald-500" />
            Micro → Macro Simulator
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Visualize the massive impact of small, daily expenses over time.</p>
        </motion.div>

        {/* Presets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
        >
          <h3 className="text-xl font-bold text-slate-100 mb-6 uppercase tracking-wider text-sm">Common Spending Patterns</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRESETS.map((preset, index) => {
              const Icon = preset.icon;
              return (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className="p-6 bg-slate-900/50 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all group text-center"
                >
                  <div className={`w-12 h-12 ${preset.bg} ${preset.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-slate-200 mb-1">{preset.name}</div>
                  <div className="text-xs text-slate-500 font-bold">
                    ₹{preset.amount}/{preset.frequency.slice(0, 3)}
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
          <h2 className="text-2xl font-bold text-slate-100 mb-8 flex items-center gap-3">
            <Calculator className="w-6 h-6 text-emerald-500" />
            Custom Impact Calculator
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-xl transition-all"
                placeholder="150"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-6 py-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-xl transition-all"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCalculate}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
              >
                <Calculator className="w-6 h-6" />
                <span>Calculate Impact</span>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Yearly Cost', val: result.yearlyCost, color: 'text-rose-500', bg: 'bg-rose-500/10' },
                  { label: '5-Year Cost', val: result.fiveYearCost, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                  { label: '10-Year Cost', val: result.tenYearCost, color: 'text-rose-600', bg: 'bg-rose-600/10' },
                  { label: 'Wealth Potential', val: result.investmentValue10Years, color: 'text-emerald-500', bg: 'bg-emerald-500/10', sub: 'If invested at 12%' },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-6 rounded-3xl border border-slate-700 ${card.bg}`}
                  >
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{card.label}</p>
                    <p className={`text-3xl font-black ${card.color}`}>{formatINR(card.val)}</p>
                    {card.sub && <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-widest">{card.sub}</p>}
                  </motion.div>
                ))}
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex items-center justify-between gap-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-emerald-500 mb-2">The Real Opportunity Cost</h4>
                    <p className="text-slate-300 leading-relaxed text-lg">
                      By redirecting this small amount to a simple SIP, you could build a wealth of <span className="text-emerald-500 font-black">{formatINR(result.investmentValue10Years)}</span> in 10 years. 
                      That's the power of LeakLess AI.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 px-8 py-4 ${saved ? 'bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'} text-white font-black rounded-2xl transition-all shrink-0 shadow-lg`}
                >
                  {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {saved ? 'Saved!' : 'Save Simulation'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
