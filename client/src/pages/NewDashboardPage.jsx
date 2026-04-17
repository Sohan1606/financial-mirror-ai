import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  BarChart3,
  PieChart,
  Calculator,
  Zap,
  ArrowRight,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  Upload as UploadIcon
} from 'lucide-react';
import { financeService } from '../services/api';
import { reportsApi, transactionsApi } from '../api';
import { formatINR } from '../utils/formatINR';
import DashboardLayout from '../components/layout/DashboardLayout';
import { generateSampleTransactions } from '../utils/sampleData';
import { useToast } from '../components/ui/Toast';

const SIMULATOR_CARDS = [
  {
    title: 'Reality Check',
    description: 'Get your financial health score',
    icon: BarChart3,
    link: '/simulators/reality-check',
    color: 'blue',
  },
  {
    title: 'Micro → Macro',
    description: 'See small spending impact over time',
    icon: TrendingUp,
    link: '/simulators/micro-macro',
    color: 'purple',
  },
  {
    title: 'Delay Cost',
    description: 'Invest vs spend comparison',
    icon: Calculator,
    link: '/simulators/delay-cost',
    color: 'green',
  },
  {
    title: 'Shock Mode',
    description: 'Test emergency resilience',
    icon: AlertTriangle,
    link: '/simulators/shock-mode',
    color: 'red',
  },
  {
    title: 'Scenario Builder',
    description: 'What-if financial simulations',
    icon: Zap,
    link: '/simulators/scenario-builder',
    color: 'indigo',
  },
  {
    title: 'Money Leaks',
    description: 'Find hidden spending patterns',
    icon: PieChart,
    link: '/leaks',
    color: 'orange',
  },
];

