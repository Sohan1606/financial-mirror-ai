import { formatINR } from '../utils/formatINR';

export default function BiggestMoneyLeak({ highestSpendingCategory, totalExpense, categoryTotals }) {
  if (!highestSpendingCategory || totalExpense <= 0) {
    return null;
  }

  const percentage = ((highestSpendingCategory.amount / totalExpense) * 100).toFixed(1);
  const isHighPercentage = parseFloat(percentage) > 30;

  return (
    <div className={`
      relative bg-gradient-to-br border-2 rounded-3xl p-8 backdrop-blur-xl shadow-2xl
      animate-slide-up transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1
      ${isHighPercentage 
        ? 'from-rose-600/20 via-red-500/10 to-orange-500/20 border-rose-500/40 ring-2 ring-rose-500/30' 
        : 'from-amber-600/20 via-yellow-500/10 to-orange-500/20 border-amber-500/40 ring-2 ring-amber-500/30'
      }
    `}>
      {/* Glow effect for high percentage */}
      {isHighPercentage && (
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/10 to-red-400/10 rounded-3xl blur-xl animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className={`
          p-4 rounded-3xl shadow-2xl flex-shrink-0
          ${isHighPercentage 
            ? 'bg-gradient-to-br from-rose-500 to-orange-500' 
            : 'bg-gradient-to-br from-amber-500 to-orange-500'
          }
        `}>
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className={`
            text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2
            ${isHighPercentage 
              ? 'from-rose-400 via-red-400 to-orange-400' 
              : 'from-amber-400 via-yellow-400 to-orange-400'
            }
          `}>
            {isHighPercentage ? '⚠️ Biggest Money Leak' : '📊 Top Spending Category'}
          </h2>
          <p className={`
            font-semibold text-lg
            ${isHighPercentage ? 'text-rose-200' : 'text-amber-200'}
          `}>
            {highestSpendingCategory.name}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className={`
            text-4xl md:text-5xl font-black bg-gradient-to-r bg-clip-text text-transparent mb-2 leading-tight
            ${isHighPercentage 
              ? 'from-rose-300 to-red-300' 
              : 'from-amber-300 to-yellow-300'
            }
          `}>
            {formatINR(highestSpendingCategory.amount)}
          </div>
          <p className={`
            font-semibold text-lg
            ${isHighPercentage ? 'text-rose-300' : 'text-amber-300'}
          `}>
            {percentage}% of total expenses
          </p>
        </div>

        {/* Warning/Info Message */}
        <div className={`
          p-6 rounded-2xl backdrop-blur-sm border
          ${isHighPercentage 
            ? 'bg-rose-500/10 border-rose-400/30' 
            : 'bg-amber-500/10 border-amber-400/30'
          }
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              p-2 rounded-xl flex-shrink-0
              ${isHighPercentage ? 'bg-rose-500/30' : 'bg-amber-500/30'}
            `}>
              <svg className={`
                w-6 h-6
                ${isHighPercentage ? 'text-rose-400' : 'text-amber-400'}
              `} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className={`
                font-semibold text-base
                ${isHighPercentage ? 'text-rose-200' : 'text-amber-200'}
              `}>
                {isHighPercentage 
                  ? `This is unusually high! ${percentage}% of your spending goes to one category.`
                  : `${percentage}% of your expenses are in this category.`
                }
              </p>
              <p className={`
                text-sm mt-1
                ${isHighPercentage ? 'text-rose-300' : 'text-amber-300'}
              `}>
                {isHighPercentage 
                  ? 'Consider reducing this category to improve your financial health.'
                  : 'Monitor this category to ensure it stays within reasonable limits.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-bold text-slate-200">
              {Object.keys(categoryTotals || {}).length}
            </div>
            <div className="text-sm text-slate-400">Total Categories</div>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="text-2xl font-bold text-slate-200">
              {formatINR(totalExpense - highestSpendingCategory.amount)}
            </div>
            <div className="text-sm text-slate-400">Other Expenses</div>
          </div>
        </div>
      </div>
    </div>
  );
}
