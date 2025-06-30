import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { Package, Clock, Star, Check, ShoppingCart, Code } from 'lucide-react';

const PlansView: React.FC = () => {
  const { user } = useAuth();
  const { plans, purchasePlan, codes } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<{planId: string, code: string} | null>(null);

  const activePlans = plans.filter(p => p.isActive);

  const handlePurchase = async (planId: string) => {
    if (!user) return;
    
    setLoading(planId);
    const purchase = await purchasePlan(user.id, planId);
    
    if (purchase) {
      const code = codes.find(c => c.id === purchase.codeId);
      setPurchaseSuccess({ planId, code: code?.code || '' });
      
      // Update user in auth context
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      currentUser.points = currentUser.points + purchase.pointsEarned;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      setTimeout(() => {
        setPurchaseSuccess(null);
      }, 10000);
    }
    
    setLoading(null);
  };

  const getAvailableCodes = (planId: string) => {
    return codes.filter(c => c.planId === planId && !c.isUsed).length;
  };

  if (purchaseSuccess) {
    const plan = plans.find(p => p.id === purchaseSuccess.planId);
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-500/20 dark:to-blue-500/20 backdrop-blur-md rounded-xl p-8 border border-green-200 dark:border-green-500/30 text-center shadow-lg">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compra Realizada com Sucesso!</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">Seu plano {plan?.name} foi ativado e aqui está seu código IPTV:</p>
          
          <div className="bg-white dark:bg-white/10 rounded-lg p-4 mb-6 border border-gray-200 dark:border-white/20">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Code className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300 text-sm">Seu Código IPTV:</span>
            </div>
            <div className="bg-gray-900 dark:bg-black/30 rounded-lg p-3 border border-blue-200 dark:border-blue-500/30">
              <span className="text-white font-mono text-lg tracking-wider">
                {purchaseSuccess.code}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
              Guarde este código em um local seguro. Você precisará dele para configurar seu IPTV.
            </p>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Você também ganhou {plan?.pointsReward} pontos nesta compra!</p>
            <p className="mt-2">Esta mensagem desaparecerá em alguns segundos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nossos Planos IPTV</h2>
        <p className="text-gray-600 dark:text-gray-300">Escolha o plano perfeito para suas necessidades</p>
      </div>

      {activePlans.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum plano disponível no momento</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Novos planos serão adicionados em breve</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePlans.map((plan) => {
            const availableCodes = getAvailableCodes(plan.id);
            const isOutOfStock = availableCodes === 0;
            
            return (
              <div key={plan.id} className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 relative overflow-hidden shadow-lg dark:shadow-gray-900/20 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-shadow">
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Esgotado
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">R$ {plan.price.toFixed(2)}</div>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{plan.duration}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">Ganhe pontos:</span>
                    </div>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">{plan.pointsReward} pts</span>
                  </div>
                </div>

                <div className="mb-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {availableCodes} códigos disponíveis
                  </p>
                </div>

                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading === plan.id || isOutOfStock}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors font-medium ${
                    isOutOfStock
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : loading === plan.id
                      ? 'bg-blue-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading === plan.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processando...</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Esgotado</span>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Comprar Agora</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlansView;