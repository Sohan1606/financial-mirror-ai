const { getDb } = require('../utils/db');
const { ObjectId } = require('mongodb');



// GET /api/finance/profile
exports.getFinancialProfile = async (req, res) => {
  try {
    const db = getDb();
    const profile = await db.collection('financialProfiles').findOne({
      userId: req.user.userId,
    });

    if (!profile) {
      return res.json({
        profile: {
          income: 0,
          expenses: 0,
          savings: 0,
          savingsRate: 0,
          financialHealthScore: 0,
        },
      });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get financial profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/finance/profile
exports.saveFinancialProfile = async (req, res) => {
  try {
    const { income, expenses, savings, financialGoals } = req.body;
    const db = getDb();

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    // Calculate financial health score (0-100)
    const financialHealthScore = calculateHealthScore({
      income,
      expenses,
      savings,
      savingsRate,
    });

    const result = await db.collection('financialProfiles').updateOne(
      { userId: req.user.userId },
      {
        $set: {
          userId: req.user.userId,
          income: income || 0,
          expenses: expenses || 0,
          savings: savings || 0,
          savingsRate: Math.round(savingsRate * 100) / 100,
          financialHealthScore: Math.round(financialHealthScore),
          financialGoals: financialGoals || [],
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({
      message: 'Financial profile saved',
      profile: {
        income,
        expenses,
        savings,
        savingsRate: Math.round(savingsRate * 100) / 100,
        financialHealthScore: Math.round(financialHealthScore),
      },
    });
  } catch (error) {
    console.error('Save financial profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/finance/simulations
exports.saveSimulation = async (req, res) => {
  try {
    const { type, inputData, resultData } = req.body;
    const db = getDb();

    const result = await db.collection('simulations').insertOne({
      userId: req.user.userId,
      type, // 'micro-macro', 'delay-cost', 'shock-mode', 'scenario'
      inputData,
      resultData,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: 'Simulation saved',
      simulationId: result.insertedId,
    });
  } catch (error) {
    console.error('Save simulation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /api/finance/simulations
exports.getSimulations = async (req, res) => {
  try {
    const db = getDb();
    const { type } = req.query;

    const query = { userId: req.user.userId };
    if (type) {
      query.type = type;
    }

    const simulations = await db.collection('simulations')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    res.json({ simulations });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper: Calculate financial health score
function calculateHealthScore({ income, expenses, savingsRate }) {
  let score = 50;

  if (savingsRate >= 30) score += 30;
  else if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 10) score += 15;
  else if (savingsRate > 0) score += 5;
  else score -= 10;

  const expenseRatio = income > 0 ? expenses / income : 1;
  if (expenseRatio < 0.6) score += 20;
  else if (expenseRatio < 0.8) score += 10;
  else if (expenseRatio > 1) score -= 20;

  return Math.max(0, Math.min(100, score));
}

module.exports = exports;
