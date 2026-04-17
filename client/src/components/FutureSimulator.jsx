import { useMemo } from 'react';
import { formatINR } from '../utils/formatINR';

export default function FutureSimulator({ analysis }) {
  const futureProjection = useMemo(() => {
    if (!analysis || analysis.totalIncome === 0 || analysis.totalTransactions === 0) {
      return null;
    }

    // Monthly savings (average)
    const monthlyIncome = analysis.totalIncome / Math.max(1, analysis.incomeTransactions || 1);
    const monthlyExpense = analysis.totalExpense / Math.max(1, analysis.expenseTransactions || 1);
    const currentMonthlySavings = monthlyIncome - monthlyExpense;

    // Current future (2 years = 24 months)
    const currentFutureSavings = Math.round(currentMonthlySavings * 24);

    // Improved: reduce top category by 30%
    let improvedMonthlyExpense = monthlyExpense;
    if (analysis.highestSpendingCategory) {
      const topMonthly = analysis.highestSpendingCategory.amount / Math.max(1, analysis.expenseTransactions || 1);
      improvedMonthlyExpense = monthlyExpense - (topMonthly * 0.3);
    }
    
    const improvedMonthlySavings = monthlyIncome - improvedMonthlyExpense;
    const improvedFutureSavings = Math.round(improvedMonthlySavings * 24);

    const difference = improvedFutureSavings - currentFutureSavings;
    const monthlyLoss = Math.round(difference / 24); // Loss per month

    return {
      current: currentFutureSavings,
      improved: improvedFutureSavings,
      difference,
      monthlyLoss,
      monthlyIncome,
      monthlyExpense
    };
  }, [analysis]);

  if (!futureProjection) {
    return null;
  }

  return (
    <div className="glass-card p-8 md:p-12 animate-slide-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Your Financial Future
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Projected savings in next 2 years (24 months)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Current Future (Red - Warning) */}
        <div className="group relative bg-gradient-to-br from-rose-600/20 via-red-500/10 to-orange-500/20 border-2 border-rose-500/40 rounded-3xl p-8 md:p-10 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/20 to-red-400/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-rose-500/30 border-2 border-rose-400/50 rounded-3xl group-hover:bg-rose-500/50 transition-all">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6 .184a21.046 21.046 0 01-10 3.184M6.816 7.937a21.046 21.046 0 01-4-2.184m13.184 4.184L18 12m0 0l-3 3m3-3H18" />
              </svg>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-rose-200 mb-4 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent leading-tight">
              {formatINR(futureProjection.current)}
            </h3>
            
            <p className="text-rose-300 font-semibold text-lg mb-2">
              Current Path
            </p>
            <p className="text-rose-200 text-sm opacity-90">
              At your current spending habits
            </p>
          </div>
        </div>

        {/* Improved Future (Green - Hope) */}
        <div className="group relative bg-gradient-to-br from-emerald-600/20 via-teal-500/10 to-emerald-500/20 border-2 border-emerald-500/40 rounded-3xl p-8 md:p-10 backdrop-blur-xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-400/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-emerald-500/30 border-2 border-emerald-400/50 rounded-3xl group-hover:bg-emerald-500/50 transition-all">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-emerald-200 mb-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent leading-tight">
              {formatINR(futureProjection.improved)}
            </h3>
            
            <p className="text-emerald-300 font-semibold text-lg mb-2">
              Optimized Path
            </p>
            <p className="text-emerald-200 text-sm opacity-90">
              Reduce top category by 30%
            </p>
          </div>
        </div>
      </div>

      {/* Difference Highlight */}
      <div className="mt-12 pt-8 border-t border-slate-700/50 text-center">
        {/* Monthly Loss Warning */}
        <div className="mt-8 p-6 bg-gradient-to-r from-rose-500/20 to-red-500/20 border-2 border-rose-400/50 rounded-3xl backdrop-blur-xl animate-pulse">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-2 bg-rose-500/30 rounded-2xl border border-rose-400/40">
              <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 .184a21.046 21.046 0 01-10 3.184M6.816 7.937a21.046 21.046 0 01-4-2.184m13.184 4.184L18 12m0 0l-3 3m3-3H18" />
              </svg>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-rose-200 bg-gradient-to-r from-rose-400 to-red-400 bg-clip-text text-transparent">
                {formatINR(futureProjection.monthlyLoss)}
              </h4>
              <p className="text-rose-300 font-semibold text-sm mt-1">Lost every month</p>
            </div>
          </div>
          <p className="text-center text-rose-200 font-semibold text-lg animate-pulse">
            You are losing <span className="text-rose-100 font-black">{formatINR(futureProjection.monthlyLoss)}</span> every month by not fixing this.
          </p>
        </div>

        {/* Total Difference */}
        <div className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 px-8 py-6 rounded-3xl border-2 border-emerald-400/50 backdrop-blur-sm mt-8 mx-auto max-w-md shadow-2xl">
          <div className="text-3xl font-black text-emerald-400">
            +{formatINR(futureProjection.difference)}
          </div>
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="text-right">
            <div className="text-emerald-300 font-bold text-lg">Extra in 2 years</div>
            <div className="text-emerald-200 font-semibold">Your potential gain</div>
          </div>
        </div>
        
        <p className="text-slate-400 mt-6 text-sm max-w-2xl mx-auto text-center">
          Projection based on monthly averages: Income {formatINR(Math.round(futureProjection.monthlyIncome))} vs Expenses {formatINR(Math.round(futureProjection.monthlyExpense))}
        </p>
      </div>

    </div>
  );
}

