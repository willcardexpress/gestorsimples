import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Package, ShoppingCart, Star, History, User, Code } from 'lucide-react';
import PlansView from './PlansView';
import PurchaseHistory from './PurchaseHistory';

const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const { purchases, plans } = useApp();

  const userPurchases = purchases.filter(p => p.clientId === user?.id);
  const totalSpent = userPurchases.reduce((sum, p) => sum + p.amount, 0);
  const activePlansCount = plans.filter(p => p.isActive).length;

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: User },
    { id: 'plans', label: 'Planos', icon: Package },
    { id: 'history', label: 'Histórico', icon: History },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return <PlansView />;
      case 'history':
        return <PurchaseHistory />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Meus Pontos</p>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{user?.points || 0}</p>
                  </div>
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Total Gasto</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">R$ {totalSpent.toFixed(2)}</p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Compras</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{userPurchases.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Planos Disponíveis</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{activePlansCount}</p>
                  </div>
                  <Code className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bem-vindo, {user?.name}!</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Seus Benefícios</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Sistema de Pontos</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Ganhe pontos a cada compra realizada</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                      <Package className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Planos Variados</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Escolha o plano que melhor se adapta às suas necessidades</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                      <Code className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">Códigos Instantâneos</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">Receba seu código IPTV imediatamente após a compra</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Últimas Compras</h4>
                  <div className="space-y-3">
                    {userPurchases.slice(-3).reverse().map((purchase) => {
                      const plan = plans.find(p => p.id === purchase.planId);
                      return (
                        <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{plan?.name}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(purchase.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600 dark:text-green-400 font-medium">R$ {purchase.amount.toFixed(2)}</p>
                            <p className="text-yellow-600 dark:text-yellow-400 text-sm">+{purchase.pointsEarned} pts</p>
                          </div>
                        </div>
                      );
                    })}
                    {userPurchases.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400">Nenhuma compra realizada ainda</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Explore nossos planos e faça sua primeira compra!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel do Cliente</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Gerencie suas compras e explore nossos planos IPTV</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {renderContent()}
    </div>
  );
};

export default ClientDashboard;