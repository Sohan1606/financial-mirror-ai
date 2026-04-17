// Collection names
const COLLECTIONS = {
  USERS: 'users',
  TRANSACTIONS: 'transactions',
  GOALS: 'goals',
  BUDGETS: 'budgets',
  CHAT_MESSAGES: 'chatMessages',
  FINANCIAL_PROFILES: 'financialProfiles',
  SIMULATIONS: 'simulations',
};

// Collection validation schemas
const SCHEMAS = {
  users: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'name', 'passwordHash'],
        properties: {
          email: {
            bsonType: 'string',
            pattern: '^.+@.+\\..+$',
            description: 'Valid email address - required and unique',
          },
          name: {
            bsonType: 'string',
            minLength: 1,
            description: 'User display name - required',
          },
          passwordHash: {
            bsonType: 'string',
            minLength: 1,
            description: 'Bcrypt hashed password - required',
          },
          currency: {
            bsonType: 'string',
            description: 'Currency code (default: INR)',
          },
          createdAt: {
            bsonType: 'date',
            description: 'Account creation timestamp',
          },
        },
      },
    },
  },
  transactions: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'date', 'amount', 'type', 'category'],
        properties: {
          userId: {
            bsonType: 'string',
            description: 'Reference to user - required',
          },
          date: {
            bsonType: 'date',
            description: 'Transaction date - required',
          },
          amount: {
            bsonType: ['double', 'int', 'long', 'decimal'],
            minimum: 0,
            description: 'Transaction amount (positive) - required',
          },
          type: {
            bsonType: 'string',
            enum: ['income', 'expense'],
            description: 'Transaction type - required',
          },
          category: {
            bsonType: 'string',
            description: 'Expense/income category - required',
          },
          subcategory: {
            bsonType: ['string', 'null'],
            description: 'Optional subcategory',
          },
          description: {
            bsonType: ['string', 'null'],
            description: 'Optional description',
          },
          tags: {
            bsonType: 'array',
            description: 'Array of tags',
          },
          isRecurring: {
            bsonType: 'bool',
            description: 'Whether transaction is recurring',
          },
          source: {
            bsonType: 'string',
            enum: ['manual', 'csv'],
            description: 'Data source',
          },
          createdAt: {
            bsonType: 'date',
            description: 'Creation timestamp',
          },
        },
      },
    },
  },
  goals: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'name', 'targetAmount'],
        properties: {
          userId: {
            bsonType: 'string',
            description: 'Reference to user - required',
          },
          name: {
            bsonType: 'string',
            minLength: 1,
            description: 'Goal name - required',
          },
          targetAmount: {
            bsonType: 'double',
            minimum: 0,
            description: 'Target savings amount - required',
          },
          savedAmount: {
            bsonType: 'double',
            minimum: 0,
            description: 'Current saved amount',
          },
          deadline: {
            bsonType: 'date',
            description: 'Optional deadline',
          },
          emoji: {
            bsonType: 'string',
            description: 'Emoji icon for goal',
          },
          color: {
            bsonType: 'string',
            description: 'Color code for goal',
          },
          isCompleted: {
            bsonType: 'bool',
            description: 'Completion status',
          },
          createdAt: {
            bsonType: 'date',
            description: 'Creation timestamp',
          },
        },
      },
    },
  },
  budgets: {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['userId', 'category', 'limit'],
        properties: {
          userId: {
            bsonType: 'string',
            description: 'Reference to user - required',
          },
          category: {
            bsonType: 'string',
            description: 'Budget category - required',
          },
          limit: {
            bsonType: 'double',
            minimum: 0,
            description: 'Budget limit amount - required',
          },
          period: {
            bsonType: 'string',
            enum: ['monthly', 'weekly'],
            description: 'Budget period',
          },
          color: {
            bsonType: 'string',
            description: 'Color code for budget',
          },
          createdAt: {
            bsonType: 'date',
            description: 'Creation timestamp',
          },
        },
      },
    },
  },
};

// Index definitions for performance
const INDEXES = {
  transactions: [
    { key: { userId: 1, date: -1 }, name: 'idx_user_date' },
    { key: { userId: 1, category: 1 }, name: 'idx_user_category' },
    { key: { userId: 1, type: 1 }, name: 'idx_user_type' },
  ],
  goals: [
    { key: { userId: 1 }, name: 'idx_user_goals' },
  ],
  budgets: [
    { 
      key: { userId: 1, category: 1, period: 1 }, 
      name: 'idx_user_category_period',
      unique: true 
    },
  ],
  chatMessages: [
    { key: { userId: 1, createdAt: -1 }, name: 'idx_user_chat' },
  ],
};

module.exports = { COLLECTIONS, SCHEMAS, INDEXES };
