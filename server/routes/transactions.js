const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/transactions
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const {
      startDate,
      endDate,
      type,
      category,
      search,
      page = 1,
      limit = 50,
    } = req.query;
    
    const query = { userId: req.user.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [transactions, total] = await Promise.all([
      transactionsCollection
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .toArray(),
      transactionsCollection.countDocuments(query),
    ]);
    
    res.json({
      transactions: transactions.map(t => {
        const { _id, ...rest } = t;
        return { ...rest, id: _id.toString() };
      }),
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const { date, amount, type, category, subcategory, description, tags, isRecurring } = req.body;
    
    if (!date || !amount || !type || !category) {
      return res.status(400).json({ error: 'Date, amount, type, and category are required' });
    }
    
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "income" or "expense"' });
    }
    
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const newTransaction = {
      userId: req.user.userId,
      date: new Date(date),
      amount: parseFloat(amount),
      type,
      category,
      subcategory: subcategory || null,
      description: description || null,
      tags: tags || [],
      isRecurring: isRecurring || false,
      source: 'manual',
      createdAt: new Date(),
    };
    
    const result = await transactionsCollection.insertOne(newTransaction);
    
    res.status(201).json({
      ...newTransaction,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const transaction = await transactionsCollection.findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const updateData = {};
    const allowedFields = ['date', 'amount', 'type', 'category', 'subcategory', 'description', 'tags', 'isRecurring'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (updateData.amount) updateData.amount = parseFloat(updateData.amount);
    
    await transactionsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updatedTransaction = await transactionsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    
    const { _id: origId, ...rest } = updatedTransaction;
    res.json({
      ...rest,
      id: origId.toString(),
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const result = await transactionsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/transactions/bulk
router.delete('/bulk', async (req, res, next) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const objectIds = ids.map(id => new ObjectId(id));
    
    const result = await transactionsCollection.deleteMany({
      _id: { $in: objectIds },
      userId: req.user.userId,
    });
    
    res.json({
      message: `${result.deletedCount} transactions deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/transactions/categories
router.get('/categories', async (req, res, next) => {
  try {
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const categories = await transactionsCollection
      .aggregate([
        { $match: { userId: req.user.userId } },
        { $group: { _id: '$category' } },
        { $sort: { _id: 1 } },
        { $project: { category: '$_id', _id: 0 } },
      ])
      .toArray();
    
    res.json(categories.map(c => c.category));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
