import { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend 
} from 'recharts';
import { calculateFinancialAnalysis, getCategoryChartData, getMonthlyChartData, generateInsights, calculateHealthScore, getHealthScoreColor } from '../utils/financialCalculations';
import { formatINR } from '../utils/formatINR';


const FINTECH_COLORS = [
  '#10B981', // Emerald green - Income
  '#EF4444', // Red - Expenses
  '#3B82F6', // Blue - Savings
  '#F59E0B', // Amber
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EC4899', // Pink
];

export default function FintechDashboard({ transactions }) {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (transactions?.length > 0) {
      const result = calculateFinancialAnalysis(transactions);
      result.insights = generateInsights(result);
      result.healthScore = calculateHealthScore(result);
      setAnalysis(result);
    }
  }, [transactions]);

  const healthScore = analysis?.healthScore || 0;

  if (!analysis || analysis.totalTransactions === 0) {
    return (

      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl flex items-center justify-center mb-8 border-2 border-dashed border-slate-600">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-400 mb-2">No data yet</h3>
          <p className="text-slate-500 max-w-md mx-auto">Upload your CSV transactions to see your financial dashboard</p>
        </div>
      </div>
    );
  }

  const categoryChartData = getCategoryChartData(analysis);
  const dailyChartData = getMonthlyChartData(analysis).slice(-7); // Last 7 periods

  return (
    <div className="space-y-8">
      {/* Health Score KPI */}
      <div className="animate-slide-up">
        <div className={`glass-card p-8 md:p-12 text-center group`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <div className={`p-4 rounded-3xl shadow-2xl group-hover:scale-110 transition-all ${getHealthScoreColor(healthScore)}`}>
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0l9.192 9.193A.5.5 0 0114 16H4a.5.5 0 01-.354-.146l-1.472-1.472a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-200 mb-1">Financial Health Score</h2>
              <p className="text-slate-400 text-sm">How healthy is your financial situation?</p>
            </div>
          </div>
          
          <div className="text-5xl md:text-6xl font-black bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-4 leading-none">
            {healthScore}
          </div>
          <div className="text-2xl font-bold text-slate-300">
            /100
          </div>
          
          <div className="mt-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <p className="text-slate-400 text-sm">
              Based on your savings rate, spending habits, and category balance
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Total Income" 
          value={formatINR(analysis.totalIncome)}
          trend="+12.5%"
          color="from-emerald-500 to-emerald-600"
          icon="💰"
          description="All income sources"
        />
        <KPICard 
          title="Total Expenses" 
          value={formatINR(analysis.totalExpense)}
          trend="-8.2%"
          color="from-red-500 to-red-600"
          icon="💸"
          description="All spending"
        />
        <KPICard 
          title="Net Savings" 
          value={formatINR(analysis.savings)}
          trend={analysis.savings > 0 ? "+24.1%" : "0%"}
          color={analysis.savings > 0 ? "from-blue-500 to-blue-600" : "from-slate-500 to-slate-600"}
          icon="🏦"
          description="Income - Expenses"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Pie */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Spending Breakdown
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryChartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                cornerRadius={8}
              >
                {categoryChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={FINTECH_COLORS[index % FINTECH_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatINR(value), 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Top categories list */}
          <div className="mt-6 space-y-2">
            {categoryChartData.slice(0, 5).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 px-2 -m-2 rounded-xl hover:bg-slate-800/50 transition-all">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: FINTECH_COLORS[idx % FINTECH_COLORS.length] }}
                  />
                  <span className="font-medium text-slate-300 truncate">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-400">{formatINR(item.value)}</div>
                  <div className="text-xs text-slate-500">
                    {(item.value / analysis.totalExpense * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Expenses Bar */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/50 backdrop-blur-xl border border-slate-800/50 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
              Monthly Expenses Trend
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dailyChartData}>
              <CartesianGrid vertical={false} stroke="hsl(220 20% 15%)" strokeOpacity={0.5} />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tickMargin={12}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickMargin={12}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(value) => formatINR(value)}
              />
              <Tooltip 
                contentStyle={{
                  background: 'hsl(220 25% 15%)',
                  border: '1px solid hsl(220 20% 25%)',
                  borderRadius: '12px'
                }}
                formatter={(value) => [formatINR(value), 'Expenses']}
              />
              <Bar 
                dataKey="expenses" 
                fill="url(#expenseGradient)"
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EF4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={0.4} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Average indicator */}
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Avg monthly spend</span>
              <span className="font-bold text-emerald-400">
                {formatINR(analysis.monthlySpendingAverage)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Money Wasted Alert */}
      {analysis.highestSpendingCategory && (
        <div className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-400/30">
                <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-rose-200 mb-1">
                  Money Wasted Alert
                </h3>
                <p className="text-rose-300">
                  You've spent {formatINR(analysis.highestSpendingCategory.amount)} on{' '}
                  <span className="font-semibold">{analysis.highestSpendingCategory.name}</span> 
                  ({analysis.topCategoryPercent}%)
                </p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Review Spending →
            </button>
          </div>
        </div>
      )}

      {/* Insights */}
      {analysis.insights?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.insights.slice(0, 4).map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      )}
    </div>
  );
}

function KPICard({ title, value, trend, color, icon, description }) {
  return (
    <div className={`
      group relative bg-gradient-to-br ${color} hover:${color.replace('500', '400')} text-white 
      rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 
      hover:-translate-y-2 border border-white/20 overflow-hidden h-[160px]
    `}>
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-40 group-hover:translate-x-40 transition-transform duration-1000" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-xl text-xs font-bold tracking-wider">
            {trend}
          </div>
        </div>
        
        <div>
          <h3 className="text-3xl md:text-4xl font-bold mb-1 leading-tight">{value}</h3>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-white/50 text-xs mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const icon = insight.includes('⚠️') || insight.includes('High') ? '⚠️' : 
               insight.includes('✅') ? '✅' : '💡';

  return (
    <div className="group bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/70 hover:border-slate-600/50 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-400/30 flex-shrink-0 mt-0.5">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 leading-relaxed group-hover:text-white transition-colors font-medium">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
}

