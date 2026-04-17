const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/goals
router.get('/', async (req, res, next) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection(COLLECTIONS.GOALS);
    
    const goals = await goalsCollection
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(goals.map(g => {
      const { _id, ...rest } = g;
      return { ...rest, id: _id.toString() };
    }));
  } catch (error) {
    next(error);
  }
});

// POST /api/goals
router.post('/', async (req, res, next) => {
  try {
    const { name, targetAmount, deadline, emoji, color } = req.body;
    
    if (!name || !targetAmount) {
      return res.status(400).json({ error: 'Name and targetAmount are required' });
    }
    
    const db = getDb();
    const goalsCollection = db.collection(COLLECTIONS.GOALS);
    
    const newGoal = {
      userId: req.user.userId,
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: 0,
      deadline: deadline ? new Date(deadline) : null,
      emoji: emoji || '🎯',
      color: color || '#10B981',
      isCompleted: false,
      createdAt: new Date(),
    };
    
    const result = await goalsCollection.insertOne(newGoal);
    
    res.status(201).json({
      ...newGoal,
      id: result.insertedId.toString(),
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/goals/:id
router.put('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection(COLLECTIONS.GOALS);
    
    const goal = await goalsCollection.findOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    const updateData = {};
    const allowedFields = ['name', 'targetAmount', 'savedAmount', 'deadline', 'emoji', 'color', 'isCompleted'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    if (updateData.targetAmount) updateData.targetAmount = parseFloat(updateData.targetAmount);
    if (updateData.savedAmount) updateData.savedAmount = parseFloat(updateData.savedAmount);
    if (updateData.deadline) updateData.deadline = new Date(updateData.deadline);
    
    // Auto-complete if saved amount meets or exceeds target
    if (updateData.savedAmount !== undefined && updateData.savedAmount >= goal.targetAmount) {
      updateData.isCompleted = true;
    }
    
    await goalsCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updatedGoal = await goalsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    
    const { _id: origId, ...rest } = updatedGoal;
    res.json({
      ...rest,
      id: origId.toString(),
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/goals/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const db = getDb();
    const goalsCollection = db.collection(COLLECTIONS.GOALS);
    
    const result = await goalsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
      userId: req.user.userId,
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
