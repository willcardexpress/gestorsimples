import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-all duration-300">
      {user && (
        <header className="bg-white/80 dark:bg-white/10 backdrop-blur-md border-b border-gray-200 dark:border-white/20 shadow-sm dark:shadow-gray-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">IPTV Reseller</h1>
                </div>
                <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-white/20 rounded-full px-3 py-1 shadow-sm">
                  <User className="w-4 h-4 text-gray-700 dark:text-white" />
                  <span className="text-gray-700 dark:text-white text-sm">
                    {user.name} ({user.type === 'admin' ? 'Admin' : 'Cliente'})
                  </span>
                  {user.type === 'client' && (
                    <span className="bg-yellow-400 dark:bg-yellow-500 text-gray-900 dark:text-black text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                      {user.points} pts
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;