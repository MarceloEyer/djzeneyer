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
  register: (name: string, email: string, password: string) => Promise<void>; // Manter a assinatura, mas a implementação pode ser um no-op ou throw error
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

  // A função register no UserContext agora não será mais chamada diretamente pelo AuthModal
  // porque o AuthModal redireciona para a página de registro padrão do WP.
  // Mantemos a assinatura aqui para compatibilidade de tipo, mas a implementação pode ser um no-op.
  const register = async (nameParam: string, emailParam: string, passwordParam: string) => {
    console.warn("[UserContext] A função de registro da API REST não é mais usada diretamente. O modal de autenticação agora redireciona para a página de registro padrão do WordPress.");
    // Você pode lançar um erro ou apenas retornar, dependendo de como quer lidar com chamadas inesperadas.
    // throw new Error("A criação de conta é feita via redirecionamento para a página padrão do WordPress.");
    return Promise.resolve(); // Retorna uma Promise resolvida para não quebrar o fluxo
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('wp_user_data');
    console.log('Usuário deslogado.');
  };

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