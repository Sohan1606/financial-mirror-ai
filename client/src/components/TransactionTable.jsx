import { useState, useMemo } from 'react';
import { formatINR } from '../utils/formatINR';

export default function TransactionTable({ transactions, onTransactionsUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = useState({
    type: 'all', // 'all' | 'income' | 'expense'
    category: 'all',
    dateRange: { from: '', to: '' }
  });
  const [searchTerm, setSearchTerm] = useState('');

  const rowsPerPage = 10;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Date range filter
    if (filters.dateRange.from && filters.dateRange.to) {
      filtered = filtered.filter(t => {
        const date = new Date(t.date);
        return date >= new Date(filters.dateRange.from) && date <= new Date(filters.dateRange.to);
      });
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.date.includes(searchTerm)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return filtered;
  }, [transactions, filters, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredTransactions.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = (index) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const newTransactions = [...transactions];
      newTransactions.splice(index, 1);
      onTransactionsUpdate(newTransactions);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) {
      alert('Please select transactions to delete');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedRows.size} transactions?`)) {
      const newTransactions = transactions.filter((_, index) => !selectedRows.has(index));
      onTransactionsUpdate(newTransactions);
      setSelectedRows(new Set());
    }
  };

  const handleExport = () => {
    const headers = ['date', 'amount', 'type', 'category'];
    const rows = filteredTransactions.map(t => [t.date, t.amount, t.type, t.category]);
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueCategories = [...new Set(transactions.map(t => t.category))];

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-200">Transaction Management</h3>
        <div className="text-sm text-slate-400">
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
          <select 
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select 
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by category or date..."
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateRange.from}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, from: e.target.value }}))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateRange.to}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: { ...prev.dateRange, to: e.target.value }}))}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
        >
          📥 Export CSV
        </button>
        {selectedRows.size > 0 && (
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            🗑️ Delete Selected ({selectedRows.size})
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-600/50">
              <th className="py-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(new Set(paginatedData.map((_, index) => startIndex + index)));
                    } else {
                      setSelectedRows(new Set());
                    }
                  }}
                  className="rounded border-slate-600/50"
                />
              </th>
              <th 
                className="py-3 px-4 text-left font-semibold cursor-pointer transition-colors hover:text-slate-200"
                onClick={() => handleSort('date')}
              >
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-3 px-4 text-left font-semibold cursor-pointer transition-colors hover:text-slate-200"
                onClick={() => handleSort('category')}
              >
                Category {sortConfig.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-3 px-4 text-left font-semibold cursor-pointer transition-colors hover:text-slate-200"
                onClick={() => handleSort('type')}
              >
                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-3 px-4 text-left font-semibold">
                Amount
              </th>
              <th className="py-3 px-4 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((transaction, index) => (
              <tr key={startIndex + index} className="border-b border-slate-700/50 hover:bg-slate-600/30 transition-colors">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(startIndex + index)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedRows);
                      if (e.target.checked) {
                        newSelected.add(startIndex + index);
                      } else {
                        newSelected.delete(startIndex + index);
                      }
                      setSelectedRows(newSelected);
                    }}
                    className="rounded border-slate-600/50"
                  />
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-slate-300 capitalize">
                  {transaction.category}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
                      : 'bg-red-500/20 text-red-300 border border-red-400/50'
                  }`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-slate-200">
                  {formatINR(transaction.amount)}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(startIndex + index)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-xl transition-colors ${
                  page === currentPage 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-700/50 text-slate-200 hover:bg-slate-600/50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
