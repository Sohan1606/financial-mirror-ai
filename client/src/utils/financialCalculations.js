// Financial calculation utilities
// Input: transactions array with {date, amount, type, category}

/**
 * Calculate Financial Health Score (0-100)
 */
export function calculateHealthScore({ totalIncome, totalExpense, savings, categoryTotals, highestSpendingCategory }) {
  if (totalIncome <= 0) return 0;

  let score = 50; // Base

  // Savings Rate (0-30 points)
  const savingsRate = (savings / totalIncome) * 100;
  score += Math.min(30, savingsRate * 1.5);

  // Spending Ratio (0-30 points) - lower is better
  const spendingRatio = (totalExpense / totalIncome) * 100;
  score += Math.max(0, 30 - (spendingRatio * 0.5));

  // Top Category Dependency (0-20 points) - less dependency better
  if (highestSpendingCategory && totalExpense > 0) {
    const topDependency = (highestSpendingCategory.amount / totalExpense) * 100;
    score += Math.max(0, 20 - topDependency);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Get health score color
 */
export function getHealthScoreColor(score) {
  if (score <= 40) return 'bg-gradient-to-r from-rose-500 to-red-500 text-rose-100';
  if (score <= 70) return 'bg-gradient-to-r from-orange-500 to-amber-500 text-orange-100';
  return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-emerald-100';
}

/**
 * Generate natural AI-style financial insights
 */
export function generateAIInsights({ totalIncome, totalExpense, savings, categoryTotals, highestSpendingCategory }) {

  const insights = [];

  if (totalIncome <= 0) {
    insights.push("Add income transactions to get complete analysis.");
    return insights;
  }

  // 1. Spending ratio insight
  const spendingRatio = (totalExpense / totalIncome * 100).toFixed(1);
  if (parseFloat(spendingRatio) > 70) {
    insights.push(`You are spending ${spendingRatio}% of your income. Try to keep it under 70% for healthy finances.`);
  } else if (parseFloat(spendingRatio) < 50) {
    insights.push(`Excellent! You're spending only ${spendingRatio}% of income and saving the rest.`);
  }

  // 2. Savings rate
  const savingsRate = (savings / totalIncome * 100).toFixed(1);
  if (parseFloat(savingsRate) < 10) {
    insights.push(`Your savings rate of ${savingsRate}% is below healthy level. Aim for 20%+ savings.`);
  } else if (parseFloat(savingsRate) > 30) {
    insights.push(`Impressive ${savingsRate}% savings rate! You're building wealth effectively.`);
  }

  // 3. Top spending category
  if (highestSpendingCategory) {
    const topPercent = (highestSpendingCategory.amount / totalExpense * 100).toFixed(1);
    insights.push(`You are spending ${topPercent}% of expenses (${highestSpendingCategory.amount.toLocaleString()}) on ${highestSpendingCategory.name}.`);

    // Savings suggestion
    const potentialSavings = Math.round(highestSpendingCategory.amount * 0.2);
    if (potentialSavings > 500) {
      insights.push(`You can save $${potentialSavings.toLocaleString()}/month by reducing ${highestSpendingCategory.name} expenses by 20%.`);
    }
  }

  // 4. Category warnings (top 3 categories > 25% each)
  Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .forEach(([category, amount]) => {
      const catPercent = (amount / totalExpense * 100);
      if (catPercent > 25) {
        const reductionTarget = Math.round(amount * 0.15);
        insights.push(`⚠️ ${category} takes ${catPercent.toFixed(1)}% of spending. Cutting 15% could save $${reductionTarget.toLocaleString()}.`);
      }
    });

  // 5. Overall health score
  const healthScore = Math.max(0, Math.min(100, 
    50 - (totalExpense / totalIncome * 50) + (savings / totalIncome * 100)
  ));
  
  if (healthScore < 40) {
    insights.unshift("💡 Your financial health score is " + healthScore.toFixed(0) + "/100. Focus on reducing expenses.");
  } else if (healthScore > 80) {
    insights.unshift(`🎉 Great job! Financial health score: ${healthScore.toFixed(0)}/100`);
  }

  // Fallback
  if (insights.length === 0) {
    insights.push("Your finances look balanced. Keep tracking your spending!");
  }

  return insights.slice(0, 5); // Limit to 5 insights
}

/**
 * Calculate comprehensive financial analysis
 */
export function calculateFinancialAnalysis(transactions) {

  const incomeTransactions = transactions.filter(t => t.type.toLowerCase() === 'income');
  const expenseTransactions = transactions.filter(t => t.type.toLowerCase() === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);
  const savings = totalIncome - totalExpense;

  // Category totals (expenses only)
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    const cat = (t.category || 'Uncategorized').toLowerCase().trim();
    acc[cat] = (acc[cat] || 0) + (parseFloat(t.amount) || 0);
    return acc;
  }, {});

  // Highest spending category
  const highestSpendingCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0] || null;

  // Monthly spending (YYYY-MM format)
  const monthlySpending = {};
  expenseTransactions.forEach(t => {
    const date = new Date(t.date);
    if (!isNaN(date)) {
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + (parseFloat(t.amount) || 0);
    }
  });

  const monthsWithData = Object.keys(monthlySpending).length;
  const monthlySpendingAverage = monthsWithData > 0 
    ? totalExpense / monthsWithData 
    : 0;

  // Percentage for top category
  const topCategoryPercent = highestSpendingCategory 
    ? ((highestSpendingCategory[1] / totalExpense) * 100).toFixed(1)
    : 0;

  return {
    totalIncome,
    totalExpense,
    savings,
    categoryTotals,
    highestSpendingCategory: highestSpendingCategory ? {
      name: highestSpendingCategory[0],
      amount: highestSpendingCategory[1]
    } : null,
    monthlySpending,
    monthlySpendingAverage,
    topCategoryPercent,
    totalTransactions: transactions.length,
    incomeTransactions: incomeTransactions.length,
    expenseTransactions: expenseTransactions.length
  };
}

