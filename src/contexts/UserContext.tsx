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
  loginWithGoogle: () => Promise<void>; // Adicionado de volta para o Google Login
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
lz-user-context-final-token-validation-error-fix
        console.error("Falha ao analisar dados do usuário armazenados ou token inválido", e);
        localStorage.clear(); // Limpa dados inválidos
      }
    }
  }, []);

  // --- Funções de Autenticação com Simple JWT Login ---

  const login = async (emailParam: string, passwordParam: string) => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint de login do Simple JWT Login (geralmente /auth)
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/auth`, { // <--- ENDPOINT CORRETO AQUI
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailParam, password: passwordParam }), // Simple JWT Login usa 'email'
      });

      const data = await response.json();
      if (response.ok && data.success && data.data?.jwt) {
        // O Simple JWT Login retorna 'jwt' dentro de 'data'
        const token = data.data.jwt;
        // Para obter os dados completos do usuário, podemos precisar de um endpoint /me
        // Por enquanto, podemos usar os dados do JWT se o plugin retorna, ou fazer uma busca adicional.
        // O Simple JWT Login não retorna user_email/user_display_name diretamente aqui.
        // Vamos usar o endpoint /wp/v2/users/me para obter os dados do usuário.
        const userResponse = await fetch(`${window.wpData.restUrl}wp/v2/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-WP-Nonce': window.wpData.nonce // Nonce pode ser necessário
            }
        });
        const userData = await userResponse.json();

        if (!userResponse.ok || userData.code) { // userData.code indica erro na API WP
            setError(userData.message || "Erro ao obter dados do usuário logado.");
            throw new Error(userData.message || "Erro ao obter dados do usuário logado.");
        }

        const loggedInUser: WordPressUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.slug, // Usa name ou slug como fallback
          isLoggedIn: true,
          token: token,
        };
        setUser(loggedInUser);
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('wp_user_data', JSON.stringify({
            id: loggedInUser.id,
            email: loggedInUser.email,
            name: loggedInUser.name
        }));
        console.log('Login bem-sucedido!', loggedInUser);
      } else {
        const errorMessage = data.data?.message || data.message || "Credenciais inválidas.";
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
      // Endpoint de registro do Simple JWT Login (geralmente /register)
      const response = await fetch(`${window.wpData.restUrl}simple-jwt-login/v1/users/register`, { // <--- ENDPOINT CORRETO AQUI
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce, // Nonce pode ser necessário para endpoints WP padrão, mesmo com JWT.
        },
        body: JSON.stringify({
            email: emailParam,
            password: passwordParam,
            user_login: emailParam, // O Simple JWT Login espera user_login ou email como username
            display_name: nameParam,
            first_name: nameParam // Para facilitar a exibição do nome
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) { // Simple JWT Login retorna 'success: true'
        console.log('Cadastro bem-sucedido!', data);
        // Após o registro, se a opção "Initialize force login after register" estiver ativa no plugin,
        // o usuário será logado automaticamente.
        // Caso contrário, podemos tentar logar manualmente aqui.
        await login(emailParam, passwordParam);
      } else {
        const errorMessage = data.data?.message || data.message || "Erro no registro.";
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
    window.location.href = window.wpData.siteUrl; 
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      // O Simple JWT Login, em beta, pode ter uma rota direta para isso.
      // A documentação menciona: beta Google OAuth Integration / beta Google JWT on all endpoints
      // Você precisaria verificar a rota exata que o plugin gera para isso.
      // Por exemplo, pode ser: `${window.wpData.restUrl}simple-jwt-login/v1/google-auth`
      // Ou ele pode esperar um token do Google (ID Token) que você passaria para ele.
      // A forma mais comum com plugins de social login é redirecionar.

      // Para o Simple JWT Login e Google:
      // O jeito mais simples é redirecionar o usuário para a página de login do WP
      // onde o botão do Google do plugin estará disponível.
      window.location.href = `${window.wpData.siteUrl}/wp-login.php?loginSocial=google`;
      // Ou, se o Simple JWT Login tiver uma URL específica para iniciar o OAuth Google, use-a.
      // Ex: `${window.wpData.restUrl}simple-jwt-login/v1/auth/google` (verificar docs do plugin)

    } catch (err: any) {
      console.error("[UserContext] Erro ao iniciar login com Google:", err);
      setError(err.message || 'Falha ao iniciar login com Google.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    loginWithGoogle,
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