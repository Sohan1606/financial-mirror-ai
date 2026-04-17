import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../../utils/formatINR';

export default function LeakScoreWidget({ leakAmount, recoveryPotential, loading }) {
  const score = Math.max(0, 100 - Math.round((leakAmount / 10000) * 10)); // Simple scoring logic
  const scoreColor = score > 80 ? 'text-emerald-500' : score > 50 ? 'text-amber-500' : 'text-rose-500';

  if (loading) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl animate-pulse">
        <div className="h-4 w-24 bg-slate-700 rounded mb-4" />
        <div className="h-20 w-20 bg-slate-700 rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl group hover:border-rose-500/30 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-100 font-bold text-sm uppercase tracking-wider">Leak Score</h3>
        <ShieldAlert className={`w-5 h-5 ${leakAmount > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`} />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364.4}
              initial={{ strokeDashoffset: 364.4 }}
              animate={{ strokeDashoffset: 364.4 - (364.4 * score) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={scoreColor}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-black ${scoreColor}`}>{score}</span>
          </div>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-rose-500 font-bold text-lg">{formatINR(leakAmount)} <span className="text-[10px] text-slate-500 uppercase">Leaked</span></p>
          <p className="text-emerald-500 font-bold text-sm">+{formatINR(recoveryPotential)} <span className="text-[10px] text-slate-500 uppercase">Recoverable</span></p>
        </div>

        <Link 
          to="/leaks" 
          className="w-full py-3 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          Detailed Analysis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
