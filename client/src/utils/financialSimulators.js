// Advanced financial calculations for simulators

/**
 * Micro to Macro Calculator
 * Shows yearly impact of small daily/weekly expenses
 */
export const calculateMicroToMacro = (amount, frequency, years = 1) => {
  let yearlyAmount = 0;
  
  switch (frequency) {
    case 'daily':
      yearlyAmount = amount * 365 * years;
      break;
    case 'weekly':
      yearlyAmount = amount * 52 * years;
      break;
    case 'monthly':
      yearlyAmount = amount * 12 * years;
      break;
    default:
      yearlyAmount = amount * years;
  }

  // Investment opportunity cost (assuming 12% annual return)
  const investmentValue = calculateInvestmentGrowth(amount, frequency, years, 12);

  return {
    immediateCost: amount,
    yearlyCost: Math.round(yearlyAmount),
    fiveYearCost: Math.round(yearlyAmount * 5),
    tenYearCost: Math.round(yearlyAmount * 10),
    investmentValue10Years: Math.round(investmentValue),
    breakEven: {
      monthly: Math.round(yearlyAmount / 12),
      daily: Math.round(yearlyAmount / 365),
    },
  };
};

/**
 * Delay Cost Calculator (SIP vs Immediate Purchase)
 * Shows wealth difference between investing vs spending
 */
export const calculateDelayCost = (amount, investmentPeriod, annualReturn = 12) => {
  // If invested as SIP
  const sipValue = calculateInvestmentGrowth(amount, 'monthly', investmentPeriod, annualReturn);
  
  // Total amount spent
  const totalSpent = amount * investmentPeriod * 12;

  return {
    monthlyAmount: amount,
    totalSpent: Math.round(totalSpent),
    investmentValue: Math.round(sipValue),
    wealthGap: Math.round(sipValue - totalSpent),
    wealthMultiplier: (sipValue / totalSpent).toFixed(2),
    opportunityCost: Math.round(sipValue),
  };
};

/**
 * Shock Mode Calculator
 * Simulates emergency financial scenarios
 */
export const calculateShockMode = (financialData, shockType) => {
  const { income, expenses, savings, emergencyFund } = financialData;
  const monthlySavings = income - expenses;
  const monthsOfRunway = emergencyFund / expenses;

  let shockImpact = {};

  switch (shockType) {
    case 'job-loss':
      shockImpact = {
        scenario: 'Job Loss',
        monthlyDeficit: expenses,
        monthsSurvival: Math.floor(emergencyFund / expenses),
        totalLoss: income * 3, // Assume 3 months to find new job
        recommendation: emergencyFund >= expenses * 6
          ? 'Your emergency fund can cover 6+ months'
          : 'Build emergency fund to at least 6 months of expenses',
      };
      break;

    case 'medical-emergency':
      const medicalCost = expenses * 2; // Assume 2 months of expenses
      shockImpact = {
        scenario: 'Medical Emergency',
        immediateCost: Math.round(medicalCost),
        remainingFund: Math.round(emergencyFund - medicalCost),
        recoveryTime: Math.ceil((medicalCost - emergencyFund) / monthlySavings),
        recommendation: 'Consider health insurance to protect savings',
      };
      break;

    case 'market-crash':
      shockImpact = {
        scenario: 'Market Crash (30% drop)',
        portfolioLoss: Math.round(savings * 0.3),
        remainingValue: Math.round(savings * 0.7),
        recoveryTimeMonths: 18, // Historical average
        recommendation: 'Diversify investments and maintain long-term perspective',
      };
      break;

    case 'income-reduction':
      shockImpact = {
        scenario: '30% Income Reduction',
        newIncome: Math.round(income * 0.7),
        monthlyDeficit: Math.round(expenses - income * 0.7),
        monthsSurvival: Math.floor(emergencyFund / (expenses - income * 0.7)),
        recommendation: 'Reduce discretionary spending immediately',
      };
      break;

    default:
      shockImpact = { scenario: 'Unknown', message: 'Invalid shock type' };
  }

  return {
    ...shockImpact,
    currentRunway: Math.round(monthsOfRunway * 10) / 10,
    financialResilience: monthsOfRunway >= 6 ? 'Strong' : monthsOfRunway >= 3 ? 'Moderate' : 'Weak',
  };
};

/**
 * Scenario Builder - What-if financial simulations
 */
