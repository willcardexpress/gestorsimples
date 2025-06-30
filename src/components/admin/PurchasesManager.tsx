import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { ShoppingCart, User, Package, Calendar, DollarSign, Star } from 'lucide-react';

const PurchasesManager: React.FC = () => {
  const { purchases, users, plans, codes } = useApp();

  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalTransactions = purchases.length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Vendas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalTransactions ? (totalRevenue / totalTransactions).toFixed(2) : '0.00'}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
        <div className="flex items-center space-x-3 mb-6">
          <ShoppingCart className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Histórico de Vendas</h3>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma venda realizada</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">As vendas aparecerão aqui conforme forem realizadas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((purchase) => {
              const client = users.find(u => u.id === purchase.clientId);
              const plan = plans.find(p => p.id === purchase.planId);
              const code = codes.find(c => c.id === purchase.codeId);

              return (
                <div key={purchase.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{client?.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{client?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{plan?.name}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{plan?.duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">R$ {purchase.amount.toFixed(2)}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">+{purchase.pointsEarned} pontos</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {new Date(purchase.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Código:</span>
                        <span className="text-gray-900 dark:text-white font-mono text-sm bg-gray-100 dark:bg-white/10 px-2 py-1 rounded border border-gray-200 dark:border-white/20">
                          {code?.code}
                        </span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30'
                          : purchase.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
                          : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                      }`}>
                        {purchase.status === 'completed' ? 'Concluída' : 
                         purchase.status === 'pending' ? 'Pendente' : 'Falhou'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesManager;