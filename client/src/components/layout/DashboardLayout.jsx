import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  Target,
  BarChart3,
  LogOut,
  TrendingUp,
  Calculator,
  AlertTriangle,
  Zap,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  User
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', newState);
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/leaks', icon: ShieldAlert, label: 'Leak Detector' },
    { path: '/transactions', icon: Receipt, label: 'Transactions' },
    { path: '/budget', icon: Wallet, label: 'Budget' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/reports', icon: BarChart3, label: 'Reports' },
  ];

  const simulatorItems = [
    { path: '/simulators/reality-check', icon: BarChart3, label: 'Reality Check' },
    { path: '/simulators/micro-macro', icon: TrendingUp, label: 'Micro → Macro' },
    { path: '/simulators/delay-cost', icon: Calculator, label: 'Delay Cost' },
    { path: '/simulators/shock-mode', icon: AlertTriangle, label: 'Shock Mode' },
    { path: '/simulators/scenario-builder', icon: Zap, label: 'Scenario Builder' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans antialiased text-slate-200">
      {/* Sidebar */}
      <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-slate-900 border-r border-slate-800 hidden md:flex flex-col transition-all duration-300 relative group/sidebar`}>
        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-all z-50 opacity-0 group-hover/sidebar:opacity-100"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 ${isCollapsed ? 'items-center' : ''} flex flex-col`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">💸</span>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-black text-white tracking-tighter">LeakLess AI</h1>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest leading-none">AI CFO Engine</p>
              </div>
            )}
          </div>
        </div>

        <nav className="mt-4 flex-1 overflow-y-auto scrollbar-hide">
          <div className={`px-6 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Main Menu'}
          </div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3.5 transition-all duration-200 group/nav ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border-r-4 border-emerald-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-500 group-hover/nav:text-slate-300'}`} />
                {!isCollapsed && <span className="font-bold text-sm ml-4">{item.label}</span>}
              </Link>
            );
          })}

          <div className={`px-6 py-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-6 ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? '•••' : 'Simulators'}
          </div>
          {simulatorItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3.5 transition-all duration-200 group/nav ${
                  isActive
                    ? 'bg-purple-500/10 text-purple-400 border-r-4 border-purple-500'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover/nav:text-slate-300'}`} />
                {!isCollapsed && <span className="font-bold text-sm ml-4">{item.label}</span>}
              </Link>
            );
          })}

          {!isCollapsed && (
            <div className="px-6 mt-8 space-y-4">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Quick Actions</div>
              <button 
                onClick={() => navigate('/transactions')}
                className="w-full flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all group/qa"
              >
                <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover/qa:bg-emerald-500 group-hover/qa:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </div>
                New Entry
              </button>
              <button 
                onClick={() => navigate('/transactions')}
                className="w-full flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all group/qa"
              >
                <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover/qa:bg-blue-500 group-hover/qa:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                Import CSV
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'} p-3 rounded-2xl bg-slate-950/50 border border-slate-800/50 mb-4`}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center font-black text-white shrink-0">
              {user?.name?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 font-bold truncate">Premium Plan</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all w-full`}
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="font-bold text-sm ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-950 relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💸</span>
            <h1 className="text-lg font-black text-white">LeakLess AI</h1>
          </div>
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Mobile Bottom Tab Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-3 z-40">
          <div className="flex justify-between items-center overflow-x-auto">
            {[
              { path: '/dashboard', icon: LayoutDashboard },
              { path: '/leaks', icon: ShieldAlert },
              { path: '/transactions', icon: Receipt },
              { path: '/budget', icon: Wallet },
              { path: '/goals', icon: Target },
              { path: '/simulators/reality-check', icon: BarChart3 },
              { path: '/simulators/micro-macro', icon: TrendingUp },
              { path: '/simulators/delay-cost', icon: Calculator },
              { path: '/simulators/shock-mode', icon: AlertTriangle },
              { path: '/simulators/scenario-builder', icon: Zap },
            ].map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={idx} to={item.path} className={`p-2 rounded-xl transition-all flex-shrink-0 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-500'}`}>
                  <item.icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-6 md:p-10 mb-20 md:mb-0">{children}</div>
      </main>
    </div>
  );
}