/**
 * Get formatted category data for charts
 */
export function getCategoryChartData(analysis) {
  return Object.entries(analysis.categoryTotals)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8); // Top 8 categories
}

/**
 * Get monthly chart data
 */
export function getMonthlyChartData(analysis) {
  return Object.entries(analysis.monthlySpending)
    .map(([month, amount]) => ({ month, expenses: Number(amount) }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Generate AI insights based on analysis
 */
export function generateInsights(analysis) {
  const insights = [];

  // Spending ratio
  const spendingRatio = analysis.totalExpense / analysis.totalIncome;
  if (spendingRatio > 0.8) {
    insights.push(`⚠️ High spending ratio (${(spendingRatio*100).toFixed(0)}%). Consider budget adjustments.`);
  } else if (spendingRatio < 0.5) {
    insights.push(`✅ Excellent! You're spending only ${(spendingRatio*100).toFixed(0)}% of income.`);
  }

  // Top category warning
  if (analysis.highestSpendingCategory && analysis.topCategoryPercent > 30) {
    insights.push(`📈 ${analysis.highestSpendingCategory.name} takes ${(analysis.topCategoryPercent)}% of expenses. Review this category.`);
  }

  // Monthly consistency
  const monthlyVariance = analysis.monthlySpendingAverage > 0 
    ? (analysis.totalExpense / analysis.monthlySpendingAverage - 1) * 100 
    : 0;
  if (Math.abs(monthlyVariance) > 25) {
    insights.push(`📊 Monthly spending variance: ±${monthlyVariance.toFixed(0)}%. Consider stabilizing patterns.`);
  }

  // Savings rate
  const savingsRate = analysis.totalIncome > 0 ? (analysis.savings / analysis.totalIncome) * 100 : 0;
  if (savingsRate > 20) {
    insights.push(`🏦 Strong savings rate: ${savingsRate.toFixed(1)}%! Keep it up.`);
  }

  return insights.length ? insights : ['Upload transactions to get personalized insights!'];
}

// Individual utility functions (for finer control)
export const calculateIncome = (transactions) => 
  transactions.filter(t => t.type.toLowerCase() === 'income')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

export const calculateExpenses = (transactions) => 
  transactions.filter(t => t.type.toLowerCase() === 'expense')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

export const getSavings = (income, expenses) => income - expenses;

export const groupByCategory = (transactions) =>
  transactions.reduce((acc, t) => {
    const cat = (t.category || 'Uncategorized').toLowerCase().trim();
    acc[cat] = (acc[cat] || 0) + (parseFloat(t.amount) || 0);
    return acc;
  }, {});

