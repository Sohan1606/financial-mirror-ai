export const generateSampleTransactions = () => {
  const categories = [
    { name: 'Food & Dining', type: 'expense', merchants: ['Swiggy', 'Zomato', 'Starbucks', 'Pizza Hut'] },
    { name: 'Shopping', type: 'expense', merchants: ['Amazon', 'Myntra', 'Flipkart', 'Zara'] },
    { name: 'Transportation', type: 'expense', merchants: ['Uber', 'Ola', 'Petrol Bunk', 'Metro'] },
    { name: 'Entertainment', type: 'expense', merchants: ['Netflix', 'Spotify', 'Disney+', 'PVR'] },
    { name: 'Bills & Utilities', type: 'expense', merchants: ['Airtel', 'BESCOM', 'Gas', 'Water'] },
    { name: 'Groceries', type: 'expense', merchants: ['BigBasket', 'Blinkit', 'Instamart', 'Reliance Fresh'] },
  ];

  const transactions = [];
  const now = new Date();

  // Salary
  transactions.push({
    date: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    amount: 120000,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary - March'
  });

  // Rent
  transactions.push({
    date: new Date(now.getFullYear(), now.getMonth(), 3).toISOString(),
    amount: 35000,
    type: 'expense',
    category: 'Rent',
    description: 'Apartment Rent'
  });

  // Subscriptions (to be detected as leaks)
  transactions.push({
    date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
    amount: 499,
    type: 'expense',
    category: 'Entertainment',
    description: 'Netflix Subscription'
  });
  transactions.push({
    date: new Date(now.getFullYear(), now.getMonth() - 1, 5).toISOString(),
    amount: 499,
    type: 'expense',
    category: 'Entertainment',
    description: 'Netflix Subscription'
  });

  // Micro-spending (to be detected as leaks)
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 25));
    transactions.push({
      date: date.toISOString(),
      amount: Math.floor(Math.random() * 150) + 50,
      type: 'expense',
      category: 'Food & Dining',
      description: 'Quick Bite / Tea'
    });
  }

  // General expenses
  for (let i = 0; i < 10; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const merchant = cat.merchants[Math.floor(Math.random() * cat.merchants.length)];
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    transactions.push({
      date: date.toISOString(),
      amount: Math.floor(Math.random() * 2000) + 200,
      type: 'expense',
      category: cat.name,
      description: merchant
    });
  }

  return transactions;
};
