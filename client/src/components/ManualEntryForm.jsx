import { useState } from 'react';
import { calculateFinancialAnalysis } from '../utils/financialCalculations';

export default function ManualEntryForm({ transactions, onTransactionsUpdate }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    type: 'expense',
    category: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Groceries', 'Dining', 'Entertainment', 'Transport', 'Utilities', 
    'Shopping', 'Subscription', 'Salary', 'Freelance', 'Investment'
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter valid amount');
      return;
    }

    setIsSubmitting(true);
    
    // Add new transaction
    const newTransaction = {
      date: formData.date,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category || 'Other'
    };

    const updatedTransactions = [...transactions, newTransaction];
    onTransactionsUpdate(updatedTransactions);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().slice(0, 10),
      amount: '',
      type: 'expense',
      category: ''
    });

    setTimeout(() => setIsSubmitting(false), 1000);
  };

  return (
    <div className="glass-card p-8 max-w-md mx-auto animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold gradient-text mb-2">Quick Add</h3>
        <p className="text-slate-400">Add transaction manually</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm focus:ring-4 ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 text-slate-200 placeholder-slate-500 font-medium"
            required
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">$ Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="125.50"

            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm focus:ring-4 ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 text-2xl font-bold text-emerald-400 placeholder-slate-500"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Type</label>
          <div className="flex space-x-3">
            <label className="flex items-center space-x-2 flex-1 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:bg-emerald-500/10 hover:border-emerald-400/50 cursor-pointer transition-all group">
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleInputChange}
                className="w-5 h-5 text-emerald-500 bg-slate-900 border-slate-700/50 focus:ring-emerald-500 rounded-full"
              />
              <span className="font-semibold text-emerald-400 group-hover:text-emerald-300">Income 💰</span>
            </label>
            <label className="flex items-center space-x-2 flex-1 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl backdrop-blur-sm hover:bg-red-500/10 hover:border-red-400/50 cursor-pointer transition-all group">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleInputChange}
                className="w-5 h-5 text-red-500 bg-slate-900 border-slate-700/50 focus:ring-red-500 rounded-full"
              />
              <span className="font-semibold text-red-400 group-hover:text-red-300">Expense 💸</span>
            </label>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-2xl backdrop-blur-sm focus:ring-4 ring-indigo-500/30 focus:border-indigo-500/70 transition-all duration-300 text-slate-200 font-medium"
          >
            <option value="">Select category...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary transform hover:-translate-y-0.5"
        >
          {isSubmitting ? (
            <>
              <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" pathLength="1" className="opacity-25" />
                <path d="M12 4V2A10 10 0 0 1 22 12H20" stroke="currentColor" strokeWidth="3" pathLength="0.25" className="opacity-75" />
              </svg>
              Adding...
            </>
          ) : (
            'Add Transaction 🚀'
          )}
        </button>
      </form>

      {transactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-sm text-slate-400">
            Total transactions: <span className="font-bold text-emerald-400">{transactions.length}</span>
          </p>
        </div>
      )}
    </div>
  );
}

