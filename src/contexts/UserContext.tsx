// Provável Caminho: src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient'; // <<< VERIFIQUE ESTE CAMINHO!
import { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';

// Suas types (mantidas como você definiu)
export type Achievement = {
  id: string; // Corresponde a all_achievements.id
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null; // Vem de user_achievements.unlocked_at
};

export type Badge = {
  id: string; // Corresponde a all_badges.id
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  acquiredAt: Date | null; // Vem de user_badges.acquired_at
};

// User type combinando Supabase Auth User com seus dados de perfil e gamificação
export type User = SupabaseAuthUser & {
  profile: { // Dados da tabela 'profiles'
    full_name: string | null;
    avatar_url: string | null;
    level: number;
    xp: number;
    rank: string;
    joinDate?: Date; // O joinDate original virá do created_at do SupabaseAuthUser
    streakDays?: number; // Estes podem ser calculados ou armazenados
    lastActive?: Date;   // Estes podem ser calculados ou armazenados
  };
  achievements: Achievement[]; // Virá de 'user_achievements' e 'all_achievements'
  badges: Badge[];           // Virá de 'user_badges' e 'all_badges'
  isLoggedIn: boolean; // Controlado pela sessão do Supabase
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>; // Adicionada
  updateProfileData: (data: Partial<User['profile']>) => Promise<void>; // Renomeada para clareza
  earnXP: (amount: number) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  acquireBadge: (badgeId: string) => Promise<void>;
  loading: boolean;
  loadingInitial: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Carrega sessão e perfil do usuário
  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoadingInitial(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        await loadUserProfile(currentSession.user);
      } else {
        setUser(null);
      }
      setLoadingInitial(false);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setLoadingInitial(true);
        setSession(newSession);
        if (newSession?.user) {
          await loadUserProfile(newSession.user);
        } else {
          setUser(null);
        }
        setLoadingInitial(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (authUser: SupabaseAuthUser) => {
    try {
      // 1. Buscar perfil básico
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, level, xp, rank')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116: No rows found, ok if profile just created by trigger
        console.error('Erro ao buscar perfil:', profileError);
        // Configura usuário com dados mínimos do Auth e perfil padrão
        setUser({
            ...authUser,
            profile: { full_name: 'Zen Fan', avatar_url: null, level: 1, xp: 0, rank: 'Zen Newcomer' },
            achievements: [],
            badges: [],
            isLoggedIn: true,
        } as User);
        return;
      }

      // 2. Buscar achievements do usuário
      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          unlocked_at,
          all_achievements (id, name, description, icon)
        `)
        .eq('user_id', authUser.id);
      
      if (userAchievementsError) console.error('Erro ao buscar achievements do usuário:', userAchievementsError);
      
      const achievements: Achievement[] = userAchievementsData?.map(ua => ({
        ...(ua.all_achievements as any), // Detalhes do achievement
        unlockedAt: new Date(ua.unlocked_at),
      })) || [];

      // 3. Buscar badges do usuário
      const { data: userBadgesData, error: userBadgesError } = await supabase
        .from('user_badges')
        .select(`
          acquired_at,
          all_badges (id, name, description, image, rarity)
        `)
        .eq('user_id', authUser.id);

      if (userBadgesError) console.error('Erro ao buscar badges do usuário:', userBadgesError);

      const badges: Badge[] = userBadgesData?.map(ub => ({
        ...(ub.all_badges as any), // Detalhes do badge
        acquiredAt: new Date(ub.acquired_at),
      })) || [];
      
      // Monta o objeto User completo
      const fullUser: User = {
        ...authUser,
        profile: {
          full_name: profileData?.full_name || (authUser.email?.split('@')[0] ?? 'Zen Fan'), // Fallback para nome
          avatar_url: profileData?.avatar_url || null,
          level: profileData?.level || 1,
          xp: profileData?.xp || 0,
          rank: profileData?.rank || 'Zen Newcomer',
          joinDate: new Date(authUser.created_at),
          // streakDays e lastActive precisariam de lógica adicional para calcular/atualizar
        },
        achievements,
        badges,
        isLoggedIn: true,
      };
      setUser(fullUser);

    } catch (e) {
      console.error("Erro carregando perfil completo:", e);
      // Configura usuário com dados mínimos do Auth e perfil padrão em caso de erro inesperado
      setUser({
        ...authUser,
        profile: { full_name: 'Zen Fan', avatar_url: null, level: 1, xp: 0, rank: 'Zen Newcomer' },
        achievements: [],
        badges: [],
        isLoggedIn: true,
      } as User);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange vai chamar loadUserProfile
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Para AuthModal exibir
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null); // Limpa usuário localmente
    setSession(null);
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }, // O trigger no Supabase usará isso para popular 'profiles'
        },
      });
      if (error) throw error;
      // O trigger handle_new_user no Supabase cria a entrada na tabela profiles.
      // onAuthStateChange (se a confirmação de email estiver desabilitada ou após confirmação) chamará loadUserProfile.
      alert('Registro realizado! Verifique seu e-mail para confirmação (se a opção estiver habilitada no Supabase).');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Para AuthModal exibir
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) throw error;
        // onAuthStateChange vai chamar loadUserProfile após o redirect
    } catch (error) {
        console.error('Google login failed:', error);
        setLoading(false); // Apenas se houver erro antes do redirect
        throw error;
    }
    // setLoading(false) não é chamado aqui porque há um redirect
  };

  const updateProfileData = async (data: Partial<User['profile']>) => {
    if (!user?.id) {
      console.error("Usuário não logado, impossível atualizar perfil.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      // Atualiza o estado local do usuário para refletir a mudança imediatamente
      setUser(prevUser => prevUser ? ({
        ...prevUser,
        profile: { ...prevUser.profile, ...data } as User['profile'], // Cast para garantir tipo
      }) : null);
    } catch (error) {
      console.error('Falha ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnXP = async (amount: number) => {
    if (!user?.id || !user.profile) return;
    setLoading(true);
    const newXP = (user.profile.xp || 0) + amount;
    const currentLevel = user.profile.level || 1;
    // Simple leveling system: 100 XP per level (exemplo, ajuste conforme sua regra)
    const newLevel = newXP >= (currentLevel * 100) ? currentLevel + 1 : currentLevel;
    const newRank = newLevel > 5 ? 'Zen Master' : (newLevel > 2 ? 'Zen Adept' : user.profile.rank); // Exemplo de lógica de rank

    try {
      await updateProfileData({ xp: newXP, level: newLevel, rank: newRank, lastActive: new Date() });
      // O estado local será atualizado por updateProfileData
    } catch (error) {
      console.error("Falha ao registrar XP:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user?.id || !user.profile) return;
    // Verifica se já desbloqueou para evitar duplicidade
    if (user.achievements.find(ach => ach.id === achievementId && ach.unlockedAt)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievementId });
      if (error) throw error;
      
      // Recarregar perfil para obter o achievement atualizado e outros dados
      await loadUserProfile(user); 
      await earnXP(50); // Ganha XP por achievement
    } catch (error) {
      console.error("Falha ao desbloquear achievement:", error);
    } finally {
      setLoading(false);
    }
  };

  const acquireBadge = async (badgeId: string) => {
    if (!user?.id || !user.profile) return;
     // Verifica se já adquiriu para evitar duplicidade
    if (user.badges.find(b => b.id === badgeId && b.acquiredAt)) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_badges')
        .insert({ user_id: user.id, badge_id: badgeId });
      if (error) throw error;

      // Recarregar perfil para obter o badge atualizado e outros dados
      await loadUserProfile(user);
      await earnXP(100); // Ganha XP por badge
    } catch (error) {
      console.error("Falha ao adquirir badge:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loginWithGoogle, // Exporta a nova função
        updateProfileData, // Exporta a função renomeada
        earnXP,
        unlockAchievement,
        acquireBadge,
        loading,
        loadingInitial,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};