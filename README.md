# 🪞 Financial Mirror AI

A production-grade, full-stack personal finance web application built with React, Node.js, and MongoDB Atlas.

## Features

- 🔐 **JWT Authentication** - Secure login/register with bcrypt password hashing
- 📊 **Dashboard** - Visual overview with health score, income/expense tracking, and interactive charts
- 💳 **Transactions** - Manual entry + CSV upload with full CRUD operations
- 💰 **Budget Tracking** - Set category budgets with real-time spending monitoring
- 🎯 **Goal Tracking** - Create savings goals with progress tracking
- 📈 **Reports** - Monthly/yearly analysis with month-over-month comparisons
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Recharts (data visualization)
- Axios (API client)
- React Router (navigation)
- Lucide React (icons)

**Backend:**
- Node.js + Express
- MongoDB Atlas (native driver)
- JWT authentication
- Bcrypt (password hashing)
- Multer + Papaparse (CSV handling)

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB Atlas account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   cd financial-mirror-ai
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/financial-mirror?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```
   
   This starts both the backend (port 5000) and frontend (port 5173) simultaneously.

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
financial-mirror-ai/
├── server/
│   ├── index.js                  # Express app entry point
│   ├── routes/                   # API route handlers
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── transactions.js      # Transaction CRUD
│   │   ├── upload.js            # CSV upload
│   │   ├── goals.js             # Goals management
│   │   ├── budgets.js           # Budget tracking
│   │   └── reports.js           # Financial reports
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/                   # Database schemas
│   │   ├── schemas.js           # Collection definitions
│   │   └── index.js             # Database initialization
│   └── utils/
│       └── db.js                # MongoDB connection
├── client/
│   └── src/
│       ├── api/                  # API client helpers
│       ├── context/              # React contexts (Auth)
│       ├── pages/                # Page components
│       ├── components/           # Reusable components
│       │   └── layout/          # Layout components
│       └── utils/                # Utility functions
├── .env.example                  # Environment template
└── package.json                  # Root dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `DELETE /api/transactions/bulk` - Delete multiple
- `GET /api/transactions/categories` - Get unique categories

### Upload
- `POST /api/upload/csv` - Upload CSV file

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Budgets
- `GET /api/budgets` - List budgets with spending
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Reports
- `GET /api/reports/monthly` - Monthly summary
- `GET /api/reports/yearly` - Yearly summary
- `GET /api/reports/comparison` - Month vs last month

## CSV Format

For CSV uploads, use the following columns:
```csv
date,amount,type,category,description
2024-01-15,50000,income,Salary,Monthly salary
2024-01-16,5000,expense,Food,Grocery shopping
```

- **date**: ISO format (YYYY-MM-DD)
- **amount**: Positive number
- **type**: "income" or "expense"
- **category**: Any string (e.g., "Food", "Transport")
- **description**: Optional

## Building for Production

```bash
npm run build
npm start
```

The app will be served on port 5000 with the frontend statically served from `client/dist`.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
