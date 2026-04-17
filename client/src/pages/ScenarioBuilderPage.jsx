import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Zap, ArrowRight, Save, CheckCircle2, Calculator } from 'lucide-react';
import { calculateScenario } from '../utils/financialSimulators';
import { formatINR } from '../utils/formatINR';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { financeService } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function ScenarioBuilderPage() {
  const [currentData, setCurrentData] = useState({
    income: '',
    expenses: '',
    savings: '',
    investmentReturns: '12',
  });
  
  const [adjustments, setAdjustments] = useState({
    incomeChange: '10',
    expenseChange: '-10',
    savingsChange: '0',
    years: '10',
  });

  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);

  const handleCalculate = () => {
    if (!currentData.income || !currentData.expenses) return;

    const calcResult = calculateScenario(
      {
        income: parseFloat(currentData.income),
        expenses: parseFloat(currentData.expenses),
        savings: parseFloat(currentData.savings) || 0,
        investmentReturns: parseFloat(currentData.investmentReturns),
      },
      {
        incomeChange: parseFloat(adjustments.incomeChange),
        expenseChange: parseFloat(adjustments.expenseChange),
        savingsChange: parseFloat(adjustments.savingsChange),
        years: parseInt(adjustments.years),
      }
    );
    setResult(calcResult);
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      await financeService.saveSimulation({
        type: 'scenario',
        inputData: { currentData, adjustments },
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
            <Zap className="w-10 h-10 text-emerald-500" />
            Future Scenario Builder
          </h1>
          <p className="text-slate-400 mt-2 text-lg">Project your financial destiny by adjusting key variables today.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Financial Data */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-xl font-bold text-slate-100 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Current Baseline
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Income</label>
                <input
                  type="number"
                  value={currentData.income}
                  onChange={(e) => setCurrentData({ ...currentData, income: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                  placeholder="50000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Expenses</label>
                <input
                  type="number"
                  value={currentData.expenses}
                  onChange={(e) => setCurrentData({ ...currentData, expenses: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500/50 outline-none"
                  placeholder="35000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Savings</label>
                <input
                  type="number"
                  value={currentData.savings}
                  onChange={(e) => setCurrentData({ ...currentData, savings: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none"
                  placeholder="100000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expected Returns (%)</label>
                <input
                  type="number"
                  value={currentData.investmentReturns}
                  onChange={(e) => setCurrentData({ ...currentData, investmentReturns: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500/50 outline-none"
                  placeholder="12"
                />
              </div>
            </div>
          </motion.div>

          {/* Adjustments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-xl font-bold text-slate-100 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" />
              Growth Levers
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Income Change (%)</label>
                <input
                  type="number"
                  value={adjustments.incomeChange}
                  onChange={(e) => setAdjustments({ ...adjustments, incomeChange: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expense Change (%)</label>
                <input
                  type="number"
                  value={adjustments.expenseChange}
                  onChange={(e) => setAdjustments({ ...adjustments, expenseChange: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">One-time Savings (₹)</label>
                <input
                  type="number"
                  value={adjustments.savingsChange}
                  onChange={(e) => setAdjustments({ ...adjustments, savingsChange: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Time Horizon</label>
                <select
                  value={adjustments.years}
                  onChange={(e) => setAdjustments({ ...adjustments, years: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                >
                  {[5, 10, 15, 20, 30].map(y => <option key={y} value={y}>{y} Years</option>)}
                </select>
              </div>
            </div>
            
            <button
              onClick={handleCalculate}
              className="w-full mt-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 group"
            >
              <Zap className="w-6 h-6" />
              <span>Project Future</span>
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
              {/* Chart */}
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-slate-100 mb-8">Wealth Trajectory Projection</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.projections}>
                      <defs>
                        <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="year" stroke="#64748b" label={{ value: 'Years', position: 'insideBottom', offset: -10, fill: '#64748b' }} />
                      <YAxis stroke="#64748b" tickFormatter={(val) => `₹${(val/1000000).toFixed(1)}M`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        formatter={(val) => formatINR(val)}
                      />
                      <Area type="monotone" dataKey="totalWealth" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorWealth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Impact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-center group hover:border-emerald-500/50 transition-all">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Projected Net Worth</p>
                  <p className="text-4xl font-black text-emerald-500 group-hover:scale-110 transition-transform">{formatINR(result.finalWealth)}</p>
                  <p className="text-xs text-slate-500 mt-4 font-bold">In {adjustments.years} Years</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-center group hover:border-blue-500/50 transition-all">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Monthly Contribution</p>
                  <p className="text-4xl font-black text-blue-500 group-hover:scale-110 transition-transform">{formatINR(result.finalMonthlySavings)}</p>
                  <p className="text-xs text-slate-500 mt-4 font-bold">End of Period</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-center group hover:border-purple-500/50 transition-all">
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">Total Growth</p>
                  <p className="text-4xl font-black text-purple-500 group-hover:scale-110 transition-transform">{((result.finalWealth / (parseFloat(currentData.savings) || 1)) * 100).toFixed(0)}%</p>
                  <p className="text-xs text-slate-500 mt-4 font-bold">Cumulative ROI</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saved}
                  className={`flex items-center gap-2 px-10 py-4 ${saved ? 'bg-emerald-500' : 'bg-slate-700 hover:bg-slate-600'} text-white font-black rounded-2xl transition-all shadow-xl`}
                >
                  {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                  {saved ? 'Scenario Saved' : 'Archive Projection'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
