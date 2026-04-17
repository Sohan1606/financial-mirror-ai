import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { reportsApi } from '../api';
import { formatINR } from '../utils/formatINR';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  BarChart3,
  FileText
} from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function ReportsPage() {
  const [yearlyReport, setYearlyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    fetchReports();
  }, [selectedYear, selectedMonth]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [yearly, monthly, comp] = await Promise.all([
        reportsApi.getYearly(selectedYear),
        reportsApi.getMonthly(selectedYear, selectedMonth),
        reportsApi.getComparison(),
      ]);
      setYearlyReport(yearly.data);
      setMonthlyReport(monthly.data);
      setComparison(comp.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !yearlyReport) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const categoryData = monthlyReport?.categoryBreakdown
    ? Object.entries(monthlyReport.categoryBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 print:p-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
          <div>
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-emerald-500" />
              Financial Intelligence
            </h1>
            <p className="text-slate-400 mt-2 text-lg">Deep dive into your spending patterns and trends.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent text-slate-200 text-sm font-bold px-3 py-2 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-slate-800">
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              <div className="w-px bg-slate-700 my-2" />
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent text-slate-200 text-sm font-bold px-3 py-2 outline-none cursor-pointer"
              >
                {[2023, 2024, 2025, 2026].map(y => (
                  <option key={y} value={y} className="bg-slate-800">{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Comparison Strip */}
        {comparison && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Income vs Last Month</span>
                {comparison.incomeChange >= 0 ? <TrendingUp className="text-emerald-500 w-5 h-5" /> : <TrendingDown className="text-rose-500 w-5 h-5" />}
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-black text-slate-100">{formatINR(comparison.currentIncome)}</p>
                <p className={`text-sm font-bold mb-1 ${comparison.incomeChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {comparison.incomeChange >= 0 ? '+' : ''}{comparison.incomeChange.toFixed(1)}%
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Expenses vs Last Month</span>
                {comparison.expensesChange <= 0 ? <TrendingDown className="text-emerald-500 w-5 h-5" /> : <TrendingUp className="text-rose-500 w-5 h-5" />}
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-black text-slate-100">{formatINR(comparison.currentExpenses)}</p>
                <p className={`text-sm font-bold mb-1 ${comparison.expensesChange <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {comparison.expensesChange >= 0 ? '+' : ''}{comparison.expensesChange.toFixed(1)}%
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-bold uppercase tracking-wider">Savings Rate</span>
                <PieChartIcon className="text-blue-500 w-5 h-5" />
              </div>
              <div className="flex items-end gap-3">
                <p className="text-3xl font-black text-slate-100">{monthlyReport?.savingsRate || 0}%</p>
                <p className="text-slate-500 text-sm mb-1 font-bold">Goal: 20%</p>
              </div>
            </motion.div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trend Area Chart */}
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              Monthly Cash Flow Trend
            </h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyReport?.monthlyBreakdown}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    tickFormatter={(m) => new Date(0, m - 1).toLocaleString('default', { month: 'short' })}
                  />
                  <YAxis stroke="#64748b" tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    formatter={(val) => formatINR(val)}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown Pie Chart */}
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-500" />
              Category Spend Allocation
            </h3>
            <div className="h-[350px] w-full flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatINR(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 mt-4 md:mt-0 space-y-2 max-h-full overflow-y-auto px-4">
                {categoryData.sort((a,b) => b.value - a.value).map((item, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-slate-400 text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-200 text-sm font-bold">{formatINR(item.value)}</span>
                  </div>
                ))}
                {categoryData.length === 0 && <p className="text-slate-500 text-center">No data for this month.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Category Trends / Comparison Table */}
        <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl overflow-hidden">
          <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Year-over-Year Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Month</th>
                  <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Income</th>
                  <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Expenses</th>
                  <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Savings</th>
                  <th className="pb-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Transactions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {yearlyReport?.monthlyBreakdown.map((row, idx) => (
                  <tr key={idx} className="group hover:bg-slate-700/30 transition-colors">
                    <td className="py-4 text-slate-200 font-bold">
                      {new Date(0, row.month - 1).toLocaleString('default', { month: 'long' })}
                    </td>
                    <td className="py-4 text-emerald-500 font-bold">{formatINR(row.income)}</td>
                    <td className="py-4 text-rose-500 font-bold">{formatINR(row.expenses)}</td>
                    <td className="py-4 text-slate-200 font-bold">{formatINR(row.savings)}</td>
                    <td className="py-4 text-slate-400 text-sm">{row.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CFO Summary Insight */}
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex items-start gap-6">
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-emerald-500 mb-2">AI CFO Executive Summary</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              {comparison?.savingsChange > 0 
                ? `Outstanding progress! Your savings have increased by ${formatINR(comparison.savingsChange)} compared to last month. This puts you on a trajectory to reach your annual goals ${Math.abs(comparison.savingsChange) > 5000 ? 'ahead of schedule' : 'on time'}.` 
                : `We've noticed a slight dip in savings this month due to increased spending in categories like ${categoryData[0]?.name || 'various categories'}. Fixing the detected leaks could immediately boost your savings rate back above 20%.`}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
