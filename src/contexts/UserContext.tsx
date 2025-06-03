import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Adicione esta declaração para que o TypeScript reconheça window.wpData
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string; // Ex: https://djzeneyer.com/wp-json/
      nonce: string; // Nonce para requisições WP REST API (útil para algumas, mas JWT para auth)
    };
  }
}

// Definição de tipo para o usuário do WordPress/JWT
export interface WordPressUser {
  id: number;
  email: string;
  name: string;
  isLoggedIn: boolean;
  token?: string; // JWT token para autenticação de API
  // Adicione outras propriedades do usuário WP se precisar (ex: role)
}

interface UserContextType {
  user: WordPressUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  // Removendo loginWithGoogle e outros específicos do Supabase
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<WordPressUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt_token');
    const storedUserData = localStorage.getItem('wp_user_data');
    if (storedToken && storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        setUser({ ...parsedUser, isLoggedIn: true, token: storedToken });
      } catch (e) {
        console.error("Falha ao analisar dados do usuário armazenados ou token inválido", e);
        localStorage.clear(); // Limpa dados inválidos
      }
    }
  }, []);

  // --- Funções de Autenticação com WordPress JWT ---

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.wpData.restUrl}jwt-auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: emailParam, password: passwordParam }), // JWT Auth usa 'username' para email
      });

      const data = await response.json();
      if (response.ok && data.token) {
        // Para obter o ID e o nome completo, podemos fazer uma requisição adicional
        // ou inferir do email/nome de usuário se a API JWT não retornar tudo.
        // O JWT Authentication plugin retorna user_email e user_display_name
        const loggedInUser: WordPressUser = {
          id: data.data?.user?.id || 0, // Pode não vir no retorno direto do JWT, precisaria de /wp/v2/users/me
          email: data.user_email,
          name: data.user_display_name,
          isLoggedIn: true,
          token: data.token,
        };
        setUser(loggedInUser);
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('wp_user_data', JSON.stringify({
            id: loggedInUser.id,
            email: loggedInUser.email,
            name: loggedInUser.name
        }));
        console.log('Login bem-sucedido!', loggedInUser);
      } else {
        const errorMessage = data.message || "Credenciais inválidas.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Erro no login:", err);
      setError(err.message || 'Erro ao tentar fazer login.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint para registro de novo usuário. Requer "Qualquer um pode se registrar" ativo no WP.
      const response = await fetch(`${window.wpData.restUrl}wp/v2/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Não precisa de Authorization Bearer para registrar se "Qualquer um pode se registrar" estiver ativo
          // E o nonce não é tipicamente usado para POST /users para registro aberto.
        },
        body: JSON.stringify({
            username: emailParam, // O WP REST API usa 'username' para o login do usuário
            email: emailParam,
            password: passwordParam,
            name: nameParam // Para o nome completo do usuário
        }),
      });

      const data = await response.json();
      if (response.ok && data.id) {
        console.log('Cadastro bem-sucedido!', data);
        // Após o registro, tente logar o usuário automaticamente
        await login(emailParam, passwordParam);
      } else {
        const errorMessage = data.message?.rendered || data.message || "Erro no registro.";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("[UserContext] Erro no registro:", err);
      setError(err.message || 'Erro ao tentar se cadastrar.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('Usuário deslogado.');
  };

  // Removendo funções específicas do Supabase que não se aplicam mais
  // loginWithGoogle, updateProfileData, earnXP, unlockAchievement, acquireBadge

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};