export const calculateScenario = (currentData, adjustments) => {
  const { income, expenses, savings, investmentReturns } = currentData;
  const { 
    incomeChange = 0, 
    expenseChange = 0, 
    savingsChange = 0,
    years = 10 
  } = adjustments;

  const newIncome = income * (1 + incomeChange / 100);
  const newExpenses = expenses * (1 + expenseChange / 100);
  const newSavings = savings * (1 + savingsChange / 100);
  const newMonthlySavings = newIncome - newExpenses;

  // Project over years
  const projections = [];
  let totalWealth = newSavings;

  for (let year = 1; year <= years; year++) {
    const yearlySavings = newMonthlySavings * 12;
    const investmentGain = totalWealth * (investmentReturns / 100);
    totalWealth += yearlySavings + investmentGain;
    
    projections.push({
      year,
      totalWealth: Math.round(totalWealth),
      yearlySavings: Math.round(yearlySavings),
      investmentGain: Math.round(investmentGain),
    });
  }

  // Compare with current trajectory
  const currentProjections = calculateCurrentTrajectory(income, expenses, savings, investmentReturns, years);

  return {
    scenario: {
      incomeChange: `${incomeChange > 0 ? '+' : ''}${incomeChange}%`,
      expenseChange: `${expenseChange > 0 ? '+' : ''}${expenseChange}%`,
      savingsChange: `${savingsChange > 0 ? '+' : ''}${savingsChange}%`,
    },
    newMonthlySavings: Math.round(newMonthlySavings),
    projections,
    comparison: {
      currentWealth: currentProjections[currentProjections.length - 1]?.totalWealth || 0,
      projectedWealth: Math.round(totalWealth),
      wealthDifference: Math.round(totalWealth - (currentProjections[currentProjections.length - 1]?.totalWealth || 0)),
      improvement: `${((totalWealth / (currentProjections[currentProjections.length - 1]?.totalWealth || 1) - 1) * 100).toFixed(1)}%`,
    },
  };
};

/**
 * Financial Health Score Calculator
 */
export const calculateFinancialHealth = (financialData) => {
  const { income, expenses, savings, debt, emergencyFund, investments } = financialData;
  
  let score = 50;
  let insights = [];

  // Savings Rate (0-25 points)
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  if (savingsRate >= 30) {
    score += 25;
    insights.push('Excellent savings rate!');
  } else if (savingsRate >= 20) {
    score += 20;
    insights.push('Good savings rate');
  } else if (savingsRate >= 10) {
    score += 10;
    insights.push('Try to increase savings to 20%+');
  } else {
    score -= 10;
    insights.push('Critical: Savings rate too low');
  }

  // Emergency Fund (0-25 points)
  const monthsOfExpenses = expenses > 0 ? emergencyFund / expenses : 0;
  if (monthsOfExpenses >= 6) {
    score += 25;
    insights.push('Strong emergency fund');
  } else if (monthsOfExpenses >= 3) {
    score += 15;
    insights.push('Build emergency fund to 6 months');
  } else {
    score -= 5;
    insights.push('Emergency fund critically low');
  }

  // Debt-to-Income Ratio (0-25 points)
  const debtRatio = income > 0 ? (debt / income) * 100 : 0;
  if (debtRatio === 0) {
    score += 25;
    insights.push('Debt-free!');
  } else if (debtRatio < 30) {
    score += 15;
    insights.push('Manageable debt levels');
  } else {
    score -= 10;
    insights.push('High debt - prioritize payoff');
  }

  // Investment Ratio (0-25 points)
  const investmentRatio = income > 0 ? (investments / income) * 100 : 0;
  if (investmentRatio >= 20) {
    score += 25;
    insights.push('Strong investment portfolio');
  } else if (investmentRatio >= 10) {
    score += 15;
    insights.push('Consider increasing investments');
  } else {
    score += 5;
    insights.push('Start investing for long-term growth');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    grade: score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D',
    savingsRate: Math.round(savingsRate * 10) / 10,
    monthsOfRunway: Math.round(monthsOfExpenses * 10) / 10,
    insights,
  };
};

// Helper: Calculate investment growth with regular contributions
function calculateInvestmentGrowth(amount, frequency, years, annualReturn) {
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  
  let monthlyContribution = 0;
  switch (frequency) {
    case 'daily':
      monthlyContribution = amount * 30;
      break;
    case 'weekly':
      monthlyContribution = amount * 4;
      break;
    case 'monthly':
      monthlyContribution = amount;
      break;
  }

  // Future Value of Series formula
  const futureValue = monthlyContribution * 
    ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

  return futureValue;
}

// Helper: Calculate current trajectory
function calculateCurrentTrajectory(income, expenses, savings, annualReturn, years) {
  const monthlySavings = income - expenses;
  const projections = [];
  let totalWealth = savings;

  for (let year = 1; year <= years; year++) {
    const yearlySavings = monthlySavings * 12;
    const investmentGain = totalWealth * (annualReturn / 100);
    totalWealth += yearlySavings + investmentGain;
    
    projections.push({
      year,
      totalWealth: Math.round(totalWealth),
    });
  }

  return projections;
}
