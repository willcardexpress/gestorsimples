import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, Eye, EyeOff, Loader2, User, ArrowLeft } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('O nome é obrigatório');
      setIsLoading(false);
      return;
    }

    const success = await register(formData.name.trim(), formData.email, formData.password);
    
    if (success) {
      setSuccess('Conta criada com sucesso! Verifique seu email para confirmar a conta e depois faça login.');
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        onSwitchToLogin();
      }, 3000);
    } else {
      setError('Erro ao criar conta. Verifique se o email não está em uso.');
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Criar Conta</h1>
        <p className="text-gray-600 dark:text-gray-300">Cadastre-se para acessar nossos planos IPTV</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Nome Completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Seu nome completo"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
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
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
              minLength={6}
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

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Confirmar Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-400" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              disabled={isLoading}
              className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500 rounded-lg p-3 text-red-700 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-500/20 border border-green-200 dark:border-green-500 rounded-lg p-3 text-green-700 dark:text-green-200 text-sm">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Criando conta...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Criar Conta</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Já tem uma conta? Faça login</span>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/20">
        <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-4">
          <h3 className="text-gray-900 dark:text-white font-medium mb-2">Sobre o cadastro:</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>• Você receberá um email de confirmação</p>
            <p>• Sua conta será criada como cliente</p>
            <p>• Você poderá comprar planos IPTV imediatamente</p>
            <p>• Ganhe pontos a cada compra realizada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;