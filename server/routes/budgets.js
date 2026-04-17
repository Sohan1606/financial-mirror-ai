const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/budgets
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const budgetsCollection = db.collection(COLLECTIONS.BUDGETS);
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const budgets = await budgetsCollection
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Calculate current period spending for each budget
    const now = new Date();
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        let startDate;
        
        if (budget.period === 'weekly') {
          // Start of current week (Monday)
          const dayOfWeek = now.getDay();
          const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
          startDate = new Date(now.setDate(diff));
          startDate.setHours(0, 0, 0, 0);
        } else {
          // Start of current month
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        
        const spending = await transactionsCollection.aggregate([
          {
            $match: {
              userId: req.user.userId,
              category: budget.category,
              type: 'expense',
              date: { $gte: startDate },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' },
            },
          },
        ]).toArray();
        
        const { _id, ...rest } = budget;
        return {
          ...rest,
          id: _id.toString(),
          spent: spending.length > 0 ? spending[0].total : 0,
          remaining: budget.limit - (spending.length > 0 ? spending[0].total : 0),
          percentage: budget.limit > 0 ? ((spending.length > 0 ? spending[0].total : 0) / budget.limit) * 100 : 0,
        };
      })
    );
    
    res.json(budgetsWithSpending);
  } catch (error) {
    next(error);
  }
});

// POST /api/budgets
router.post('/', async (req, res, next) => {
  try {
    console.log('Budget POST request received');
    console.log('User ID:', req.user?.userId);
    console.log('Request body:', req.body);
    
    const { category, limit, period, color } = req.body;
    
    if (!category || !limit) {
      return res.status(400).json({ error: 'Category and limit are required' });
    }
    
    // Simple test response first
    return res.status(201).json({
      message: 'Budget created successfully (test)',
      budget: {
        userId: req.user.userId,
        category,
        limit: parseFloat(limit),
        period: period || 'monthly',
        color: color || '#3B82F6',
        createdAt: new Date(),
      }
    });
    
    const db = getDb();
    const budgetsCollection = db.collection(COLLECTIONS.BUDGETS);
    
    const newBudget = {
      userId: req.user.userId,
      category,
      limit: parseFloat(limit),
      period: period || 'monthly',
      color: color || '#3B82F6',
      createdAt: new Date(),
    };
    
    const result = await budgetsCollection.insertOne(newBudget);
    
    res.status(201).json({
      ...newBudget,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    console.error('Budget creation error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// PUT /api/budgets/:id
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const budgetsCollection = db.collection(COLLECTIONS.BUDGETS);
    
    const budget = await budgetsCollection.findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    const updateData = {};
    const allowedFields = ['category', 'limit', 'period', 'color'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    if (updateData.limit) updateData.limit = parseFloat(updateData.limit);
    
    await budgetsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updatedBudget = await budgetsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    
    const { _id: origId, ...rest } = updatedBudget;
    res.json({
      ...rest,
      id: origId.toString(),
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const budgetsCollection = db.collection(COLLECTIONS.BUDGETS);
    
    const result = await budgetsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
