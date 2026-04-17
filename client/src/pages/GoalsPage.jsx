import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { goalsApi } from '../api';
import { formatINR } from '../utils/formatINR';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Plus, 
  Trash2, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ChevronRight,
  Coins
} from 'lucide-react';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    emoji: '🎯',
    color: '#10B981',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await goalsApi.getAll();
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await goalsApi.create({
        ...newGoal,
        targetAmount: parseFloat(newGoal.targetAmount),
        savedAmount: 0
      });
      setNewGoal({ name: '', targetAmount: '', emoji: '🎯', color: '#10B981' });
      setShowAddForm(false);
      fetchGoals();
    } catch (error) {
      console.error('Failed to add goal:', error);
    }
  };

  const handleAddSavings = async (goal) => {
    const amount = prompt(`Add savings to "${goal.name}" (₹):`);
    if (!amount || isNaN(amount)) return;

    try {
      await goalsApi.update(goal.id, {
        savedAmount: (goal.savedAmount || 0) + parseFloat(amount),
      });
      fetchGoals();
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await goalsApi.delete(id);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const emojis = ['🎯', '🏠', '🚗', '✈️', '📚', '💰', '💍', '💻', '🏖️', '🚀'];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <Target className="w-10 h-10 text-emerald-500" />
              Financial Goals
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Turn your dreams into reachable targets.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" /> New Goal
          </button>
        </div>

        {/* Add Goal Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-100 mb-6">Set a New Target</h3>
                <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Goal Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Dream House"
                      value={newGoal.name}
                      onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Target (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 1000000"
                      value={newGoal.targetAmount}
                      onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Icon</label>
                    <div className="flex flex-wrap gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700">
                      {emojis.map(e => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setNewGoal({ ...newGoal, emoji: e })}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${newGoal.emoji === e ? 'bg-emerald-500 text-white' : 'hover:bg-slate-800'}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      Launch Goal
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20 text-slate-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p>Calculating your progress...</p>
            </div>
          ) : goals.length === 0 ? (
            <div className="col-span-full bg-slate-800/30 border border-slate-700/50 border-dashed p-20 rounded-3xl text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No goals in sight</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">Set your first financial target to stay motivated and track your long-term progress.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-all"
              >
                Set Your First Goal
              </button>
            </div>
          ) : (
            goals.map((goal, idx) => {
              const savedAmount = goal.savedAmount || 0;
              const targetAmount = goal.targetAmount || 1;
              const progress = (savedAmount / targetAmount) * 100;
              const isCompleted = progress >= 100;
              
              return (
                <motion.div 
                  key={goal.id || idx} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-slate-800/50 border ${isCompleted ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700'} p-8 rounded-3xl hover:border-slate-600 transition-all group relative overflow-hidden`}
                >
                  {isCompleted && (
                    <div className="absolute top-0 right-0 p-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-bounce" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{goal.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-100">{goal.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">On-Track</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-slate-400 text-sm font-medium">Progress</span>
                        <span className="text-xl font-black text-slate-100">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3 ring-4 ring-slate-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className={`h-full rounded-full relative ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-blue-500'}`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
                      <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Saved</p>
                        <p className="text-slate-100 font-bold">{formatINR(savedAmount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Target</p>
                        <p className="text-slate-100 font-bold">{formatINR(targetAmount)}</p>
                      </div>
                    </div>

                    {!isCompleted ? (
                      <button
                        onClick={() => handleAddSavings(goal)}
                        className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" /> Add Savings
                      </button>
                    ) : (
                      <div className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Goal Achieved!
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Goal Insights */}
        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
            <Coins className="w-10 h-10 text-emerald-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-100 mb-2">Savings Trajectory</h3>
            <p className="text-slate-400 leading-relaxed">
              Based on your current monthly savings rate of <span className="text-emerald-500 font-bold">₹{formatINR(12000)}</span>, 
              you are on track to complete your next goal in <span className="text-slate-100 font-bold">4 months</span>. 
              Reducing your detected leaks could shorten this to <span className="text-emerald-500 font-bold">2.5 months</span>.
            </p>
          </div>
          <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-all flex items-center gap-2 shrink-0">
            Optimization Plan <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
