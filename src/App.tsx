import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider, useApp } from './contexts/AppContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import AuthScreen from './components/auth/AuthScreen';
import AdminDashboard from './components/admin/AdminDashboard';
import ClientDashboard from './components/client/ClientDashboard';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: appLoading } = useApp();

  // Show loading while either auth or app data is loading
  if (authLoading || (user && appLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="text-gray-700 dark:text-gray-300 text-lg">
            {authLoading ? 'Verificando autenticação...' : 'Carregando dados...'}
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Layout>
      {user.type === 'admin' ? <AdminDashboard /> : <ClientDashboard />}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;