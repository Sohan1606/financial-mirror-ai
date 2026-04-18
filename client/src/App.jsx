import React from 'react';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';
import Dashboard from './components/Dashboard';
import UploadSection from './components/UploadSection';
import FutureSimulator from './components/FutureSimulator';
import ManualEntryForm from './components/ManualEntryForm';

function AppContent() {
  const { analysis, loading, data, setData } = useAnalysis();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
              FINANCIAL<span className="text-emerald-500">MIRROR</span>
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <button className="px-4 py-2 text-sm font-medium text-emerald-400 bg-emerald-400/10 rounded-lg">Dashboard</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Insights</button>
              <button className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">Planning</button>
            </nav>
            <div className="h-6 w-px bg-slate-800"></div>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
              Connect Bank
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!data || data.length === 0 ? (
          <div className="max-w-4xl mx-auto space-y-12 py-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Visualize Your <span className="text-emerald-500">Financial Future</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Upload your transaction history or manually enter data to get deep AI-powered insights into your spending habits and wealth growth.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <UploadSection />
              <ManualEntryForm transactions={data} onTransactionsUpdate={setData} />
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            <Dashboard transactions={data} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <FutureSimulator transactions={data} />
              </div>
              <div className="space-y-8">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-center transition-all group">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📄</div>
                      <div className="text-xs font-bold text-slate-400">Export Report</div>
                    </button>
                    <button className="p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-center transition-all group">
                      <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🎯</div>
                      <div className="text-xs font-bold text-slate-400">Set Goals</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 mt-24 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; 2024 Financial Mirror AI. Secure & Private.
          </p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AnalysisProvider>
      <AppContent />
    </AnalysisProvider>
  );
}

export default App;
