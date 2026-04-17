import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { formatINR } from '../utils/formatINR';

const CSVUpload = ({ onDataParsed }) => {
  const [parsedData, setParsedData] = useState([]);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateCSVFormat = (data) => {
    if (data.length === 0) return 'No data found in CSV';
    
    const requiredHeaders = ['date', 'amount', 'type', 'category'];
    const headers = Object.keys(data[0]);
    
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h.toLowerCase()));
    if (missingHeaders.length > 0) {
      return `Missing required columns: ${missingHeaders.join(', ')}`;
    }
    
    return null;
  };

  const parseCSV = useCallback((file) => {
    setLoading(true);
    setError('');
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const validationError = validateCSVFormat(results.data);
        if (validationError) {
          setError(validationError);
          setLoading(false);
          return;
        }
        
        const cleanedData = results.data.map(row => ({
          date: row.date?.trim() || '',
          amount: parseFloat(row.amount) || 0,
          type: row.type?.trim().toLowerCase() || '',
          category: row.category?.trim() || 'Uncategorized'
        })).filter(row => row.amount > 0 && ['income', 'expense'].includes(row.type));
        
        setParsedData(cleanedData);
        onDataParsed(cleanedData);
        setLoading(false);
      },
      error: (err) => {
        setError('Failed to parse CSV: ' + err);
        setLoading(false);
      }
    });
  }, [onDataParsed]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.csv')) {
      parseCSV(file);
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      parseCSV(file);
    } else {
      setError('Please drop a CSV file');
    }
  }, [parseCSV]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const downloadSampleCSV = () => {
    const sampleData = [
      ['date', 'amount', 'type', 'category'],
      ['2024-01-01', '75000', 'income', 'Salary'],
      ['2024-01-05', '2500', 'expense', 'Groceries'],
      ['2024-01-08', '15000', 'expense', 'Rent'],
      ['2024-01-10', '1200', 'expense', 'Transport'],
      ['2024-01-12', '3500', 'expense', 'Dining'],
      ['2024-01-15', '800', 'expense', 'Utilities'],
      ['2024-01-18', '25000', 'income', 'Freelance'],
      ['2024-01-20', '4500', 'expense', 'Shopping'],
      ['2024-01-22', '12000', 'expense', 'EMI'],
      ['2024-01-25', '2000', 'expense', 'Entertainment'],
      ['2024-01-28', '1500', 'expense', 'Healthcare'],
      ['2024-01-30', '3000', 'expense', 'Subscription'],
      ['2024-02-01', '75000', 'income', 'Salary'],
      ['2024-02-03', '2800', 'expense', 'Groceries'],
      ['2024-02-08', '15000', 'expense', 'Rent']
    ];
    
    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div 
        className={`
          bg-gradient-to-br from-slate-800/50 to-slate-900/50 
          border-2 border-dashed border-slate-600/50 
          rounded-3xl p-12 text-center 
          transition-all duration-300 hover:border-emerald-400/50
          backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:scale-[1.02]
          ${dragging ? 'border-emerald-400/70 bg-emerald-500/5 scale-105 ring-2 ring-emerald-400/30' : ''}
          ${error ? 'border-red-400/50 bg-red-500/5' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="space-y-6">
          <div>
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center mb-6 border-2 border-emerald-400/30 shadow-xl">
              {dragging ? (
                <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="csv-upload"
              disabled={loading}
            />
            
            <label htmlFor="csv-upload" className="block cursor-pointer">
              <div className="group">
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent mb-2 px-4">
                  {dragging ? 'Drop CSV Here!' : 'Upload CSV File'}
                </p>
                <p className="text-slate-400 mb-1 group-hover:text-slate-300 transition-colors">
                  Drag & drop or click to browse
                </p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  date,amount,type,category
                </p>
              </div>
            </label>

            {/* Sample CSV Download */}
            <button
              onClick={downloadSampleCSV}
              className="mt-4 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 border border-slate-600/50 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Sample CSV
            </button>
          </div>

          {loading && (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl">
              <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-emerald-300 font-medium">Parsing your data...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-400/40 rounded-2xl text-red-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {parsedData.length > 0 && (
            <div className="mt-8 p-6 bg-slate-700/50 backdrop-blur-xl border border-slate-600/50 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <h4 className="font-bold text-emerald-300">
                  ✅ Parsed {parsedData.length} transactions
                </h4>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead>
                    <tr className="border-b border-slate-600/50">
                      {['date', 'amount', 'type', 'category'].map((header) => (
                        <th key={header} className="py-3 px-4 text-left font-semibold text-slate-400 uppercase tracking-wider text-xs">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-600/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-300">{row.date}</td>
                        <td className={`py-3 px-4 font-mono font-bold ${
                          row.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {formatINR(row.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            row.type === 'income' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50' 
                              : 'bg-red-500/20 text-red-300 border border-red-400/50'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 capitalize">{row.category}</td>
                      </tr>
                    ))}
                    {parsedData.length > 5 && (
                      <tr>
                        <td colSpan={4} className="py-4 px-4 text-center text-slate-500 text-sm">
                          ... and {parsedData.length - 5} more rows
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVUpload;

