import { useState, useEffect } from 'react';
import { formatINR } from '../utils/formatINR';
import { saveBudgets, loadBudgets } from '../utils/storage';

export default function BudgetPlanner({ transactions }) {
  const [budgets, setBudgets] = useState({});
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempBudget, setTempBudget] = useState('');

  // Calculate actual spending per category
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const cat = t.category || 'Uncategorized';
      acc[cat] = (acc[cat] || 0) + parseFloat(t.amount || 0);
      return acc;
    }, {});

  const categories = Object.keys(categorySpending).sort();

  // Load budgets from localStorage
  useEffect(() => {
    setBudgets(loadBudgets());
  }, []);

  // Save budgets to localStorage
  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  const handleSetBudget = (category) => {
    const amount = parseFloat(tempBudget);
    if (amount > 0) {
      setBudgets(prev => ({ ...prev, [category]: amount }));
    }
    setEditingCategory(null);
    setTempBudget('');
  };

  const handleQuickSet = () => {
    const newBudgets = {};
    categories.forEach(cat => {
      newBudgets[cat] = Math.round(categorySpending[cat] * 0.9);
    });
    setBudgets(newBudgets);
  };

  const handleClearBudgets = () => {
    if (confirm('Clear all budget settings?')) {
      setBudgets({});
    }
  };

  // Calculate totals
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b, 0);
  const totalSpending = Object.values(categorySpending).reduce((sum, s) => sum + s, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpending / totalBudget) * 100 : 0;

  const getProgressColor = (spent, budget) => {
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    if (percent > 100) return 'bg-red-500';
    if (percent > 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStatusBadge = (spent, budget) => {
    const percent = budget > 0 ? (spent / budget) * 100 : 0;
    if (percent > 100) return { text: 'Over Budget', color: 'bg-red-500/20 text-red-400 border-red-400/50' };
    if (percent > 80) return { text: 'At Risk', color: 'bg-amber-500/20 text-amber-400 border-amber-400/50' };
    return { text: 'On Track', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50' };
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-200">Budget Planner</h3>
            <p className="text-sm text-slate-400">Set and track category budgets</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleQuickSet}
            className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/50 rounded-xl text-sm font-medium transition-colors"
          >
            ⚡ Quick Set (90%)
          </button>
          {Object.keys(budgets).length > 0 && (
            <button
              onClick={handleClearBudgets}
              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/50 rounded-xl text-sm font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Budget Utilization Summary */}
      {totalBudget > 0 && (
        <div className="mb-6 p-4 bg-slate-700/30 rounded-2xl border border-slate-600/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 font-medium">Budget Utilization</span>
            <span className={`font-bold ${budgetUtilization > 100 ? 'text-red-400' : budgetUtilization > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {budgetUtilization.toFixed(1)}%
            </span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor(totalSpending, totalBudget)}`}
              style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-400">
            <span>Spent: {formatINR(totalSpending)}</span>
            <span>Budget: {formatINR(totalBudget)}</span>
          </div>
        </div>
      )}

      {/* Category Budgets */}
      <div className="space-y-4">
        {categories.map(category => {
          const spent = categorySpending[category] || 0;
          const budget = budgets[category] || 0;
          const percent = budget > 0 ? (spent / budget) * 100 : 0;
          const status = getStatusBadge(spent, budget);

          return (
            <div key={category} className="p-4 bg-slate-700/30 rounded-2xl border border-slate-600/30 hover:border-slate-500/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-slate-200 font-medium capitalize">{category}</span>
                  {budget > 0 && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg border ${status.color}`}>
                      {status.text}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-slate-200 font-bold">{formatINR(spent)}</div>
                  {budget > 0 && (
                    <div className="text-xs text-slate-400">of {formatINR(budget)}</div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {budget > 0 ? (
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${getProgressColor(spent, budget)}`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>
              ) : (
                <div className="text-sm text-slate-500 mb-3">No budget set</div>
              )}

              {/* Budget Input */}
              {editingCategory === category ? (
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={tempBudget}
                    onChange={(e) => setTempBudget(e.target.value)}
                    placeholder="Enter budget amount"
                    className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    autoFocus
                  />
                  <button
                    onClick={() => handleSetBudget(category)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setTempBudget('');
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setTempBudget(budget > 0 ? budget.toString() : '');
                  }}
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  {budget > 0 ? '✏️ Edit Budget' : '➕ Set Budget'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
