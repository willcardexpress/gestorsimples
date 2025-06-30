import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Code, Plus, Search, Package } from 'lucide-react';

const CodesManager: React.FC = () => {
  const { plans, codes, addCodes } = useApp();
  const [selectedPlan, setSelectedPlan] = useState('');
  const [newCodes, setNewCodes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCodes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !newCodes.trim()) return;

    const codesArray = newCodes.split('\n').filter(code => code.trim());
    addCodes(selectedPlan, codesArray);
    
    setNewCodes('');
    setSelectedPlan('');
    setShowAddForm(false);
  };

  const filteredCodes = codes.filter(code => {
    const plan = plans.find(p => p.id === code.planId);
    return plan?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           code.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getCodesByPlan = () => {
    const codesByPlan: { [key: string]: typeof codes } = {};
    
    plans.forEach(plan => {
      codesByPlan[plan.id] = codes.filter(code => code.planId === plan.id);
    });
    
    return codesByPlan;
  };

  const codesByPlan = getCodesByPlan();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Códigos</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Códigos</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adicionar Códigos</h3>
          
          <form onSubmit={handleAddCodes} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Selecionar Plano</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Selecione um plano</option>
                {plans.filter(p => p.isActive).map(plan => (
                  <option key={plan.id} value={plan.id} className="bg-white dark:bg-gray-800">
                    {plan.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Códigos (um por linha)
              </label>
              <textarea
                value={newCodes}
                onChange={(e) => setNewCodes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder={`IPTV-ABC123-DEF456\nIPTV-GHI789-JKL012\nIPTV-MNO345-PQR678`}
                required
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Total de códigos: {newCodes.split('\n').filter(c => c.trim()).length}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCodes('');
                  setSelectedPlan('');
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Adicionar Códigos
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar por plano ou código..."
            />
          </div>
        </div>

        <div className="space-y-6">
          {plans.map(plan => {
            const planCodes = codesByPlan[plan.id] || [];
            const usedCodes = planCodes.filter(c => c.isUsed).length;
            
            return (
              <div key={plan.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {usedCodes}/{planCodes.length} códigos usados
                    </p>
                    <div className="w-32 bg-gray-300 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${planCodes.length ? (usedCodes / planCodes.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {planCodes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {planCodes.slice(0, 10).map(code => (
                      <div 
                        key={code.id} 
                        className={`p-3 rounded-lg border ${
                          code.isUsed 
                            ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30' 
                            : 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Code className={`w-4 h-4 ${code.isUsed ? 'text-red-500' : 'text-green-500'}`} />
                          <span className={`text-xs px-2 py-1 rounded ${
                            code.isUsed 
                              ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' 
                              : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400'
                          }`}>
                            {code.isUsed ? 'Usado' : 'Disponível'}
                          </span>
                        </div>
                        <p className="text-gray-900 dark:text-white font-mono text-sm mt-2 truncate">
                          {code.code}
                        </p>
                        {code.isUsed && code.usedAt && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            Usado em {new Date(code.usedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">Nenhum código adicionado para este plano</p>
                  </div>
                )}

                {planCodes.length > 10 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-4">
                    E mais {planCodes.length - 10} códigos...
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CodesManager;