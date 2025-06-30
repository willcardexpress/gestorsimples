import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { History, Package, Calendar, DollarSign, Star, Code, Copy } from 'lucide-react';

const PurchaseHistory: React.FC = () => {
  const { user } = useAuth();
  const { purchases, plans, codes } = useApp();

  const userPurchases = purchases.filter(p => p.clientId === user?.id);
  const totalSpent = userPurchases.reduce((sum, p) => sum + p.amount, 0);
  const totalPoints = userPurchases.reduce((sum, p) => sum + p.pointsEarned, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <History className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Histórico de Compras</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total de Compras</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{userPurchases.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Total Gasto</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">R$ {totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Pontos Ganhos</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{totalPoints}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
        {userPurchases.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhuma compra realizada</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Suas compras aparecerão aqui após serem realizadas</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Suas Compras</h3>
            {userPurchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((purchase) => {
              const plan = plans.find(p => p.id === purchase.planId);
              const code = codes.find(c => c.id === purchase.codeId);

              return (
                <div key={purchase.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-6 border border-gray-200 dark:border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-gray-900 dark:text-white font-semibold text-lg">{plan?.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400">{plan?.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Valor Pago</p>
                            <p className="text-gray-900 dark:text-white font-medium">R$ {purchase.amount.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Pontos Ganhos</p>
                            <p className="text-yellow-600 dark:text-yellow-400 font-medium">{purchase.pointsEarned}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 col-span-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Data da Compra</p>
                            <p className="text-gray-900 dark:text-white font-medium">
                              {new Date(purchase.createdAt).toLocaleDateString()} às {new Date(purchase.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white dark:bg-white/10 rounded-lg p-4 border border-gray-200 dark:border-white/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">Código IPTV:</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(code?.code || '')}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-white/20 rounded transition-colors"
                            title="Copiar código"
                          >
                            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white" />
                          </button>
                        </div>
                        <div className="bg-gray-900 dark:bg-black/30 rounded-lg p-3 border border-blue-200 dark:border-blue-500/30">
                          <span className="text-white font-mono text-sm tracking-wider break-all">
                            {code?.code}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">Status:</span>
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;