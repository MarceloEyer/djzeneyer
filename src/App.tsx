import React, { Suspense } from 'react';
import AppProviders from './providers/AppProviders';
import AppRoutes from './components/AppRoutes'; // Importamos a lógica isolada

function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        }
      >
        {/* Toda a lógica de rotas está encapsulada aqui */}
        <AppRoutes />
      </Suspense>
    </AppProviders>
  );
}

export default App;
