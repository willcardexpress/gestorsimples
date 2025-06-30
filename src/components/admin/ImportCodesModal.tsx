import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import { Plan } from '../../types';

interface ImportCodesModalProps {
  plan: Plan;
  onClose: () => void;
  onImportSuccess: (planId: string, codes: string[]) => void;
}

const ImportCodesModal: React.FC<ImportCodesModalProps> = ({
  plan,
  onClose,
  onImportSuccess
}) => {
  const [codes, setCodes] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const codesArray = codes.split('\n').filter(code => code.trim());
  const codesCount = codesArray.length;

  const handleImport = async () => {
    if (codesCount === 0) return;

    setIsImporting(true);
    
    // Simulate import delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onImportSuccess(plan.id, codesArray);
    setIsImporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Importar Códigos</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Plano: {plan.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-white/20 rounded-lg transition-colors"
              disabled={isImporting}
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white" />
            </button>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-500/20 rounded-lg border border-blue-200 dark:border-blue-500/30">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">Como importar códigos:</h3>
                <ul className="text-blue-700 dark:text-blue-200 text-sm space-y-1">
                  <li>• Cole um código por linha no campo abaixo</li>
                  <li>• Certifique-se de que os códigos são únicos e válidos</li>
                  <li>• Linhas em branco serão ignoradas automaticamente</li>
                  <li>• Os códigos serão vinculados ao plano selecionado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Codes Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Códigos IPTV
              </label>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {codesCount} {codesCount === 1 ? 'código' : 'códigos'}
                </span>
              </div>
            </div>
            <textarea
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              placeholder={`IPTV-ABC123-DEF456\nIPTV-GHI789-JKL012\nIPTV-MNO345-PQR678\n\nCole seus códigos aqui, um por linha...`}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-white/20 border border-gray-300 dark:border-white/30 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={12}
              disabled={isImporting}
            />
          </div>

          {/* Preview */}
          {codesCount > 0 && (
            <div className="mb-6">
              <h4 className="text-gray-900 dark:text-white font-medium mb-3">Prévia dos códigos a serem importados:</h4>
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 max-h-32 overflow-y-auto border border-gray-200 dark:border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {codesArray.slice(0, 8).map((code, index) => (
                    <div key={index} className="text-gray-700 dark:text-gray-300 text-sm font-mono bg-white dark:bg-white/10 px-2 py-1 rounded border border-gray-200 dark:border-white/20">
                      {code}
                    </div>
                  ))}
                </div>
                {codesCount > 8 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center">
                    E mais {codesCount - 8} códigos...
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isImporting}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              disabled={codesCount === 0 || isImporting}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              {isImporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Importando...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Importar {codesCount} {codesCount === 1 ? 'Código' : 'Códigos'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCodesModal;