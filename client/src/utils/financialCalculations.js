export function calculateHealthScore(analysis) {
  // If analysis is provided as an object (from calculateFinancialAnalysis)
  if (typeof analysis === 'object' && analysis.income !== undefined) {
    const { income, expenses } = analysis;
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    return calculateHealthScoreFromValues(income, expenses, savingsRate);
  }
  
  // If called with individual values (legacy)
  return calculateHealthScoreFromValues(...arguments);
}

function calculateHealthScoreFromValues(income, expenses, savingsRate) {
  let score = 50;
  
  if (savingsRate >= 20) score += 30;
  else if (savingsRate >= 10) score += 20;
  else if (savingsRate > 0) score += 10;
  else score -= 20;
  
  const expenseRatio = income > 0 ? expenses / income : 1;
  if (expenseRatio < 0.7) score += 20;
  else if (expenseRatio < 0.9) score += 10;
  else score -= 10;
  
  return Math.min(100, Math.max(0, score));
}

export function calculateSavingsRate(income, expenses) {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
}

export function getBudgetStatus(spent, limit) {
  const percentage = (spent / limit) * 100;
  
  if (percentage >= 100) return { status: 'exceeded', color: 'red' };
  if (percentage >= 80) return { status: 'warning', color: 'yellow' };
  return { status: 'good', color: 'green' };
}

export function calculateFinancialAnalysis(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netSavings: 0,
      income: 0,
      expenses: 0,
      totalTransactions: 0,
      categories: {},
      monthlyData: {}
    };
  }

  let totalIncome = 0;
  let totalExpense = 0;
  const categories = {};
  const monthlyData = {};

  transactions.forEach(t => {
    const amount = parseFloat(t.amount);
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, total: 0 };
    }

    if (t.type === 'income') {
      totalIncome += amount;
      monthlyData[monthKey].income += amount;
    } else {
      totalExpense += amount;
      monthlyData[monthKey].expense += amount;
      
      const cat = t.category || 'Uncategorized';
      categories[cat] = (categories[cat] || 0) + amount;
    }
    monthlyData[monthKey].total += amount;
  });

  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1]);
  const highestSpendingCategory = sortedCategories.length > 0 
    ? { name: sortedCategories[0][0], amount: sortedCategories[0][1] }
    : null;

  const months = Object.keys(monthlyData).length;
  const monthlySpendingAverage = months > 0 ? totalExpense / months : 0;

  return {
    totalIncome,
    totalExpense,
    netSavings: totalIncome - totalExpense,
    savings: totalIncome - totalExpense, // compatibility
    income: totalIncome, // compatibility
    expenses: totalExpense, // compatibility
    totalTransactions: transactions.length,
    categories,
    monthlyData,
    highestSpendingCategory,
    monthlySpendingAverage
  };
}

export function getCategoryChartData(analysis) {
  if (!analysis || !analysis.categories) return [];
  return Object.entries(analysis.categories).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);
}

export function getMonthlyChartData(analysis) {
  if (!analysis || !analysis.monthlyData) return [];
  return Object.entries(analysis.monthlyData).map(([name, data]) => ({
    name,
    ...data
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export function getMonthlyIncomeExpenseData(transactions) {
  const analysis = calculateFinancialAnalysis(transactions);
  return getMonthlyChartData(analysis);
}

export function generateInsights(analysis) {
  const insights = [];
  const { totalIncome, totalExpense, categories } = analysis;
  const savingsRate = calculateSavingsRate(totalIncome, totalExpense);

  if (savingsRate < 10) {
    insights.push({
      type: 'warning',
      text: 'Your savings rate is below 10%. Try to reduce discretionary spending.'
    });
  } else if (savingsRate > 30) {
    insights.push({
      type: 'success',
      text: 'Great job! You are saving more than 30% of your income.'
    });
  }

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    insights.push({
      type: 'info',
      text: `Your biggest expense category is ${topCategory[0]}.`
    });
  }

  return insights;
}

export function getHealthScoreColor(score) {
  if (score >= 80) return 'bg-emerald-500 text-white';
  if (score >= 60) return 'bg-blue-500 text-white';
  if (score >= 40) return 'bg-amber-500 text-white';
  return 'bg-red-500 text-white';
}
