import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Users, Mail, User, Calendar, Star, UserPlus, Info, ArrowRight } from 'lucide-react';

const ClientsManager: React.FC = () => {
  const { users } = useApp();

  const clients = users.filter(u => u.type === 'client');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciar Clientes</h2>
      </div>

      {/* Information about client registration */}
      <div className="bg-blue-50 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Como novos clientes se cadastram?
            </h3>
            <div className="space-y-3 text-blue-800 dark:text-blue-200">
              <p>
                Para garantir a segurança e funcionalidade completa do sistema, novos clientes devem se cadastrar 
                através da tela de login utilizando a opção <strong>"Cadastro"</strong>.
              </p>
              <div className="bg-blue-100 dark:bg-blue-500/30 rounded-lg p-4 border border-blue-300 dark:border-blue-500/50">
                <h4 className="font-medium mb-2 flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4" />
                  <span>Processo de cadastro:</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Cliente acessa a tela de login</li>
                  <li>Clica em "Cadastro" para alternar para o formulário de registro</li>
                  <li>Preenche nome completo, email e senha</li>
                  <li>Sistema cria automaticamente a conta com autenticação</li>
                  <li>Cliente pode fazer login imediatamente</li>
                </ol>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <UserPlus className="w-4 h-4" />
                <span>
                  Este método garante que os clientes tenham acesso completo ao sistema, incluindo 
                  autenticação, compra de planos e histórico de transações.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-white/10 backdrop-blur-md rounded-xl p-6 border border-gray-200 dark:border-white/20 shadow-lg dark:shadow-gray-900/20">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Lista de Clientes ({clients.length})</h3>
        </div>

        {clients.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Nenhum cliente cadastrado</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
              Os clientes aparecerão aqui após se cadastrarem através da tela de login
            </p>
            <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 max-w-md mx-auto border border-gray-200 dark:border-white/10">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                <strong>Instrução para novos clientes:</strong><br/>
                Acesse a tela de login e clique em "Cadastro\" para criar uma nova conta
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div key={client.id} className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-200 dark:border-white/10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-semibold">{client.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Cliente</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{client.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Desde {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                      {client.points} pontos
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="text-green-600 dark:text-green-400 font-medium">Ativo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsManager;