import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Package, Users, Code, ShoppingCart, Plus, TrendingUp } from 'lucide-react';
import PlansManager from './PlansManager';
import ClientsManager from './ClientsManager';
import CodesManager from './CodesManager';
import PurchasesManager from './PurchasesManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { plans, users, codes, purchases } = useApp();

  const clientsCount = users.filter(u => u.type === 'client').length;
  const activePlansCount = plans.filter(p => p.isActive).length;
  const totalCodes = codes.length;
  const usedCodes = codes.filter(c => c.isUsed).length;
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
    { id: 'plans', label: 'Planos', icon: Package },
    { id: 'codes', label: 'Códigos', icon: Code },
    { id: 'clients', label: 'Clientes', icon: Users },
    { id: 'purchases', label: 'Vendas', icon: ShoppingCart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return <PlansManager />;
      case 'codes':
        return <CodesManager />;
      case 'clients':
        return <ClientsManager />;
      case 'purchases':
        return <PurchasesManager />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Total de Clientes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{clientsCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Planos Ativos</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{activePlansCount}</p>
                  </div>
                  <Package className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Códigos</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{usedCodes}/{totalCodes}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Usados/Total</p>
                  </div>
                  <Code className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Receita Total</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">R$ {totalRevenue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Vendas Recentes</h3>
              <div className="space-y-3">
                {purchases.slice(-5).reverse().map((purchase) => {
                  const client = users.find(u => u.id === purchase.clientId);
                  const plan = plans.find(p => p.id === purchase.planId);
                  return (
                    <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{client?.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{plan?.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 dark:text-green-400 font-medium">R$ {purchase.amount.toFixed(2)}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {purchases.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 dark:text-gray-400">Nenhuma venda realizada ainda</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Painel Administrativo</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Gerencie seu sistema de revenda IPTV</p>
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

export default AdminDashboard;