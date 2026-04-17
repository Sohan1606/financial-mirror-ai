const express = require('express');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authenticate = require('../middleware/auth');

const router = express.Router();

// GET /api/leaks/analyze
router.get('/analyze', authenticate, async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    // Fetch last 90 days of transactions
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const transactions = await transactionsCollection
      .find({
        userId: req.user.userId,
        date: { $gte: ninetyDaysAgo },
      })
      .sort({ date: -1 })
      .toArray();
    
    if (transactions.length === 0) {
      return res.json({
        leaks: [],
        totalLeakAmount: 0,
        recoveryPotential: 0,
        summary: "No transactions found to analyze."
      });
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const leaks = [];
    
    // 1. Recurring subscriptions detection (same amount + category within ~30 days)
    const categoryAmountGroups = {};
    expenses.forEach(t => {
      const key = `${t.category}_${t.amount}`;
      if (!categoryAmountGroups[key]) categoryAmountGroups[key] = [];
      categoryAmountGroups[key].push(t);
    });
    
    for (const key in categoryAmountGroups) {
      const group = categoryAmountGroups[key];
      if (group.length >= 2) {
        // Check if dates are roughly 30 days apart (25-35 days) or weekly (6-8 days)
        const sorted = group.sort((a, b) => b.date - a.date);
        let isSubscription = false;
        for (let i = 0; i < sorted.length - 1; i++) {
          const diffDays = Math.abs(sorted[i].date - sorted[i+1].date) / (1000 * 60 * 60 * 24);
          if ((diffDays >= 25 && diffDays <= 35) || (diffDays >= 6 && diffDays <= 8)) {
            isSubscription = true;
            break;
          }
        }
        
        if (isSubscription) {
          const monthlyEstimate = group[0].amount; // Simplification
          leaks.push({
            type: 'Subscription Drain',
            category: group[0].category,
            amount: monthlyEstimate,
            description: `Detected potential recurring ${group[0].category} payment of ${monthlyEstimate}/month.`,
            icon: 'subscription'
          });
        }
      }
    }

    // 2. High-frequency small expenses (>5 transactions in same category in 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const lastMonthExpenses = expenses.filter(t => t.date >= thirtyDaysAgo);
    
    const freqByCategory = {};
    lastMonthExpenses.forEach(t => {
      if (!freqByCategory[t.category]) freqByCategory[t.category] = { count: 0, total: 0 };
      freqByCategory[t.category].count++;
      freqByCategory[t.category].total += t.amount;
    });
    
    for (const category in freqByCategory) {
      if (freqByCategory[category].count >= 5) {
        leaks.push({
          type: 'Micro Spending Spike',
          category,
          amount: freqByCategory[category].total,
          description: `${freqByCategory[category].count} small purchases in ${category} totaling ${freqByCategory[category].total} this month.`,
          icon: 'micro'
        });
      }
    }

    // 3. Spike detection (spend > 150% of 3-month average)
    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = lastMonthExpenses;
    const currentMonthTotalByCategory = {};
    currentMonthExpenses.forEach(t => {
      currentMonthTotalByCategory[t.category] = (currentMonthTotalByCategory[t.category] || 0) + t.amount;
    });
    
    const prevMonthsExpenses = expenses.filter(t => t.date < thirtyDaysAgo);
    const prevMonthsTotalByCategory = {};
    prevMonthsExpenses.forEach(t => {
      prevMonthsTotalByCategory[t.category] = (prevMonthsTotalByCategory[t.category] || 0) + t.amount;
    });
    
    for (const category in currentMonthTotalByCategory) {
      const current = currentMonthTotalByCategory[category];
      const prevAvg = (prevMonthsTotalByCategory[category] || 0) / 2; // Last 2 months avg
      if (prevAvg > 0 && current > prevAvg * 1.5) {
        leaks.push({
          type: 'Category Spike Alert',
          category,
          amount: current - prevAvg,
          description: `${category} spend is 150%+ above your average. ${(current - prevAvg).toFixed(0)} more than usual.`,
          icon: 'spike'
        });
      }
    }

    // 4. Low-value transactions (>10 transactions under 100 in misc/food/entertainment)
    const lowValueCats = ['food', 'entertainment', 'misc', 'shopping', 'dining', 'groceries'];
    const lowValueTxs = lastMonthExpenses.filter(t => t.amount < 100 && lowValueCats.includes(t.category.toLowerCase()));
    if (lowValueTxs.length >= 10) {
      const lowValueTotal = lowValueTxs.reduce((sum, t) => sum + t.amount, 0);
      leaks.push({
        type: 'Death by a Thousand Cuts',
        category: 'Misc',
        amount: lowValueTotal,
        description: `${lowValueTxs.length} small purchases under 100 each. These add up to ${lowValueTotal} quickly.`,
        icon: 'low-value'
      });
    }

    const totalLeakAmount = leaks.reduce((sum, l) => sum + l.amount, 0);
    const recoveryPotential = totalLeakAmount * 0.7; // 70% recovery potential

    res.json({
      leaks,
      totalLeakAmount,
      recoveryPotential,
      summary: `We detected ${totalLeakAmount.toFixed(0)} in potential revenue leaks. You could recover ${recoveryPotential.toFixed(0)} monthly.`
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/leaks/analyze
router.post('/analyze', authenticate, async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    // Fetch last 90 days of transactions
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const transactions = await transactionsCollection
      .find({
        userId: req.user.userId,
        date: { $gte: ninetyDaysAgo },
      })
      .sort({ date: -1 })
      .toArray();
    
    if (transactions.length === 0) {
      return res.json({
        leaks: [],
        totalLeakAmount: 0,
        recoveryPotential: 0,
        summary: "No transactions found to analyze."
      });
    }

    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    const leaks = [];
    
    // 1. Recurring subscriptions detection (same amount + category within ~30 days)
    const categoryAmountGroups = {};
    expenses.forEach(t => {
      const key = `${t.category}_${t.amount}`;
      if (!categoryAmountGroups[key]) categoryAmountGroups[key] = [];
      categoryAmountGroups[key].push(t);
    });
    
    for (const key in categoryAmountGroups) {
      const group = categoryAmountGroups[key];
      if (group.length >= 2) {
        // Check if dates are roughly 30 days apart (25-35 days) or weekly (6-8 days)
        const sorted = group.sort((a, b) => b.date - a.date);
        let isSubscription = false;
        for (let i = 0; i < sorted.length - 1; i++) {
          const diffDays = Math.abs(sorted[i].date - sorted[i+1].date) / (1000 * 60 * 60 * 24);
          if ((diffDays >= 25 && diffDays <= 35) || (diffDays >= 6 && diffDays <= 8)) {
            isSubscription = true;
            break;
          }
        }
        
        if (isSubscription) {
          const monthlyEstimate = group[0].amount; // Simplification
          leaks.push({
            type: 'Subscription Drain',
            category: group[0].category,
            amount: monthlyEstimate,
            description: `Detected potential recurring ${group[0].category} payment of ₹${monthlyEstimate}/month.`,
            icon: 'subscription'
          });
        }
      }
    }

    // 2. High-frequency small expenses (>5 transactions in same category in 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const lastMonthExpenses = expenses.filter(t => t.date >= thirtyDaysAgo);
    
    const freqByCategory = {};
    lastMonthExpenses.forEach(t => {
      if (!freqByCategory[t.category]) freqByCategory[t.category] = { count: 0, total: 0 };
      freqByCategory[t.category].count++;
      freqByCategory[t.category].total += t.amount;
    });
    
    for (const category in freqByCategory) {
      if (freqByCategory[category].count >= 5) {
        leaks.push({
          type: 'Micro Spending Spike',
          category,
          amount: freqByCategory[category].total,
          description: `${freqByCategory[category].count} small purchases in ${category} totaling ₹${freqByCategory[category].total} this month.`,
          icon: 'micro'
        });
      }
    }

    // 3. Spike detection (spend > 150% of 3-month average)
    const currentMonth = new Date().getMonth();
    const currentMonthExpenses = lastMonthExpenses;
    const currentMonthTotalByCategory = {};
    currentMonthExpenses.forEach(t => {
      currentMonthTotalByCategory[t.category] = (currentMonthTotalByCategory[t.category] || 0) + t.amount;
    });
    
    const prevMonthsExpenses = expenses.filter(t => t.date < thirtyDaysAgo);
    const prevMonthsTotalByCategory = {};
    prevMonthsExpenses.forEach(t => {
      prevMonthsTotalByCategory[t.category] = (prevMonthsTotalByCategory[t.category] || 0) + t.amount;
    });
    
    for (const category in currentMonthTotalByCategory) {
      const current = currentMonthTotalByCategory[category];
      const prevAvg = (prevMonthsTotalByCategory[category] || 0) / 2; // Last 2 months avg
      if (prevAvg > 0 && current > prevAvg * 1.5) {
        leaks.push({
          type: 'Category Spike Alert',
          category,
          amount: current - prevAvg,
          description: `${category} spend is 150%+ above your average. ₹${(current - prevAvg).toFixed(0)} more than usual.`,
          icon: 'spike'
        });
      }
    }

    // 4. Low-value transactions (>10 transactions under ₹100 in misc/food/entertainment)
    const lowValueCats = ['food', 'entertainment', 'misc', 'shopping', 'dining', 'groceries'];
    const lowValueTxs = lastMonthExpenses.filter(t => t.amount < 100 && lowValueCats.includes(t.category.toLowerCase()));
    if (lowValueTxs.length >= 10) {
      const lowValueTotal = lowValueTxs.reduce((sum, t) => sum + t.amount, 0);
      leaks.push({
        type: 'Death by a Thousand Cuts',
        category: 'Misc',
        amount: lowValueTotal,
        description: `${lowValueTxs.length} small purchases under ₹100 each. These add up to ₹${lowValueTotal} quickly.`,
        icon: 'low-value'
      });
    }

    const totalLeakAmount = leaks.reduce((sum, l) => sum + l.amount, 0);
    const recoveryPotential = totalLeakAmount * 0.7; // 70% recovery potential

    res.json({
      leaks,
      totalLeakAmount,
      recoveryPotential,
      summary: `We detected ₹${totalLeakAmount.toFixed(0)} in potential revenue leaks. You could recover ₹${recoveryPotential.toFixed(0)} monthly.`
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
