import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { budgetsApi, reportsApi } from '../api';
import { formatINR } from '../utils/formatINR';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudget, setNewBudget] = useState({
    category: '',
    limit: '',
    period: 'monthly',
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await budgetsApi.getAll();
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    try {
      await budgetsApi.create({
        ...newBudget,
        limit: parseFloat(newBudget.limit)
      });
      setNewBudget({ category: '', limit: '', period: 'monthly' });
      setShowAddForm(false);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to add budget:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await budgetsApi.delete(id);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budget:', error);
    }
  };

  const handleQuickSet = async () => {
    try {
      const now = new Date();
      const report = await reportsApi.getMonthly(now.getFullYear(), now.getMonth() + 1);
      const categories = Object.entries(report.data.categoryBreakdown);
      
      for (const [category, amount] of categories) {
        // Set budget at 90% of last month's spend
        await budgetsApi.create({
          category,
          limit: Math.round(amount * 0.9),
          period: 'monthly'
        });
      }
      fetchBudgets();
    } catch (error) {
      console.error('Failed to quick-set budgets:', error);
    }
  };

  const categories = [
    'Food & Dining', 'Shopping', 'Entertainment', 'Transportation', 
    'Bills & Utilities', 'Groceries', 'Health & Fitness', 'Travel', 'Misc'
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <Wallet className="w-10 h-10 text-emerald-500" />
              Budget Planner
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Set spending limits and stop the leaks.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickSet}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Zap className="w-4 h-4 text-amber-500" /> Auto-Set (90%)
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" /> New Budget
            </button>
          </div>
        </div>

        {/* Add Budget Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-100 mb-6">Create Spending Limit</h3>
                <form onSubmit={handleAddBudget} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <select
                      value={newBudget.category}
                      onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Limit (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={newBudget.limit}
                      onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Period</label>
                    <select
                      value={newBudget.period}
                      onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      Save Budget
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20 text-slate-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p>Loading your budgets...</p>
            </div>
          ) : budgets.length === 0 ? (
            <div className="col-span-full bg-slate-800/30 border border-slate-700/50 border-dashed p-20 rounded-3xl text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No budgets set yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-8">Set spending limits for your categories to start tracking your financial health.</p>
              <button 
                onClick={() => setShowAddForm(true)}
                className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition-all"
              >
                Create Your First Budget
              </button>
            </div>
          ) : (
            budgets.map((budget, idx) => {
              const spent = budget.spent || 0;
              const limit = budget.limit || 1;
              const percentage = (spent / limit) * 100;
              const remaining = limit - spent;
              
              let statusColor = 'bg-emerald-500';
              let textColor = 'text-emerald-500';
              let ringColor = 'ring-emerald-500/20';
              
              if (percentage >= 100) {
                statusColor = 'bg-rose-500';
                textColor = 'text-rose-500';
                ringColor = 'ring-rose-500/20';
              } else if (percentage >= 80) {
                statusColor = 'bg-amber-500';
                textColor = 'text-amber-500';
                ringColor = 'ring-amber-500/20';
              }
              
              return (
                <motion.div 
                  key={budget.id || idx} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl hover:border-slate-600 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-500 transition-colors">{budget.category}</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{budget.period}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-slate-400 text-sm font-medium">Spent</span>
                        <span className={`text-xl font-black ${textColor}`}>{formatINR(spent)}</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-3 ring-4 ring-slate-900 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(percentage, 100)}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`${statusColor} h-full rounded-full relative`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
                      <div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Limit</p>
                        <p className="text-slate-200 font-bold">{formatINR(limit)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Remaining</p>
                        <p className={`font-bold ${remaining < 0 ? 'text-rose-500' : 'text-slate-200'}`}>
                          {remaining < 0 ? '-' : ''}{formatINR(Math.abs(remaining))}
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${textColor} ${ringColor} ring-1 bg-opacity-10`}>
                      {percentage >= 100 ? (
                        <><XCircle className="w-4 h-4" /> Over Budget!</>
                      ) : percentage >= 80 ? (
                        <><AlertCircle className="w-4 h-4" /> Warning: Near Limit</>
                      ) : (
                        <><CheckCircle2 className="w-4 h-4" /> On Track</>
                      )}
                      <span className="ml-auto">{percentage.toFixed(0)}% used</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
