const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Papa = require('papaparse');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

const upload = multer({ storage: multer.memoryStorage() });

// In-memory storage for demo
let financialData = [];

// Endpoint to upload CSV
app.post('/api/upload', upload.single('csv'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No CSV file uploaded' });
  }

  Papa.parse(req.file.buffer.toString(), {
    header: true,
    complete: (results) => {
      financialData = results.data.filter(row => row.date && row.amount && row.type && row.category);
      const analysis = calculateAnalysis(financialData);
      res.json({ data: financialData, analysis });
    },
    error: (error) => {
      res.status(400).json({ error: 'CSV parse error: ' + error.message });
    }
  });
});

// Endpoint to get current analysis
app.get('/api/analysis', (req, res) => {
  const analysis = calculateAnalysis(financialData);
  res.json(analysis);
});

// Calculate analysis
function calculateAnalysis(data) {
  if (!data || data.length === 0) {
    return {
      income: 0,
      expenses: 0,
      savings: 0,
      topSpendingCategory: null,
      categoryBreakdown: {},
      monthlyExpenses: {},
      insights: ["Upload your CSV to see personalized insights!"]
    };
  }

  const income = data
    .filter(item => item.type && item.type.toLowerCase() === 'income')
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
  const expenses = data
    .filter(item => item.type && item.type.toLowerCase() === 'expense')
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  
  const savings = income - expenses;
  
  const categoryExpenses = {};
  data
    .filter(item => item.type && item.type.toLowerCase() === 'expense')
    .forEach(item => {
      const cat = item.category || 'Uncategorized';
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + (parseFloat(item.amount) || 0);
    });
  
  const topCategoryEntries = Object.entries(categoryExpenses)
    .sort(([,a], [,b]) => b - a);
  const topCategory = topCategoryEntries.length > 0 ? topCategoryEntries[0] : null;
  
  const monthlyExpenses = {};
  data
    .filter(item => item.type && item.type.toLowerCase() === 'expense')
    .forEach(item => {
      try {
        const date = new Date(item.date);
        if (!isNaN(date)) {
          const month = date.toISOString().slice(0, 7);
          monthlyExpenses[month] = (monthlyExpenses[month] || 0) + (parseFloat(item.amount) || 0);
        }
      } catch (e) {
        console.error('Invalid date:', item.date);
      }
    });
  
  const insights = generateInsights(income, expenses, savings, categoryExpenses);
  
  return {
    income,
    expenses,
    savings,
    topSpendingCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
    categoryBreakdown: categoryExpenses,
    monthlyExpenses,
    insights
  };
}

function generateInsights(income, expenses, savings, categories) {
  const insights = [];
  
  if (expenses > income * 0.7) {
    insights.push("🚨 You're spending 70%+ of your income. Consider cutting back on non-essentials.");
  }
  
  const topCat = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];
  if (topCat) {
    insights.push(`Your biggest spending category is "${topCat[0]}" at $${topCat[1].toFixed(0)}. Review these expenses first.`);
  }
  
  if (savings > 0) {
    const savePotential = Math.max(0, expenses * 0.1);
    insights.push(`Great job saving! You could potentially save an extra $${savePotential.toFixed(0)} per month by reducing expenses by 10%.`);
  }
  
  return insights.length ? insights : ["Upload your CSV to see personalized insights!"];
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  }
});
