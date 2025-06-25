// Melhorias sugeridas para o UserContext

// 1. Função helper para acessar wpData de forma consistente
const getWpData = () => {
  if (!window.wpData) {
    throw new Error("Serviço de autenticação não pronto. Por favor, recarregue a página.");
  }
  return window.wpData;
};

// 2. Interface unificada para GamiPress
interface GamiPressEarning {
  id: number;
  title: { rendered: string };
  status: string;
  post_type: 'points_award' | 'achievement' | 'rank';
  points?: number;
  points_type?: string;
  content?: { rendered: string };
  points_required?: number;
}

// 3. Logout melhorado
const logout = () => {
  setUser(null);
  setError(null);
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('wp_user_data');
  console.log('Utilizador terminou sessão.');
  
  try {
    const wpData = getWpData();
    window.location.href = wpData.siteUrl;
  } catch (error) {
    // Fallback se wpData não estiver disponível
    window.location.reload();
  }
};

// 4. useEffect consolidado para inicialização
useEffect(() => {
  const initializeAuth = async () => {
    try {
      const wpData = getWpData();
      
      // Inicializar SDK apenas uma vez
      if (!simpleJwtLoginRef.current) {
        simpleJwtLoginRef.current = new SimpleJwtLogin(
          wpData.siteUrl,
          wpData.jwtSettings?.endpoint || '/simple-jwt-login/v1',
          wpData.jwtAuthKey || 'AUTH_KEY'
        );
        console.log("[UserContext] SimpleJwtLogin SDK initialized.");
      }

      // Verificar token armazenado
      const storedToken = localStorage.getItem('jwt_token');
      const storedUserData = localStorage.getItem('wp_user_data');
      
      if (storedToken && storedUserData) {
        const parsedUser = JSON.parse(storedUserData);
        const isValid = await validateToken(storedToken);
        
        if (isValid) {
          await fetchUserDetails(storedToken, parsedUser.email);
        } else {
          console.warn('Token armazenado inválido, terminando sessão');
          logout();
        }
      }
    } catch (error) {
      console.error('[UserContext] Erro na inicialização:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  initializeAuth();
}, []);

// 5. Função de fetch GamiPress separada para melhor organização
const fetchGamipressData = async (token: string, userId: number) => {
  try {
    const wpData = getWpData();
    const response = await fetch(
      `${wpData.restUrl}wp/v2/gamipress-user-earnings?user_id=${userId}&per_page=100`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      console.warn("[UserContext] Failed to fetch GamiPress earnings:", response.status);
      return null;
    }

    const earnings: GamiPressEarning[] = await response.json();
    
    // Processar dados do GamiPress
    const points = earnings
      .filter(e => e.post_type === 'points_award')
      .reduce((acc, curr) => {
        const type = curr.points_type || 'points';
        acc[type] = (acc[type] || 0) + (curr.points || 0);
        return acc;
      }, {} as { [key: string]: number });

    const achievements = earnings.filter(
      e => e.post_type === 'achievement' && e.status === 'publish'
    );

    const ranks = earnings.filter(
      e => e.post_type === 'rank' && e.status === 'publish'
    );

    return {
      gamipress_points: points,
      gamipress_achievements: achievements,
      gamipress_ranks: ranks,
      gamipress_level: ranks.length,
      gamipress_xp: points.points || 0,
      gamipress_rank_name: ranks.length > 0 
        ? ranks.sort((a, b) => b.id - a.id)[0].title.rendered 
        : 'N/A'
    };
  } catch (error) {
    console.warn("[UserContext] Failed to fetch GamiPress data:", error);
    return null;
  }
};