import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { transactionsApi, reportsApi } from '../api';
import { formatINR } from '../utils/formatINR';
import { calculateHealthScore, calculateSavingsRate } from '../utils/financialCalculations';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const now = new Date();
      const [monthlyReport, transactions] = await Promise.all([
        reportsApi.getMonthly(now.getFullYear(), now.getMonth() + 1),
        transactionsApi.getAll({ limit: 1000 }),
      ]);

      const reportData = monthlyReport.data;
      setReport(reportData);

      const savingsRate = calculateSavingsRate(reportData.income, reportData.expenses);
      const score = calculateHealthScore(reportData.income, reportData.expenses, savingsRate);
      setHealthScore(score);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const categoryData = report?.categoryBreakdown
    ? Object.entries(report.categoryBreakdown).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your financial overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-600 mb-2">Income</p>
          <p className="text-3xl font-bold text-green-600">{formatINR(report?.income || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-600 mb-2">Expenses</p>
          <p className="text-3xl font-bold text-red-600">{formatINR(report?.expenses || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-600 mb-2">Savings</p>
          <p className="text-3xl font-bold text-blue-600">{formatINR(report?.savings || 0)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition">
          <p className="text-sm font-medium text-gray-600 mb-2">Health Score</p>
          <p className="text-3xl font-bold text-purple-600">{healthScore}/100</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No data yet</p>
              <p className="text-gray-400 mt-2">Add transactions to see insights!</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Top Categories</h3>
          {report?.topCategories && report.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={report.topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatINR(value)} />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No data available</p>
              <p className="text-gray-400 mt-2">Start tracking your expenses!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
