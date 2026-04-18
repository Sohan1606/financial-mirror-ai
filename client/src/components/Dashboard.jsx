import React from 'react';
import FintechDashboard from './FintechDashboard';
import FixThisPanel from './FixThisPanel';
import { calculateFinancialAnalysis } from '../utils/financialCalculations';
import { useAnalysis } from '../context/AnalysisContext';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend 
} from 'recharts';

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

function StatCard({ title, value, change, color, icon }) {
  const colorClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
    slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <div className={`p-6 rounded-3xl border ${colorClasses[color]} backdrop-blur-xl`}>
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl">{icon}</div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${color === 'red' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
          {change}
        </div>
      </div>
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}

export default function Dashboard({ transactions }) {
  const { analysis, loading } = useAnalysis();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!analysis) return null;

  const categoryData = Object.entries(analysis.categoryBreakdown || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  })).slice(0, 6);

  const monthlyData = Object.entries(analysis.monthlyExpenses || {}).map(([month, value]) => ({
    month,
    expenses: Number(value),
  })).slice(-12);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FintechDashboard transactions={transactions} />
        </div>
        <div className="space-y-8">
          <FixThisPanel highestSpendingCategory={analysis.topSpendingCategory} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={`₹${analysis.income?.toLocaleString() || 0}`}
          change="+12.5%"
          color="emerald"
          icon="💰"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${analysis.expenses?.toLocaleString() || 0}`}
          change="-8.2%"
          color="red"
          icon="💸"
        />
        <StatCard
          title="Savings"
          value={`₹${analysis.savings?.toLocaleString() || 0}`}
          change={analysis.savings > 0 ? '+24.1%' : '0%'}
          color={analysis.savings > 0 ? 'emerald' : 'slate'}
          icon="🏦"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Pie Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            📊 Spending by Category
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="name"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
            📈 Expenses Over Time
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={10}
                  tick={{ fill: '#94a3b8' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickMargin={10}
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
