// localStorage helpers for Financial Mirror AI

export const STORAGE_KEYS = {
  TRANSACTIONS: 'fm_transactions',
  BUDGETS: 'fm_budgets',
  GOALS: 'fm_goals',
  PREFERENCES: 'fm_preferences'
};

export const saveTransactions = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
};

export const loadTransactions = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

export const saveBudgets = (budgets) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  } catch (error) {
    console.error('Failed to save budgets:', error);
  }
};

export const loadBudgets = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load budgets:', error);
    return {};
  }
};

export const saveGoals = (goals) => {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Failed to save goals:', error);
  }
};

export const loadGoals = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load goals:', error);
    return [];
  }
};

export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
};
