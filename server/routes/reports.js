const express = require('express');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/reports/monthly?year=&month=
router.get('/monthly', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const monthInput = parseInt(req.query.month); // Expected 1-indexed
    const month = !isNaN(monthInput) ? monthInput - 1 : new Date().getMonth(); // 0-indexed for Date
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);
    
    const transactions = await transactionsCollection
      .find({
        userId: req.user.userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray();
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Category breakdown
    const categoryBreakdown = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
      });
    
    // Top 5 categories
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount }));
    
    res.json({
      year,
      month: month + 1, // Convert to 1-indexed
      income,
      expenses,
      savings: income - expenses,
      savingsRate: income > 0 ? (((income - expenses) / income) * 100).toFixed(1) : 0,
      transactionCount: transactions.length,
      categoryBreakdown,
      topCategories,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/yearly?year=
router.get('/yearly', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const year = parseInt(req.query.year) || new Date().getFullYear();
    
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);
    
    const transactions = await transactionsCollection
      .find({
        userId: req.user.userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray();
    
    // Monthly breakdown
    const monthlyBreakdown = [];
    
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
      
      const monthTransactions = transactions.filter(t => 
        t.date >= monthStart && t.date <= monthEnd
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyBreakdown.push({
        month: month + 1,
        income,
        expenses,
        savings: income - expenses,
        transactionCount: monthTransactions.length,
      });
    }
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      year,
      totalIncome,
      totalExpenses,
      totalSavings: totalIncome - totalExpenses,
      totalTransactions: transactions.length,
      monthlyBreakdown,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/comparison
router.get('/comparison', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const now = new Date();
    
    // Current month
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // Last month
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    
    const [currentMonthTx, lastMonthTx] = await Promise.all([
      transactionsCollection
        .find({
          userId: req.user.userId,
          date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        })
        .toArray(),
      transactionsCollection
        .find({
          userId: req.user.userId,
          date: { $gte: lastMonthStart, $lte: lastMonthEnd },
        })
        .toArray(),
    ]);
    
    const currentIncome = currentMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const currentExpenses = currentMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastIncome = lastMonthTx
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastExpenses = lastMonthTx
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Category shifts
    const currentCategoryBreakdown = {};
    currentMonthTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        currentCategoryBreakdown[t.category] = (currentCategoryBreakdown[t.category] || 0) + t.amount;
      });
    
    const lastCategoryBreakdown = {};
    lastMonthTx
      .filter(t => t.type === 'expense')
      .forEach(t => {
        lastCategoryBreakdown[t.category] = (lastCategoryBreakdown[t.category] || 0) + t.amount;
      });
    
    const categoryShifts = Object.keys({
      ...currentCategoryBreakdown,
      ...lastCategoryBreakdown,
    }).map(category => ({
      category,
      current: currentCategoryBreakdown[category] || 0,
      previous: lastCategoryBreakdown[category] || 0,
      difference: (currentCategoryBreakdown[category] || 0) - (lastCategoryBreakdown[category] || 0),
    }));
    
    res.json({
      currentMonth: {
        income: currentIncome,
        expenses: currentExpenses,
        savings: currentIncome - currentExpenses,
        transactionCount: currentMonthTx.length,
      },
      previousMonth: {
        income: lastIncome,
        expenses: lastExpenses,
        savings: lastIncome - lastExpenses,
        transactionCount: lastMonthTx.length,
      },
      differences: {
        income: currentIncome - lastIncome,
        expenses: currentExpenses - lastExpenses,
        savings: (currentIncome - currentExpenses) - (lastIncome - lastExpenses),
      },
      categoryShifts,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
