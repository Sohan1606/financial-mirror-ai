const express = require('express');
const multer = require('multer');
const Papa = require('papaparse');
const { getDb } = require('../utils/db');
const { COLLECTIONS } = require('../models/schemas');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// POST /api/upload/csv
router.post('/csv', authMiddleware, upload.single('csv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }
    
    const csvContent = req.file.buffer.toString('utf-8');
    
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });
    
    if (parseResult.errors.length > 0) {
      return res.status(400).json({
        error: 'CSV parsing error',
        details: parseResult.errors.slice(0, 5),
      });
    }
    
    const validRows = [];
    const errors = [];
    
    parseResult.data.forEach((row, index) => {
      if (!row.date || !row.amount || !row.type || !row.category) {
        errors.push({
          row: index + 1,
          error: 'Missing required fields: date, amount, type, category',
        });
        return;
      }
      
      const amount = parseFloat(row.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.push({
          row: index + 1,
          error: `Invalid amount: ${row.amount}`,
        });
        return;
      }
      
      if (!['income', 'expense'].includes(row.type.toLowerCase())) {
        errors.push({
          row: index + 1,
          error: `Invalid type: ${row.type}. Must be "income" or "expense"`,
        });
        return;
      }
      
      const date = new Date(row.date);
      if (isNaN(date.getTime())) {
        errors.push({
          row: index + 1,
          error: `Invalid date: ${row.date}`,
        });
        return;
      }
      
      validRows.push({
        userId: req.user.userId,
        date: date,
        amount: amount,
        type: row.type.toLowerCase(),
        category: row.category.trim(),
        subcategory: row.subcategory ? row.subcategory.trim() : null,
        description: row.description ? row.description.trim() : null,
        tags: [],
        isRecurring: false,
        source: 'csv',
        createdAt: new Date(),
      });
    });
    
    if (validRows.length === 0) {
      return res.status(400).json({
        error: 'No valid rows found in CSV',
        errors: errors.slice(0, 10),
      });
    }
    
    const db = getDb();
    const transactionsCollection = db.collection(COLLECTIONS.TRANSACTIONS);
    
    const result = await transactionsCollection.insertMany(validRows);
    
    // Calculate basic analysis
    const income = validRows
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    
    const expenses = validRows
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    
    res.json({
      message: 'CSV uploaded successfully',
      count: result.insertedCount,
      errors: errors.length > 0 ? errors.slice(0, 10) : [],
      preview: validRows.slice(0, 5).map(r => ({
        date: r.date,
        amount: r.amount,
        type: r.type,
        category: r.category,
        description: r.description,
      })),
      analysis: {
        income,
        expenses,
        savings: income - expenses,
        totalTransactions: validRows.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
