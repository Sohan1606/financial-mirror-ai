import FintechDashboard from './FintechDashboard';
import { calculateFinancialAnalysis } from '../utils/financialCalculations';


const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export default function Dashboard({ transactions }) {
  const analysis = calculateFinancialAnalysis(transactions || []);

  const { analysis, loading } = useAnalysis();

  if (loading || !analysis) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const categoryData = Object.entries(analysis.categoryBreakdown || {}).map(([name, value]) => ({
    name,
    value: Number(value),
  })).slice(0, 6);

  const monthlyData = Object.entries(analysis.monthlyExpenses || {}).map(([month, value]) => ({
    month,
    expenses: Number(value),
  })).slice(-12);

  return <FintechDashboard transactions={transactions} />;

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Income"
          value={`$${analysis.income?.toLocaleString() || 0}`}
          change="+12.5%"
          color="emerald"
          icon="💰"
        />
        <StatCard
          title="Total Expenses"
          value={`$${analysis.expenses?.toLocaleString() || 0}`}
          change="-8.2%"
          color="red"
          icon="💸"
        />
        <StatCard
          title="Savings"
          value={`$${analysis.savings?.toLocaleString() || 0}`}
          change={analysis.savings > 0 ? '+24.1%' : '0%'}
          color={analysis.savings > 0 ? 'emerald' : 'slate'}
          icon="🏦"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Category Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-[400px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            📊 Spending by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Expenses Bar Chart */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl h-[400px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            📈 Expenses Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={10} />
              <YAxis axisLine={false} tickLine={false} tickMargin={10} />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="col-span-full">
        <div className="bg-gradient-to-r from-slate-800/70 to-slate-900/70 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Financial Insights
              </h3>
              <p className="text-slate-400">Smart analysis of your spending patterns</p>
            </div>
          </div>

          <div className="space-y-4">
            {analysis.insights?.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>

          <TopSpendingAlert 
            category={analysis.topSpendingCategory?.[0]} 
            amount={analysis.topSpendingCategory?.[1]} 
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, color, icon }) {
  return (
    <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:border-slate-600/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          change.startsWith('+') 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
            : 'bg-red-500/20 text-red-300 border-red-500/30'
        } border`}>
          {change}
        </span>
      </div>
      <h4 className="text-3xl font-bold text-white mb-1 group-hover:text-slate-100 transition-colors">{value}</h4>
      <p className="text-slate-400 text-sm">{title}</p>
    </div>
  );
}

function InsightCard({ insight }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-slate-700/50 border border-slate-600/50 rounded-2xl hover:bg-slate-700/70 transition-all duration-300 hover:shadow-xl group">
      <div className="flex-shrink-0 mt-0.5">
        <span className="text-xl">💡</span>
      </div>
      <p className="text-slate-200 leading-relaxed flex-1 group-hover:text-white transition-colors">{insight}</p>
    </div>
  );
}

function TopSpendingAlert({ category, amount }) {
  if (!category) return null;
  
  const saveSuggestion = Math.round(amount * 0.2);
  
  return (
    <div className="mt-8 pt-8 border-t border-slate-700/50">
      <div className="bg-gradient-to-r from-rose-500/20 to-orange-500/20 border border-rose-500/40 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-2 bg-rose-500/80 rounded-xl">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <h4 className="font-bold text-lg text-rose-200">
              Top Spending Category: {category}
            </h4>
            <p className="text-rose-300">${amount.toLocaleString()} total spent</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-6 border-t border-rose-500/20">
          <p className="text-center text-rose-200 text-sm">
            💡 Fix This: Reduce by 20% to save
          </p>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-emerald-500/50 text-lg">
            Save ${saveSuggestion.toLocaleString()}/month
          </div>
        </div>
      </div>
    </div>
  );
}

