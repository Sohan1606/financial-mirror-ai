import { useState } from 'react';
import { formatINR } from '../utils/formatINR';

function SuggestionCard({ icon, title, description, savings }) {
  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-3">
        <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
          <span className="text-xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-lg mb-1 group-hover:text-slate-100">
            {title}
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
            {description}
          </p>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
          <div className="font-bold text-emerald-400 text-lg">
            +{formatINR(savings)}
          </div>
          <div className="text-emerald-300 text-xs font-medium">saved</div>
        </div>
      </div>
    </div>
  );
}

export default function FixThisPanel({ highestSpendingCategory }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [potentialSavings, setPotentialSavings] = useState(0);

  const handleFixThisClick = () => {
    if (highestSpendingCategory) {
      const savings = Math.round(highestSpendingCategory.amount * 0.3);
      setPotentialSavings(savings);
      setShowSuggestions(true);
    }
  };

  if (!highestSpendingCategory) {
    return null;
  }

  const suggestedBudget = Math.round(highestSpendingCategory.amount * 0.7);

  return (
    <div className="bg-gradient-to-br from-rose-600/20 via-orange-500/10 to-yellow-500/10 border-2 border-rose-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl shadow-2xl flex-shrink-0">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2">
            Fix This Now
          </h2>
          <p className="text-rose-200 font-semibold uppercase text-xs tracking-wider">
            {highestSpendingCategory.name} is your biggest spending category
          </p>
          <p className="text-rose-300 text-sm">
            Current: {formatINR(highestSpendingCategory.amount)}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-8">
        <button
          onClick={handleFixThisClick}
          className="flex-1 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-lg border-2 border-rose-400/50 active:scale-95 flex items-center justify-center gap-3"
        >
          🚀 Fix This
          {showSuggestions && (
            <span className="ml-2 text-yellow-300 font-black text-sm animate-ping">
              {formatINR(potentialSavings)}
            </span>
          )}
        </button>

        {showSuggestions && (
          <button
            onClick={() => setShowSuggestions(false)}
            className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 border border-slate-700/50 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:border-slate-500/50 text-sm font-medium"
          >
            Hide
          </button>
        )}
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <div className="space-y-4 pt-6 border-t border-rose-500/20">
          {/* Savings Display */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-2xl p-6 backdrop-blur-sm text-center">
            <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-1">
              {formatINR(potentialSavings)}
            </div>
            <p className="text-emerald-200 font-semibold text-sm uppercase tracking-wider">
              Potential savings per month
            </p>
          </div>

          {/* Actionable Suggestions */}
          <div className="grid md:grid-cols-2 gap-4">
            <SuggestionCard 
              icon="✂️"
              title="Reduce Spending"
              description={`Cut ${highestSpendingCategory.name} expenses by 30% from ${formatINR(highestSpendingCategory.amount)}`}
              savings={potentialSavings}
            />
            
            <SuggestionCard 
              icon="📋"
              title="Set Budget Limit"
              description={`Create ${formatINR(suggestedBudget)} monthly budget for ${highestSpendingCategory.name}`}
              savings={Math.round(potentialSavings * 0.7)}
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 pt-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              📱 Add Budget Alert
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              📊 Track Progress
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
