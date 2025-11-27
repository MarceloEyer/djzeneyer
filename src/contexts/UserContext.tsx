import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// --- Interfaces ---
interface WordPressUser {
  id: number;
  email: string;
  name?: string;
  display_name?: string;
  isLoggedIn: boolean;
  token?: string;
  avatar?: string;
  roles?: string[];
}

interface UserContextType {
  user: WordPressUser | null;
  googleClientId: string | null; // 🌟 O ID vem do WordPress agora!
  isAuthenticated: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error: string | null;
  
  // Ações
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>; // 🌟 Recebe o token direto do Modal
  logout: () => void;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL base da API (Plugin ZenEyer)
  const API_URL = `${window.location.origin}/wp-json/zeneyer-auth/v1`;

  // ✅ Inicialização: Configs + Sessão
  useEffect(() => {
    const init = async () => {
      try {
        // 1. Busca Configurações Públicas (Google ID)
        const settingsRes = await fetch(`${API_URL}/settings`);
        const settingsData = await settingsRes.json();
        if (settingsData.success && settingsData.data.google_client_id) {
          setGoogleClientId(settingsData.data.google_client_id);
        }

        // 2. Restaura Sessão
        const token = localStorage.getItem('zen_jwt');
        const savedUser = localStorage.getItem('zen_user');

        if (token && savedUser) {
          // Opcional: Validar token no backend para garantir que não expirou
          // Por performance, carregamos o local primeiro e validamos em background
          setUser(JSON.parse(savedUser));
          
          // Validação silenciosa
          fetch(`${API_URL}/auth/validate`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json()).then(data => {
             if (!data.success) logout(); // Se expirou, desloga
          }).catch(() => logout());
        }
      } catch (err) {
        console.error('[UserContext] Falha na inicialização:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    init();
  }, []);

  // --- Helpers ---
  const saveSession = (userData: WordPressUser, token: string) => {
    const userWithStatus = { ...userData, isLoggedIn: true, token };
    setUser(userWithStatus);
    localStorage.setItem('zen_jwt', token);
    localStorage.setItem('zen_user', JSON.stringify(userWithStatus));
  };

  // --- Ações ---

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'Credenciais inválidas');
      
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'Falha no registro');
      
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });
      const json = await res.json();

      if (!json.success) throw new Error(json.message || 'Falha no Google Login');
      
      saveSession(json.data.user, json.data.token);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zen_jwt');
    localStorage.removeItem('zen_user');
  };

  const clearError = () => setError(null);

  return (
    <UserContext.Provider value={{
      user,
      googleClientId, // 🚀 Exportando ID dinâmico
      isAuthenticated: !!user,
      loading,
      loadingInitial,
      error,
      login,
      register,
      googleLogin,
      logout,
      clearError
    }}>
      {children}
    </UserContext.Provider>
  );
};

// --- Hooks ---
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be used within a UserProvider');
  return context;
};

// Mantendo compatibilidade com código legado
export const useAuth = useUser; 
;