import FintechDashboard from './FintechDashboard';
import { calculateFinancialAnalysis } from '../utils/financialCalculations';
import { formatINR } from '../utils/formatINR';


const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

export default function Dashboard({ transactions, onTransactionsUpdate, analysis }) {
  // If no analysis provided, calculate it
  const calculatedAnalysis = analysis || calculateFinancialAnalysis(transactions || []);

  if (!calculatedAnalysis || calculatedAnalysis.totalTransactions === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <FintechDashboard transactions={transactions} analysis={calculatedAnalysis} />;
}

