import { useAnalysis } from '../context/AnalysisContext';

export default function UploadSection() {
  const { uploadCSV, loading, analysis } = useAnalysis();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadCSV(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-12 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Upload Your Transactions
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <label className="flex-1">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
              disabled={loading}
            />
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-4 px-8 rounded-2xl cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading ? 'Processing...' : '📁 Upload CSV'}
            </div>
          </label>
          
          <div className="text-sm text-slate-400 text-center md:text-left">
            CSV format: date,amount,type(income/expense),category
          </div>
        </div>
        
        {analysis?.insights?.[0] === "Upload your CSV to see personalized insights!" && (
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl backdrop-blur-sm">
            <p className="text-orange-200 font-medium">Ready to analyze! Upload your CSV file to get started.</p>
          </div>
        )}


      </div>
    </div>
  );
}

