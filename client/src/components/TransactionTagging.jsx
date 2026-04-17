import { formatINR } from '../utils/formatINR';

export default function TransactionTagging({ categoryTags, totalExpense }) {
  if (!categoryTags || totalExpense <= 0) {
    return null;
  }

  const tagConfig = {
    essential: {
      label: 'Essential',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-400/30',
      textColor: 'text-emerald-200',
      icon: '🏠'
    },
    lifestyle: {
      label: 'Lifestyle',
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30',
      textColor: 'text-blue-200',
      icon: '🎨'
    },
    waste: {
      label: 'Wasteful',
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-500/20',
      borderColor: 'border-rose-400/30',
      textColor: 'text-rose-200',
      icon: '⚠️'
    },
    neutral: {
      label: 'Neutral',
      color: 'from-slate-500 to-gray-500',
      bgColor: 'bg-slate-500/20',
      borderColor: 'border-slate-400/30',
      textColor: 'text-slate-200',
      icon: '📋'
    }
  };

  const sortedTags = Object.entries(categoryTags)
    .filter(([tag, amount]) => amount > 0)
    .sort(([,a], [,b]) => b - a);

  const wastePercentage = totalExpense > 0 ? ((categoryTags.waste || 0) / totalExpense * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Transaction Analysis
          </h2>
          <p className="text-slate-400">Smart categorization of your spending patterns</p>
        </div>
      </div>

      {/* Waste Alert */}
      {wastePercentage > 10 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-rose-500/20 to-red-500/20 border-2 border-rose-400/50 rounded-3xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-500/30 rounded-2xl border border-rose-400/40">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-rose-200 mb-1">
                High Wasteful Spending Detected
              </h3>
              <p className="text-rose-300">
                <span className="font-black text-rose-100">{wastePercentage.toFixed(1)}%</span> of your spending is potentially wasteful
              </p>
              <p className="text-rose-400 text-sm mt-2">
                Consider reducing subscriptions, impulse purchases, and entertainment expenses
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tag Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {sortedTags.map(([tag, amount]) => {
          const config = tagConfig[tag] || tagConfig.neutral;
          const percentage = ((amount / totalExpense) * 100).toFixed(1);
          
          return (
            <div 
              key={tag}
              className={`
                relative bg-gradient-to-br ${config.bgColor} border ${config.borderColor} 
                rounded-3xl p-6 backdrop-blur-sm hover:shadow-2xl 
                transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1
                group cursor-pointer
              `}
            >
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${config.color} rounded-3xl blur opacity-0 group-hover:opacity-30 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-r ${config.color} rounded-2xl group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{config.icon}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                    {percentage}%
                  </div>
                </div>
                
                <h3 className={`text-lg font-bold ${config.textColor} mb-2`}>
                  {config.label}
                </h3>
                <div className={`text-2xl font-black ${config.textColor} mb-1`}>
                  {formatINR(amount)}
                </div>
                <p className={`text-sm ${config.textColor} opacity-80`}>
                  {tag === 'waste' ? 'Reduce this category' : 
                   tag === 'essential' ? 'Necessary expenses' :
                   tag === 'lifestyle' ? 'Quality of life' : 'Uncategorized'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/30">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          AI Spending Insights
        </h3>
        <div className="space-y-3">
          {wastePercentage > 20 && (
            <div className="flex items-start gap-3">
              <span className="text-rose-400 mt-1">•</span>
              <p className="text-slate-300 text-sm">
                <strong>High waste detected:</strong> {wastePercentage.toFixed(1)}% of spending could be optimized. Focus on reducing subscriptions and impulse purchases.
              </p>
            </div>
          )}
          
          {(categoryTags.essential || 0) > (categoryTags.lifestyle || 0) && (
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <p className="text-slate-300 text-sm">
                <strong>Good balance:</strong> Your essential spending outweighs lifestyle expenses, showing responsible financial priorities.
              </p>
            </div>
          )}
          
          {(categoryTags.lifestyle || 0) > (totalExpense * 0.3) && (
            <div className="flex items-start gap-3">
              <span className="text-amber-400 mt-1">•</span>
              <p className="text-slate-300 text-sm">
                <strong>Lifestyle spending high:</strong> Consider setting a monthly budget for entertainment and shopping to improve savings.
              </p>
            </div>
          )}
          
          {wastePercentage < 5 && (
            <div className="flex items-start gap-3">
              <span className="text-emerald-400 mt-1">•</span>
              <p className="text-slate-300 text-sm">
                <strong>Excellent spending habits:</strong> Only {wastePercentage.toFixed(1)}% wasteful spending. You're making smart financial choices!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
