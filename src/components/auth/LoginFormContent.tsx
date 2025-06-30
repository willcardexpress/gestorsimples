import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

interface LoginFormContentProps {
  onSwitchToRegister: () => void;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(email, password);
    
    if (!success) {
      setError('Email ou senha inválidos');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IPTV Reseller</h1>
        <p className="text-gray-600 dark:text-gray-300">Faça login para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500 rounded-lg p-3 text-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <span>Entrar</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToRegister}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Não tem uma conta? Cadastre-se</span>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/20">
        <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
          <h3 className="text-gray-900 dark:text-white font-medium mb-2">Credenciais de teste:</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p><strong>Admin:</strong> admin@iptv.com / admin123</p>
            <p><strong>Cliente:</strong> Cadastre-se ou crie via admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFormContent;