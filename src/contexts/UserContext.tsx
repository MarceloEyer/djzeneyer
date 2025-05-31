// Caminho: src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // <<< VERIFIQUE ESTE CAMINHO!
import { Session, User as SupabaseAuthUser } from '@supabase/supabase-js';

// Tipos (mantidos como você definiu)
export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  acquiredAt: Date | null;
};

export type UserProfile = {
  full_name: string | null;
  avatar_url: string | null;
  level: number;
  xp: number;
  rank: string;
  joinDate?: Date;
  streakDays?: number;
  lastActive?: Date;
};

// Tipo User combinado
export type User = SupabaseAuthUser & {
  profile: UserProfile;
  achievements: Achievement[];
  badges: Badge[];
  isLoggedIn: boolean;
};

type UserContextType = {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfileData: (data: Partial<UserProfile>) => Promise<void>;
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

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      console.log('[UserContext] fetchSessionAndProfile: Iniciando...');
      setLoadingInitial(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);

      if (currentSession?.user) {
        console.log('[UserContext] fetchSessionAndProfile: Sessão encontrada, carregando perfil para:', currentSession.user.id);
        await loadUserProfile(currentSession.user);
      } else {
        console.log('[UserContext] fetchSessionAndProfile: Sem sessão, usuário definido como null.');
        setUser(null);
      }
      setLoadingInitial(false);
      console.log('[UserContext] fetchSessionAndProfile - ESTADO FINAL DO USER:', user, 'loadingInitial:', loadingInitial);
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log('[UserContext] onAuthStateChange disparado. Evento:', _event);
        
        if (newSession?.access_token === session?.access_token && newSession?.user?.id === session?.user?.id && newSession !== null) {
          if(!user && newSession?.user) { 
            console.log('[UserContext] onAuthStateChange: Sessão parece a mesma, mas user era null. Carregando perfil.');
            await loadUserProfile(newSession.user);
          }
          setLoadingInitial(false); 
          return;
        }

        setLoadingInitial(true);
        setSession(newSession);
        if (newSession?.user) {
          console.log('[UserContext] onAuthStateChange: Nova sessão/usuário, carregando perfil para:', newSession.user.id);
          await loadUserProfile(newSession.user);
        } else {
          console.log('[UserContext] onAuthStateChange: Usuário deslogado, definindo user para null.');
          setUser(null);
        }
        setLoadingInitial(false);
        console.log('[UserContext] onAuthStateChange - ESTADO FINAL DO USER:', user, 'loadingInitial:', loadingInitial); 
      }
    );

    return () => {
      console.log('[UserContext] Desinscrevendo authListener.');
      authListener?.subscription.unsubscribe();
    };
  }, []); // Array de dependências vazio para rodar apenas no mount e desmontar no unmount

  const loadUserProfile = async (authUser: SupabaseAuthUser) => {
    console.log('[UserContext] loadUserProfile: INICIADO para usuário ID:', authUser.id);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, level, xp, rank')
        .eq('id', authUser.id)
        .single();

      console.log('[UserContext] loadUserProfile - profileData:', profileData, 'profileError:', profileError);

      if (profileError && profileError.code !== 'PGRST116') { 
        console.error('[UserContext] loadUserProfile: Erro ao buscar perfil:', profileError);
        const defaultProfile: UserProfile = {
          full_name: authUser.email?.split('@')[0] || 'Zen Fan',
          avatar_url: null,
          level: 1,
          xp: 0,
          rank: 'Zen Newcomer',
          joinDate: new Date(authUser.created_at),
        };
        setUser({ ...authUser, profile: defaultProfile, achievements: [], badges: [], isLoggedIn: true });
        return;
      }

      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('unlocked_at, all_achievements (id, name, description, icon)')
        .eq('user_id', authUser.id);
      
      const achievements: Achievement[] = userAchievementsData?.map((ua: any) => ({
        ...(ua.all_achievements as any),
        unlockedAt: new Date(ua.unlocked_at),
      })) || [];

      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select('acquired_at, all_badges (id, name, description, image, rarity)')
        .eq('user_id', authUser.id);

      const badges: Badge[] = userBadgesData?.map((ub: any) => ({
        ...(ub.all_badges as any), 
        acquiredAt: new Date(ub.acquired_at),
      })) || [];
      
      const userProfile: UserProfile = {
        full_name: profileData?.full_name || authUser.email?.split('@')[0] || 'Zen Fan',
        avatar_url: profileData?.avatar_url || null,
        level: profileData?.level || 1,
        xp: profileData?.xp || 0,
        rank: profileData?.rank || 'Zen Newcomer',
        joinDate: new Date(authUser.created_at),
      };
      
      const fullUser = { ...authUser, profile: userProfile, achievements, badges, isLoggedIn: true };
      console.log('[UserContext] loadUserProfile - fullUser a ser definido:', fullUser);
      setUser(fullUser);

    } catch (e) {
      console.error("[UserContext] loadUserProfile: ERRO INESPERADO carregando perfil completo:", e);
      const fallbackProfile: UserProfile = {
        full_name: authUser.email?.split('@')[0] || 'Zen Fan',
        avatar_url: null,
        level: 1,
        xp: 0,
        rank: 'Zen Newcomer',
        joinDate: new Date(authUser.created_at),
      };
      setUser({ ...authUser, profile: fallbackProfile, achievements: [], badges: [], isLoggedIn: true });
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    console.log('[UserContext] login: Tentando login para:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('[UserContext] login: Falha no login:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    console.log('[UserContext] logout: Deslogando usuário.');
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("[UserContext] logout: Erro ao deslogar:", error);
    }
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    console.log('[UserContext] register: Tentando registrar:', email);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name }, 
        },
      });
      if (error) throw error;
      alert('Registro realizado! Verifique seu e-mail para confirmação (se a opção estiver habilitada no Supabase).');
    } catch (error) {
      console.error('[UserContext] register: Falha no registro:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setLoading(true);
    console.log('[UserContext] loginWithGoogle: Iniciando login com Google.');
    try {
        const { error } = await supabase.auth.signInWithOAuth({ 
            provider: 'google',
            // options: { // Adicione redirectTo se quiser um redirect específico após o Supabase processar
            //   redirectTo: window.location.origin, // Exemplo: volta para a raiz do app
            // }
        });
        if (error) {
            console.error('[UserContext] loginWithGoogle: Falha no login com Google antes do redirect:', error);
            setLoading(false); 
            throw error;
        }
    } catch (error) {
        console.error('[UserContext] loginWithGoogle: Falha inesperada no login com Google:', error);
        setLoading(false);
        throw error;
    }
  };

  const updateProfileData = async (data: Partial<UserProfile>) => {
    if (!user?.id) {
      console.error("[UserContext] updateProfileData: Usuário não logado.");
      return;
    }
    setLoading(true);
    try {
      const dataToUpdate = { ...data, updated_at: new Date().toISOString() };
      Object.keys(dataToUpdate).forEach(key => (dataToUpdate as any)[key] === undefined && delete (dataToUpdate as any)[key]);

      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);
      if (error) throw error;
      
      setUser(prevUser => {
        if (!prevUser) return null;
        const newProfile = { ...prevUser.profile, ...data } as UserProfile;
        return {
          ...prevUser,
          profile: newProfile,
        };
      });
    } catch (error) {
      console.error('[UserContext] updateProfileData: Falha ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnXP = async (amount: number) => {
    if (!user?.id || !user.profile) return;
    
    const currentXP = user.profile.xp || 0;
    const currentLevel = user.profile.level || 1;
    const newXP = currentXP + amount;
    
    let newLevel = currentLevel;
    let xpForNextLevel = currentLevel * 100;
    let tempUserXP = newXP;

    while (tempUserXP >= xpForNextLevel && newLevel < 100) {
      newLevel++;
      tempUserXP -= xpForNextLevel; 
      xpForNextLevel = newLevel * 100;
    }

    let newRank = user.profile.rank;
    if (newLevel >= 10) newRank = 'Zen Master';
    else if (newLevel >= 5) newRank = 'Zen Adept';
    else if (newLevel >= 1) newRank = 'Zen Novice';

    setLoading(true);
    try {
      await updateProfileData({ xp: newXP, level: newLevel, rank: newRank, lastActive: new Date() });
    } catch (error) {
      console.error("[UserContext] earnXP: Falha ao registrar XP:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user?.id || !user.profile) return;
    if (user.achievements.find(ach => ach.id === achievementId && ach.unlockedAt)) {
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievementId, unlocked_at: new Date().toISOString() });
      
      if (insertError) throw insertError;
      
      const { data: achievementDetails, error: fetchError } = await supabase.from('all_achievements').select('*').eq('id', achievementId).single();
      if (fetchError || !achievementDetails) {
          console.error("[UserContext] unlockAchievement: Falha ao buscar detalhes do achievement:", fetchError);
          await earnXP(50); 
          return;
      }

      const newAchievement: Achievement = {
        id: achievementDetails.id,
        name: achievementDetails.name,
        description: achievementDetails.description,
        icon: achievementDetails.icon,
        unlockedAt: new Date()
      };
      setUser(prevUser => prevUser ? ({
        ...prevUser,
        achievements: [...prevUser.achievements, newAchievement],
      }) : null);
      
      await earnXP(50); 
    } catch (error) {
      console.error("[UserContext] unlockAchievement: Falha ao desbloquear achievement:", error);
    } finally {
      setLoading(false);
    }
  };

  const acquireBadge = async (badgeId: string) => {
    if (!user?.id || !user.profile) return;
    if (user.badges.find(b => b.id === badgeId && b.acquiredAt)) {
        return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('user_badges')
        .insert({ user_id: user.id, badge_id: badgeId, acquired_at: new Date().toISOString() });
      if (insertError) throw insertError;

      const { data: badgeDetails, error: fetchError } = await supabase.from('all_badges').select('*').eq('id', badgeId).single();
      if (fetchError || !badgeDetails) {
          console.error("[UserContext] acquireBadge: Falha ao buscar detalhes do badge:", fetchError);
          await earnXP(100);
          return;
      }
      const newBadge: Badge = {
        id: badgeDetails.id,
        name: badgeDetails.name,
        description: badgeDetails.description,
        image: badgeDetails.image,
        rarity: badgeDetails.rarity as Badge['rarity'],
        acquiredAt: new Date()
      };
      setUser(prevUser => prevUser ? ({
        ...prevUser,
        badges: [...prevUser.badges, newBadge],
      }) : null);
      await earnXP(100);
    } catch (error) {
      console.error("[UserContext] acquireBadge: Falha ao adquirir badge:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    login,
    logout,
    register,
    loginWithGoogle,
    updateProfileData,
    earnXP,
    unlockAchievement,
    acquireBadge,
    loading,
    loadingInitial,
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