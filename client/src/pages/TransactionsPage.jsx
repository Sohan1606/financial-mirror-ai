import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { transactionsApi, uploadApi } from '../api';
import { formatINR, formatDate } from '../utils/formatINR';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  Edit2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import Papa from 'papaparse';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    type: 'expense',
    category: '',
    description: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsApi.getAll({ limit: 1000 });
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await transactionsApi.update(editingId, newTx);
        setEditingId(null);
      } else {
        await transactionsApi.create(newTx);
      }
      setNewTx({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: 'expense',
        category: '',
        description: '',
      });
      setShowAddForm(false);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleEdit = (tx) => {
    setNewTx({
      date: new Date(tx.date).toISOString().split('T')[0],
      amount: tx.amount,
      type: tx.type,
      category: tx.category,
      description: tx.description || '',
    });
    setEditingId(tx.id);
    setShowAddForm(true);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadApi.uploadCSV(file);
      fetchTransactions();
      setShowUpload(false);
    } catch (error) {
      console.error('Failed to upload CSV:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await transactionsApi.delete(id);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredTransactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description?.toLowerCase().includes(search.toLowerCase()) || 
                           tx.category.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map(tx => tx.category));
    return Array.from(cats);
  }, [transactions]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <Receipt className="w-10 h-10 text-emerald-500" />
              Transaction Ledger
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Your financial history, analyzed and organized.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4" /> Import CSV
            </button>
            <button
              onClick={() => {
                setEditingId(null);
                setNewTx({
                  date: new Date().toISOString().split('T')[0],
                  amount: '',
                  type: 'expense',
                  category: '',
                  description: '',
                });
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-5 h-5" /> Add Entry
            </button>
          </div>
        </div>

        {/* Upload Panel */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl relative">
                <button onClick={() => setShowUpload(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-300">
                  <X className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center text-center max-w-md mx-auto">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">Bulk Import Transactions</h3>
                  <p className="text-slate-400 text-sm mb-6">Upload your bank statement in CSV format. We support standard columns: date, amount, type, category, description.</p>
                  <label className="w-full cursor-pointer bg-slate-900 border-2 border-dashed border-slate-700 hover:border-emerald-500/50 p-8 rounded-2xl transition-all group">
                    <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    <Upload className="w-8 h-8 text-slate-600 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
                    <span className="text-slate-500 group-hover:text-slate-300 font-medium">Click to browse or drag and drop</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl relative">
                <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-300">
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold text-slate-100 mb-6">{editingId ? 'Edit Transaction' : 'New Transaction Entry'}</h3>
                <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={newTx.date}
                      onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={newTx.amount}
                      onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Type</label>
                    <select
                      value={newTx.type}
                      onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Food"
                      value={newTx.category}
                      onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-slate-100 px-4 py-3 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                      {editingId ? 'Update Entry' : 'Post Entry'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/50 border border-slate-700 p-4 rounded-2xl">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search description or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 pl-11 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-sm outline-none"
              >
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-2 rounded-xl text-sm outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors text-sm font-bold px-4"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center text-slate-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
              <p>Fetching your ledger...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Receipt className="w-10 h-10 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">No entries found</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Try adjusting your filters or add your first transaction.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 border-b border-slate-700">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredTransactions.map((tx, idx) => (
                    <motion.tr 
                      key={tx.id || idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.01, 0.5) }}
                      className="group hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-8 py-4 text-slate-300 font-medium text-sm">
                        {formatDate(tx.date)}
                      </td>
                      <td className="px-8 py-4">
                        <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-xs font-bold text-slate-400">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-slate-400 text-sm italic">
                        {tx.description || 'No description'}
                      </td>
                      <td className={`px-8 py-4 text-right font-black text-base ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-200'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                          {formatINR(tx.amount)}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(tx)}
                            className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Placeholder */}
          <div className="bg-slate-900/50 border-t border-slate-700 p-6 flex items-center justify-between">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
              Showing {filteredTransactions.length} of {transactions.length} entries
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-500 disabled:opacity-50" disabled>
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-500 disabled:opacity-50" disabled>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
