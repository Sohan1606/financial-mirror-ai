import { useState } from 'react';
import { formatINR } from '../utils/formatINR';

export default function Budget({ totalExpense, savings }) {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [isBudgetSet, setIsBudgetSet] = useState(false);

  const handleBudgetSet = () => {
    const budget = parseFloat(monthlyBudget);
    if (!isNaN(budget) && budget > 0) {
      setIsBudgetSet(true);
    }
  };

  const handleBudgetChange = (e) => {
    setMonthlyBudget(e.target.value);
    setIsBudgetSet(false);
  };

  const budget = parseFloat(monthlyBudget) || 0;
  const isOverBudget = totalExpense > budget && budget > 0;
  const budgetDifference = Math.abs(totalExpense - budget);
  const budgetPercentage = budget > 0 ? (totalExpense / budget) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Smart Budget Mode
          </h2>
          <p className="text-slate-400">Track your spending against budget limits</p>
        </div>
      </div>

      {/* Budget Input */}
      <div className="mb-8">
        <label className="block text-slate-300 font-semibold mb-3">Monthly Budget</label>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-semibold">
              ₹
            </span>
            <input
              type="number"
              value={monthlyBudget}
              onChange={handleBudgetChange}
              placeholder="Enter your monthly budget"
              className="w-full pl-10 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleBudgetSet}
            disabled={!monthlyBudget || parseFloat(monthlyBudget) <= 0}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:hover:scale-100"
          >
            Set Budget
          </button>
        </div>
      </div>

      {/* Budget Status */}
      {isBudgetSet && budget > 0 && (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-300 font-semibold">Budget Usage</span>
              <span className={`font-bold text-lg ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverBudget 
                    ? 'bg-gradient-to-r from-red-500 to-rose-500' 
                    : budgetPercentage > 80
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          <div className={`
            p-6 rounded-2xl backdrop-blur-sm border text-center
            ${isOverBudget 
              ? 'bg-red-500/10 border-red-400/30' 
              : 'bg-emerald-500/10 border-emerald-400/30'
            }
          `}>
            <div className={`
              text-3xl font-black mb-2
              ${isOverBudget ? 'text-red-200' : 'text-emerald-200'}
            `}>
              {isOverBudget ? '⚠️ Over Budget' : '✅ Within Budget'}
            </div>
            <p className={`
              text-lg font-semibold
              ${isOverBudget ? 'text-red-300' : 'text-emerald-300'}
            `}>
              {isOverBudget 
                ? `You are over budget by ${formatINR(budgetDifference)}`
                : `You are within budget by ${formatINR(budgetDifference)}`
              }
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Spent: {formatINR(totalExpense)} of {formatINR(budget)}
            </p>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Smart Recommendations
            </h3>
            <div className="space-y-3">
              {isOverBudget ? (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      Reduce discretionary spending by {formatINR(budgetDifference * 0.3)} to get back on track
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      Consider increasing your budget to {formatINR(totalExpense * 1.1)} for realistic planning
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-amber-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      Set up alerts for when you reach 80% of budget
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      Great job! You're saving {formatINR(budgetDifference)} this month
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      Consider investing extra savings for better returns
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-1">•</span>
                    <p className="text-slate-300 text-sm">
                      You could potentially increase budget for quality of life improvements
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Default State */}
      {!isBudgetSet && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-slate-800/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-600">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-400 mb-2">Set Your Monthly Budget</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Enter a budget amount to track your spending and get personalized recommendations
          </p>
        </div>
      )}
    </div>
  );
}
