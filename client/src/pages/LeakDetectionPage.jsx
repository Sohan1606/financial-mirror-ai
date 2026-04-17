import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  TrendingDown, 
  RefreshCcw, 
  ArrowRight, 
  PieChart, 
  AlertCircle,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import axiosClient from '../api/axiosClient';
import { formatINR } from '../utils/formatINR';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AIChat from '../components/AIChat';

export default function LeakDetectionPage() {
  const [leaks, setLeaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recoveryPotential, setRecoveryPotential] = useState(0);
  const [totalLeakAmount, setTotalLeakAmount] = useState(0);

  const scanForLeaks = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.post('/api/leaks/analyze');
      setLeaks(response.data.leaks);
      setTotalLeakAmount(response.data.totalLeakAmount);
      setRecoveryPotential(response.data.recoveryPotential);
      setSummary(response.data.summary);
      setAnalyzed(true);
    } catch (error) {
      console.error('Failed to analyze leaks:', error);
    } finally {
      setLoading(false);
    }
  };

  const trajectoryData = [
    { month: 'Now', current: 0, fixed: 0 },
    { month: '3m', current: -totalLeakAmount * 3, fixed: -totalLeakAmount * 0.3 * 3 },
    { month: '6m', current: -totalLeakAmount * 6, fixed: -totalLeakAmount * 0.3 * 6 },
    { month: '1y', current: -totalLeakAmount * 12, fixed: -totalLeakAmount * 0.3 * 12 },
    { month: '5y', current: -totalLeakAmount * 60, fixed: -totalLeakAmount * 0.3 * 60 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
              Revenue Leak Detector
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Find hidden patterns where your money is leaking.</p>
          </div>
          <button
            onClick={scanForLeaks}
            disabled={loading}
            className={`px-8 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-rose-500/20 flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {analyzed ? 'Rescan for Leaks' : 'Scan for Leaks'}
          </button>
        </div>

        {!analyzed && !loading && (
          <div className="bg-slate-800/50 border border-slate-700 p-12 rounded-3xl text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Ready to recover lost revenue?</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">Our AI engine will scan your last 90 days of transactions for subscriptions, spikes, and micro-spending leaks.</p>
            <button
              onClick={scanForLeaks}
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold rounded-xl transition-all"
            >
              Start First Scan
            </button>
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            <div className="h-48 bg-slate-800/50 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-32 bg-slate-800/50 rounded-3xl animate-pulse" />
              <div className="h-32 bg-slate-800/50 rounded-3xl animate-pulse" />
              <div className="h-32 bg-slate-800/50 rounded-3xl animate-pulse" />
            </div>
          </div>
        )}

        {analyzed && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl">
                <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Potential Leakage</p>
                <p className="text-3xl font-bold text-rose-500 animate-pulse">{formatINR(totalLeakAmount)}<span className="text-sm font-normal text-slate-500 ml-2">/mo</span></p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl">
                <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">Recovery Potential</p>
                <p className="text-3xl font-bold text-emerald-500">{formatINR(recoveryPotential)}<span className="text-sm font-normal text-slate-500 ml-2">/mo</span></p>
              </div>
              <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl">
                <p className="text-slate-400 text-sm font-semibold mb-1 uppercase tracking-wider">1-Year Savings</p>
                <p className="text-3xl font-bold text-blue-500">{formatINR(recoveryPotential * 12)}</p>
              </div>
            </div>

            {/* Leak Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaks.length > 0 ? leaks.map((leak, index) => (
                <div key={index} className="bg-slate-800/80 border border-slate-700 p-6 rounded-3xl hover:border-rose-500/50 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center">
                      {leak.icon === 'subscription' && <RefreshCcw className="w-6 h-6 text-rose-500" />}
                      {leak.icon === 'micro' && <TrendingUp className="w-6 h-6 text-rose-500" />}
                      {leak.icon === 'spike' && <AlertCircle className="w-6 h-6 text-rose-500" />}
                      {leak.icon === 'low-value' && <ShieldAlert className="w-6 h-6 text-rose-500" />}
                    </div>
                    <p className="text-xl font-bold text-rose-500">{formatINR(leak.amount)}</p>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-2">{leak.type}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{leak.description}</p>
                </div>
              )) : (
                <div className="col-span-full bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center">
                  <ShieldAlert className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-emerald-500 mb-2">Clean Bill of Health!</h3>
                  <p className="text-slate-400">We couldn't detect any major leakage patterns in your recent transactions. Keep it up!</p>
                </div>
              )}
            </div>

            {/* Recovery Simulator */}
            <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-100">Recovery Trajectory</h3>
                  <p className="text-slate-400 mt-1">Impact of fixing detected leaks over 5 years.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-rose-500 rounded-full" />
                    <span className="text-xs text-slate-400">Current Trend</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-slate-400">Fixed Trend</span>
                  </div>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trajectoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(val) => `₹${Math.abs(val/1000)}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                      formatter={(val) => formatINR(Math.abs(val))}
                    />
                    <Line type="monotone" dataKey="current" stroke="#f43f5e" strokeWidth={3} dot={{ fill: '#f43f5e' }} />
                    <Line type="monotone" dataKey="fixed" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-slate-800/80 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-slate-100 mb-6">Your Recovery Action Plan</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-500">1</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-200">Review Subscriptions</h4>
                    <p className="text-sm text-slate-400">Audit your detected recurring payments and cancel unused tools.</p>
                  </div>
                  <ArrowRight className="text-slate-500" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-500">2</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-200">Set Micro-spending Limits</h4>
                    <p className="text-sm text-slate-400">Identify top categories for small purchases and set a weekly cap.</p>
                  </div>
                  <ArrowRight className="text-slate-500" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center font-bold text-emerald-500">3</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-200">Enable Spike Alerts</h4>
                    <p className="text-sm text-slate-400">Get notified when a category exceeds 120% of its usual spending.</p>
                  </div>
                  <ArrowRight className="text-slate-500" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <AIChat 
        transactions={[]} 
        analysisContext={{
          type: 'leak_detection',
          leakSummary: summary,
          totalLeakAmount,
          recoveryPotential,
          leaks
        }}
      />
    </DashboardLayout>
  );
}
