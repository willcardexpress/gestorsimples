import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, Package, Clock, Star, ToggleLeft, ToggleRight, Upload, Code, CheckCircle, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Plan } from '../../types';
import ImportCodesModal from './ImportCodesModal';

const PlansManager: React.FC = () => {
  const { plans, codes, loading, createPlan, updatePlan, deletePlan, addCodes } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedPlanForImport, setSelectedPlanForImport] = useState<Plan | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: '',
    pointsReward: '',
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormError('');
    setIsSubmitting(true);

    try {
      // Client-side validation
      const price = parseFloat(formData.price);
      if (isNaN(price) || price < 0) {
        setFormError('O preço deve ser um número válido e não negativo.');
        return;
      }

      const pointsReward = parseInt(formData.pointsReward);
      if (isNaN(pointsReward) || pointsReward < 0) {
        setFormError('Os pontos de recompensa devem ser um número inteiro válido e não negativo.');
        return;
      }

      if (!formData.name.trim()) {
        setFormError('O nome do plano é obrigatório.');
        return;
      }

      if (!formData.description.trim()) {
        setFormError('A descrição do plano é obrigatória.');
        return;
      }

      if (!formData.duration.trim()) {
        setFormError('A duração do plano é obrigatória.');
        return;
      }

      if (!formData.features.trim()) {
        setFormError('Pelo menos um recurso deve ser especificado.');
        return;
      }

      const planData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        duration: formData.duration.trim(),
        features: formData.features.split('\n').filter(f => f.trim()).map(f => f.trim()),
        pointsReward: pointsReward,
        isActive: formData.isActive
      };

      let success = false;
      
      if (editingPlan) {
        success = await updatePlan(editingPlan.id, planData);
        if (success) {
          console.log('Plan updated successfully');
        }
      } else {
        success = await createPlan(planData);
        if (success) {
          console.log('Plan created successfully');
        }
      }

      if (!success) {
        setFormError('Erro ao salvar o plano. Por favor, tente novamente.');
        return;
      }

      // Success - clear form and close
      setFormError('');
      resetForm();
    } catch (error) {
      console.error('Error in form submission:', error);
      setFormError('Erro inesperado ao salvar o plano. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: '',
      pointsReward: '',
      isActive: true
    });
    setShowForm(false);
    setEditingPlan(null);
    setFormError('');
  };

  const handleEdit = (plan: Plan) => {
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration,
      features: plan.features.join('\n'),
      pointsReward: plan.pointsReward.toString(),
      isActive: plan.isActive
    });
    setEditingPlan(plan);
    setFormError('');
    setShowForm(true);
  };

  const togglePlanStatus = async (plan: Plan) => {
    const success = await updatePlan(plan.id, { isActive: !plan.isActive });
    if (!success) {
      console.error('Failed to update plan status');
    }
  };

  const handleImportCodes = (planId: string, newCodes: string[]) => {
    addCodes(planId, newCodes);
    const plan = plans.find(p => p.id === planId);
    setImportSuccessMessage(`${newCodes.length} códigos importados com sucesso para o plano "${plan?.name}"!`);
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      setImportSuccessMessage('');
    }, 5000);
  };

  const openImportModal = (plan: Plan) => {
    setSelectedPlanForImport(plan);
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedPlanForImport(null);
  };

  const getCodesCount = (planId: string) => {
    const planCodes = codes.filter(c => c.planId === planId);
    const availableCodes = planCodes.filter(c => !c.isUsed).length;
    const totalCodes = planCodes.length;
    return { available: availableCodes, total: totalCodes };
  };

  // Show loading state if data is still loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-gray-700 dark:text-gray-300 text-lg">Carregando planos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Planos</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {plans.length} {plans.length === 1 ? 'plano encontrado' : 'planos encontrados'}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={isSubmitting}
          className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Plano</span>
        </button>
      </div>

      {/* Success Message */}
      {importSuccessMessage && (
        <div className="bg-green-50 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 rounded-lg p-4 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-green-800 dark:text-green-200">{importSuccessMessage}</p>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingPlan ? 'Editar Plano' : 'Criar Novo Plano'}
          </h3>
          
          {/* Form Error */}
          {formError && (
            <div className="mb-4 bg-red-50 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-red-800 dark:text-red-200">{formError}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nome do Plano</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ex: Plano Premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Duração</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Ex: 30 dias"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="29.90"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Pontos de Recompensa</label>
                <input
                  type="number"
                  min="0"
                  value={formData.pointsReward}
                  onChange={(e) => setFormData({ ...formData, pointsReward: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={3}
                placeholder="Descrição do plano..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Recursos (um por linha)</label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                rows={4}
                placeholder={`Qualidade HD/4K\nMais de 1000 canais\nSupporte 24/7\nSem travamento`}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                disabled={isSubmitting}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-200">Plano ativo</label>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>{editingPlan ? 'Atualizar' : 'Criar'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {plans.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum plano criado ainda</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm">Clique em "Novo Plano" para criar o primeiro plano</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const { available, total } = getCodesCount(plan.id);
            
            return (
              <div key={plan.id} className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 group shadow-lg dark:shadow-gray-900/20 hover:shadow-xl dark:hover:shadow-gray-900/30 transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{plan.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => togglePlanStatus(plan)}
                      disabled={isSubmitting}
                      className={`p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed ${plan.isActive ? 'text-green-500' : 'text-gray-400'}`}
                    >
                      {plan.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={() => handleEdit(plan)}
                      disabled={isSubmitting}
                      className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      disabled={isSubmitting}
                      className="p-2 bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">R$ {plan.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{plan.pointsReward} pontos</span>
                  </div>

                  {/* Codes Counter */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3 border border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">Códigos</span>
                      </div>
                      <span className={`text-sm font-medium ${available > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {available}/{total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${available > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: total > 0 ? `${(available / total) * 100}%` : '0%' }}
                      ></div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {available > 0 ? `${available} disponíveis` : 'Sem códigos disponíveis'}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-gray-900 dark:text-white font-medium mb-2">Recursos:</h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-gray-700 dark:text-gray-300 text-sm flex items-center space-x-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-white/10 space-y-3">
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    plan.isActive 
                      ? 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-500/30' 
                      : 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-500/30'
                  }`}>
                    {plan.isActive ? 'Ativo' : 'Inativo'}
                  </div>

                  {/* Import Codes Button */}
                  <button
                    onClick={() => openImportModal(plan)}
                    disabled={!plan.isActive || isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 group-hover:shadow-lg"
                    title={!plan.isActive ? 'Ative o plano para importar códigos' : 'Importar códigos para este plano'}
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">Importar Códigos</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && selectedPlanForImport && (
        <ImportCodesModal
          plan={selectedPlanForImport}
          onClose={closeImportModal}
          onImportSuccess={handleImportCodes}
        />
      )}
    </div>
  );
};

export default PlansManager;