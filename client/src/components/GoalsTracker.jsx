import { useState, useEffect } from 'react';
import { formatINR } from '../utils/formatINR';
import { saveGoals, loadGoals } from '../utils/storage';

export default function GoalsTracker({ analysis }) {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });
  const [celebratingGoal, setCelebratingGoal] = useState(null);

  // Load goals from localStorage
  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    const target = parseFloat(newGoal.targetAmount);
    const current = parseFloat(newGoal.currentAmount) || 0;
    
    if (target > 0 && newGoal.name.trim()) {
      const goal = {
        id: Date.now(),
        name: newGoal.name.trim(),
        targetAmount: target,
        currentAmount: current,
        targetDate: newGoal.targetDate,
        createdAt: new Date().toISOString()
      };
      setGoals(prev => [...prev, goal]);
      setNewGoal({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateProgress = (id, newAmount) => {
    const amount = parseFloat(newAmount);
    if (isNaN(amount)) return;

    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const updated = { ...goal, currentAmount: amount };
        // Check if goal just completed
        if (amount >= goal.targetAmount && goal.currentAmount < goal.targetAmount) {
          setCelebratingGoal(goal.id);
          setTimeout(() => setCelebratingGoal(null), 3000);
        }
        return updated;
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (id) => {
    if (confirm('Delete this goal?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const getGoalStatus = (goal) => {
    if (goal.currentAmount >= goal.targetAmount) {
      return { text: 'Achieved! 🎉', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50' };
    }
    
    if (goal.targetDate && analysis?.monthlySpendingAverage > 0) {
      const monthlySavings = Math.abs(analysis.savings / Math.max(1, analysis.expenseTransactions || 1)) * 30;
      if (monthlySavings > 0) {
        const remaining = goal.targetAmount - goal.currentAmount;
        const monthsNeeded = remaining / monthlySavings;
        const targetDate = new Date(goal.targetDate);
        const monthsUntilTarget = (targetDate - new Date()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsNeeded > monthsUntilTarget) {
          return { text: 'At Risk ⚠️', color: 'bg-amber-500/20 text-amber-400 border-amber-400/50' };
        }
      }
    }
    
    return { text: 'On Track', color: 'bg-blue-500/20 text-blue-400 border-blue-400/50' };
  };

  const getEstimatedCompletion = (goal) => {
    if (goal.currentAmount >= goal.targetAmount) return 'Completed!';
    if (!analysis || analysis.savings <= 0) return 'Save more to estimate';
    
    const monthlySavings = analysis.savings / Math.max(1, Object.keys(analysis.monthlySpending || {}).length || 1);
    if (monthlySavings <= 0) return 'Increase savings to estimate';
    
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsNeeded = Math.ceil(remaining / monthlySavings);
    
    if (monthsNeeded <= 0) return 'Completed!';
    if (monthsNeeded === 1) return '1 month';
    if (monthsNeeded < 12) return `${monthsNeeded} months`;
    const years = Math.floor(monthsNeeded / 12);
    const months = monthsNeeded % 12;
    return `${years}y ${months}m`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-200">Financial Goals</h3>
            <p className="text-sm text-slate-400">Track your savings targets</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/50 rounded-xl font-medium transition-colors"
        >
          {showAddForm ? 'Cancel' : '➕ Add Goal'}
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <form onSubmit={handleAddGoal} className="mb-6 p-4 bg-slate-700/30 rounded-2xl border border-slate-600/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Goal Name</label>
              <input
                type="text"
                value={newGoal.name}
                onChange={(e) => setNewGoal(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Emergency Fund, Vacation"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Amount (₹)</label>
              <input
                type="number"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="100000"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Current Savings (₹)</label>
              <input
                type="number"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="0"
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Date (Optional)</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-xl transition-all"
          >
            Create Goal 🎯
          </button>
        </form>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/30 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p>No goals yet. Add your first financial goal!</p>
          </div>
        ) : (
          goals.map(goal => {
            const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            const status = getGoalStatus(goal);
            const isCelebrating = celebratingGoal === goal.id;

            return (
              <div
                key={goal.id}
                className={`p-4 bg-slate-700/30 rounded-2xl border transition-all ${
                  isCelebrating ? 'border-emerald-400/50 animate-pulse' : 'border-slate-600/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200">{goal.name}</span>
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-lg border ${status.color}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400">
                      Target: {formatINR(goal.targetAmount)}
                      {goal.targetDate && ` by ${new Date(goal.targetDate).toLocaleDateString()}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                  >
                    🗑️
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="font-bold text-emerald-400">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Current Amount & Estimate */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">Saved:</span>
                    <input
                      type="number"
                      value={goal.currentAmount}
                      onChange={(e) => handleUpdateProgress(goal.id, e.target.value)}
                      className="w-24 px-2 py-1 bg-slate-800/50 border border-slate-600/50 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      min="0"
                    />
                  </div>
                  <div className="text-sm text-slate-400">
                    Est. completion: <span className="text-slate-300 font-medium">{getEstimatedCompletion(goal)}</span>
                  </div>
                </div>

                {/* Confetti Effect */}
                {isCelebrating && (
                  <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-center">
                    <span className="text-2xl">🎉</span>
                    <span className="ml-2 text-emerald-400 font-bold">Goal Achieved! Congratulations!</span>
                    <span className="ml-2 text-2xl">🎊</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
