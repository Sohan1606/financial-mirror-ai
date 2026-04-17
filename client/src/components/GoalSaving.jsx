import { useState } from 'react';
import { formatINR } from '../utils/formatINR';

export default function GoalSaving({ savings, analysis }) {
  const [savingsGoal, setSavingsGoal] = useState('');
  const [isGoalSet, setIsGoalSet] = useState(false);

  const handleGoalSet = () => {
    const goal = parseFloat(savingsGoal);
    if (!isNaN(goal) && goal > 0) {
      setIsGoalSet(true);
    }
  };

  const handleGoalChange = (e) => {
    setSavingsGoal(e.target.value);
    setIsGoalSet(false);
  };

  const goal = parseFloat(savingsGoal) || 0;
  
  // Calculate monthly savings rates
  const monthlySavings = savings > 0 ? savings : 0;
  const improvedMonthlySavings = monthlySavings > 0 ? monthlySavings * 1.3 : 1000; // 30% improvement estimate
  
  // Calculate months to reach goal
  const currentMonths = monthlySavings > 0 ? Math.ceil(goal / monthlySavings) : Infinity;
  const improvedMonths = improvedMonthlySavings > 0 ? Math.ceil(goal / improvedMonthlySavings) : Infinity;
  const monthsSaved = currentMonths - improvedMonths;

  return (
    <div className="bg-gradient-to-br from-emerald-800/60 to-teal-900/40 backdrop-blur-xl border border-emerald-700/50 rounded-3xl p-8 shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Goal-Based Saving
          </h2>
          <p className="text-slate-400">Plan your financial goals and track progress</p>
        </div>
      </div>

      {/* Goal Input */}
      <div className="mb-8">
        <label className="block text-slate-300 font-semibold mb-3">Savings Goal (₹)</label>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-semibold">
              ₹
            </span>
            <input
              type="number"
              value={savingsGoal}
              onChange={handleGoalChange}
              placeholder="Enter your savings goal"
              className="w-full pl-10 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleGoalSet}
            disabled={!savingsGoal || parseFloat(savingsGoal) <= 0}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
          >
            Set Goal
          </button>
        </div>
      </div>

      {/* Goal Analysis */}
      {isGoalSet && goal > 0 && (
        <div className="space-y-6">
          {/* Timeline Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Rate */}
            <div className="bg-gradient-to-br from-amber-600/20 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/30 rounded-xl">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 .184a21.046 21.046 0 01-10 3.184M6.816 7.937a21.046 21.046 0 01-4-2.184m13.184 4.184L18 12m0 0l-3 3m3-3H18" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-amber-200">At Current Rate</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-amber-200 mb-2">
                  {currentMonths === Infinity ? '∞' : currentMonths}
                </div>
                <p className="text-amber-300 font-semibold">months</p>
                <p className="text-amber-400 text-sm mt-2">
                  Saving {formatINR(monthlySavings)}/month
                </p>
              </div>
            </div>

            {/* Optimized Rate */}
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-500/10 border border-emerald-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/30 rounded-xl">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-200">If Optimized</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-emerald-200 mb-2">
                  {improvedMonths === Infinity ? '∞' : improvedMonths}
                </div>
                <p className="text-emerald-300 font-semibold">months</p>
                <p className="text-emerald-400 text-sm mt-2">
                  Saving {formatINR(improvedMonthlySavings)}/month
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Highlight */}
          {monthsSaved > 0 && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/50 rounded-3xl p-6 text-center">
              <div className="text-2xl font-black text-emerald-200 mb-2">
                Save {monthsSaved} months faster!
              </div>
              <p className="text-emerald-300">
                Reach your goal {monthsSaved} months earlier by optimizing your savings
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-emerald-500/30 px-6 py-3 rounded-2xl">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="text-emerald-200 font-bold">
                  {formatINR(monthsSaved * improvedMonthlySavings)} saved in time
                </span>
              </div>
            </div>
          )}

          {/* Action Plan */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Action Plan to Reach Goal Faster
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">1.</span>
                <p className="text-slate-300 text-sm">
                  Reduce top spending category by 20% to save extra {formatINR(monthlySavings * 0.2)}/month
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">2.</span>
                <p className="text-slate-300 text-sm">
                  Set up automatic transfer of {formatINR(improvedMonthlySavings)} to savings account
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">3.</span>
                <p className="text-slate-300 text-sm">
                  Review subscriptions and cut unnecessary expenses by {formatINR(500)}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">4.</span>
                <p className="text-slate-300 text-sm">
                  Consider side income opportunities to add {formatINR(2000)}/month to savings
                </p>
              </div>
            </div>
          </div>

          {/* Progress Visual */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-semibold">Goal Progress</span>
              <span className="text-emerald-400 font-bold">
                {((monthlySavings / goal) * 100).toFixed(1)}% monthly
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((monthlySavings / goal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-slate-400 text-sm mt-3 text-center">
              At this rate, you'll reach {formatINR(goal)} in {currentMonths === Infinity ? 'never' : `${currentMonths} months`}
            </p>
          </div>
        </div>
      )}

      {/* Default State */}
      {!isGoalSet && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-600">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Set Your Savings Goal</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Define a financial goal and see how long it will take to reach it at your current vs optimized savings rate
          </p>
        </div>
      )}
    </div>
  );
}