export default function NewDashboardPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [report, setReport] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [leaksSummary, setLeaksSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const [profileData, reportData, comparisonData, recentTxData, leaksData] = await Promise.all([
        financeService.getProfile().catch(() => ({ profile: { financialHealthScore: 0 } })),
        reportsApi.getMonthly(now.getFullYear(), now.getMonth() + 1).catch(() => ({ data: {} })),
        reportsApi.getComparison().catch(() => ({ data: {} })),
        transactionsApi.getAll({ limit: 5 }).catch(() => ({ data: { transactions: [] } })),
        financeService.analyzeLeaks().catch(() => ({ data: { totalLeakAmount: 0 } }))
      ]);

      setProfile(profileData.profile);
      setReport(reportData.data);
      setComparison(comparisonData.data);
      setRecentTransactions(recentTxData.data.transactions || []);
      setLeaksSummary(leaksData.data);

      // Check for onboarding
      if (!profileData.profile?.onboardingComplete && (recentTxData.data.transactions || []).length === 0) {
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrySampleData = async () => {
    try {
      const samples = generateSampleTransactions();
      for (const tx of samples) {
        await transactionsApi.create(tx);
      }
      toast.success('Generated 30 sample transactions!');
      setOnboardingStep(3);
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to generate sample data');
    }
  };

  const completeOnboarding = async () => {
    try {
      await financeService.saveProfile({ ...profile, onboardingComplete: true });
      setShowOnboarding(false);
      toast.success('Welcome to LeakLess AI!');
      loadDashboardData();
    } catch (error) {
      toast.error('Failed to complete onboarding');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  const healthScore = profile?.financialHealthScore || 0;
  const scoreColor = healthScore > 80 ? 'text-emerald-500' : healthScore > 50 ? 'text-amber-500' : 'text-rose-500';

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* Onboarding Modal */}
        {showOnboarding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
            <div
              className="bg-slate-900 border border-slate-800 p-10 rounded-[2.5rem] max-w-xl w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Zap className="w-40 h-40 text-emerald-500" />
              </div>

              <div className="relative z-10">
                {onboardingStep === 1 && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Welcome to LeakLess AI</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                      We're here to help you find invisible money. Let's set up your command center in 30 seconds.
                    </p>
                    <button
                      onClick={() => setOnboardingStep(2)}
                      className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 text-lg flex items-center justify-center gap-3 group"
                    >
                      Let's Find the Leaks <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <UploadIcon className="w-10 h-10 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Power Up Your Data</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                      Upload a CSV statement or try with sample data to see the AI CFO in action.
                    </p>
                    <div className="space-y-4">
                      <button
                        onClick={() => navigate('/transactions')}
                        className="w-full py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl transition-all border border-slate-700 text-lg"
                      >
                        Upload Bank Statement
                      </button>
                      <button
                        onClick={handleTrySampleData}
                        className="w-full py-5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-black rounded-2xl transition-all border border-emerald-500/20 text-lg"
                      >
                        Try with Sample Data
                      </button>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="text-slate-500 hover:text-slate-300 font-bold text-sm"
                      >
                        Skip for now
                      </button>
                    </div>
                  </div>
                )}

                {onboardingStep === 3 && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                      <Target className="w-10 h-10 text-purple-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Final Step: Income</h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-10">
                      What's your average monthly income? This helps us calculate your health score.
                    </p>
                    <div className="relative mb-10">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-xl font-bold">₹</div>
                      <input
                        type="number"
                        autoFocus
                        placeholder="50,000"
                        className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-6 py-5 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none text-2xl font-black"
                        onChange={(e) => setProfile({ ...profile, income: parseFloat(e.target.value) })}
                      />
                    </div>
                    <button
                      onClick={completeOnboarding}
                      className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-500/20 text-lg"
                    >
                      Enter Command Center
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Top Banner */}
        <div 
          className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-8 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-32 h-32 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h2 className="text-slate-400 font-bold uppercase tracking-wider text-sm mb-4">Financial Command Center</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-12">
              <div>
                <p className="text-slate-100 text-4xl font-black">
                  {formatINR(report?.income || 0)}
                </p>
                <p className="text-slate-400 text-sm mt-1">Total Earned This Month</p>
              </div>
              <div className="h-10 w-px bg-slate-700 hidden md:block" />
              <div>
                <p className="text-emerald-500 text-3xl font-bold">
                  {formatINR(report?.savings || 0)}
                </p>
                <p className="text-slate-400 text-sm mt-1">Net Received (Savings)</p>
              </div>
              <div className="h-10 w-px bg-slate-700 hidden md:block" />
              <div>
                <p className="text-rose-500 text-3xl font-bold">
                  {formatINR(leaksSummary?.totalLeakAmount || 0)}
                </p>
                <p className="text-slate-400 text-sm mt-1">Revenue Leaked</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Score Card */}
          <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-100 font-bold mb-6">Financial Health Score</h3>
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * healthScore) / 100}
                  className={`${scoreColor} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-black ${scoreColor}`}>{healthScore}</span>
                <span className="text-slate-500 font-bold text-sm uppercase">Score</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-6">
              {healthScore > 80 ? 'Excellent financial management!' : healthScore > 50 ? 'Room for improvement in your leaks.' : 'Urgent attention needed for leaks.'}
            </p>
          </div>

          {/* Quick Stats & Leak Alert */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-slate-400 text-sm font-bold">Income</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{formatINR(report?.income || 0)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-rose-500" />
                  </div>
                  <span className="text-slate-400 text-sm font-bold">Expenses</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{formatINR(report?.expenses || 0)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-slate-400 text-sm font-bold">Savings</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{formatINR(report?.savings || 0)}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-500" />
                  </div>
                  <span className="text-slate-400 text-sm font-bold">Savings Rate</span>
                </div>
                <p className="text-2xl font-bold text-slate-100">{report?.savingsRate || 0}%</p>
              </div>
            </div>

            {/* Leak Alert Card */}
            {leaksSummary?.totalLeakAmount > 0 && (
              <Link to="/leaks" className="block group">
                <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-3xl flex items-center justify-between group-hover:bg-rose-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20">
                      <ShieldAlert className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-rose-500 font-bold text-lg">Revenue Leaks Detected</h4>
                      <p className="text-slate-400 text-sm">We found ₹{formatINR(leaksSummary.totalLeakAmount)} in potential leaks this month.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-rose-500 font-bold">
                    Fix Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Transactions & Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-slate-100 font-bold">Recent Transactions</h3>
              <Link to="/transactions" className="text-emerald-500 text-sm font-bold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type === 'income' ? <Plus className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-slate-200 font-bold">{tx.category}</p>
                      <p className="text-slate-500 text-xs">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-slate-200'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-slate-500 text-center py-4">No transactions found.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 p-8 rounded-3xl flex flex-col">
            <h3 className="text-slate-100 font-bold mb-6">Month Comparison</h3>
            <div className="space-y-6 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Income</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-bold">{formatINR(comparison?.currentIncome || 0)}</span>
                  {comparison?.incomeChange > 0 ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-rose-500" />}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Expenses</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-bold">{formatINR(comparison?.currentExpenses || 0)}</span>
                  {comparison?.expensesChange > 0 ? <ArrowUpRight className="w-4 h-4 text-rose-500" /> : <ArrowDownRight className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
              <div className="h-px bg-slate-700 my-4" />
              <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                <p className="text-emerald-500 text-xs font-bold uppercase mb-1">CFO Insight</p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {comparison?.savingsChange > 0 
                    ? `You're saving ${formatINR(comparison.savingsChange)} more than last month. Keep the momentum!` 
                    : `Spending is up by ${formatINR(Math.abs(comparison?.expensesChange || 0))}. Check the Leak Detector for optimization.`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Simulator Shortcuts */}
        <div className="space-y-6">
          <h3 className="text-slate-100 font-bold">Advanced Simulations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {SIMULATOR_CARDS.map((card, index) => (
              <Link key={index} to={card.link}>
                <div
                  className="bg-slate-800/50 border border-slate-700 p-6 rounded-3xl h-full flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all group-hover:scale-110 ${
                    card.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                    card.color === 'purple' ? 'bg-purple-500/10 text-purple-500' :
                    card.color === 'green' ? 'bg-emerald-500/10 text-emerald-500' :
                    card.color === 'red' ? 'bg-rose-500/10 text-rose-500' :
                    card.color === 'indigo' ? 'bg-indigo-500/10 text-indigo-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-slate-200 font-bold text-sm mb-1">{card.title}</h4>
                  <p className="text-slate-500 text-[10px] leading-tight">{card.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
