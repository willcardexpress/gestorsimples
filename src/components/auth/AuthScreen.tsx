import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import LoginFormContent from './LoginFormContent';
import RegisterForm from './RegisterForm';

const AuthScreen: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { loading: authLoading } = useAuth();

  const switchToLogin = () => setIsLoginMode(true);
  const switchToRegister = () => setIsLoginMode(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-gray-700 dark:text-gray-300 text-lg">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 transition-all duration-300">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-md w-full bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl dark:shadow-gray-900/50 border border-gray-200 dark:border-white/20 p-8">
        {/* Mode Indicator */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 dark:bg-white/10 rounded-lg p-1 flex border border-gray-200 dark:border-white/20">
            <button
              onClick={switchToLogin}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isLoginMode
                  ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={switchToRegister}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLoginMode
                  ? 'bg-white dark:bg-white/20 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Cadastro
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="transition-all duration-300">
          {isLoginMode ? (
            <LoginFormContent onSwitchToRegister={switchToRegister} />
          ) : (
            <RegisterForm onSwitchToLogin={switchToLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;