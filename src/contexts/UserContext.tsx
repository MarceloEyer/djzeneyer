// Caminho: src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // <<< VERIFIQUE ESTE CAMINHO!
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
  session: Session | null; // Exporta a sessão também, pode ser útil
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>; // <<< LINHA CORRIGIDA
  loginWithGoogle: () => Promise<void>;
  updateProfileData: (data: Partial<User['profile']>) => Promise<void>;
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
        if (newSession?.access_token === session?.access_token && newSession?.user?.id === session?.user?.id && newSession !== null) {
          if(!user && newSession?.user) await loadUserProfile(newSession.user);
          setLoadingInitial(false);
          return;
        }

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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, level, xp, rank')
        .eq('id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao buscar perfil:', profileError);
        setUser({
            ...authUser,
            profile: { 
              full_name: (authUser.email?.split('@')[0] ?? 'Zen Fan'), 
              avatar_url: null, 
              level: 1, 
              xp: 0,
              rank: 'Zen Newcomer' 
            },
            achievements: [],
            badges: [],
            isLoggedIn: true,
        } as User);
        return;
      }

      const { data: userAchievementsData, error: userAchievementsError } = await supabase
        .from('user_achievements')
        .select(`
          unlocked_at,
          all_achievements (id, name, description, icon)
        `)
        .eq('user_id', authUser.id);
      
      if (userAchievementsError) console.error('Erro ao buscar achievements do usuário:', userAchievementsError);
      
      const achievements: Achievement[] = userAchievementsData?.map((ua: any) => ({
        ...(ua.all_achievements as any),
        unlockedAt: new Date(ua.unlocked_at),
      })) || [];

      const { data: userBadgesData, error: userBadgesError } = await supabase
        .from('user_badges')
        .select(`
          acquired_at,
          all_badges (id, name, description, image, rarity)
        `)
        .eq('user_id', authUser.id);

      if (userBadgesError) console.error('Erro ao buscar badges do usuário:', userBadgesError);

      const badges: Badge[] = userBadgesData?.map((ub: any) => ({
        ...(ub.all_badges as any), 
        acquiredAt: new Date(ub.acquired_at),
      })) || [];
      
      const fullUser: User = {
        ...authUser,
        profile: {
          full_name: profileData?.full_name || (authUser.email?.split('@')[0] ?? 'Zen Fan'),
          avatar_url: profileData?.avatar_url || null,
          level: profileData?.level || 1,
          xp: profileData?.xp || 0, // <<< LINHA CORRIGIDA
          rank: profileData?.rank || 'Zen Newcomer',
          joinDate: new Date(authUser.created_at),
        },
        achievements,
        badges,
        isLoggedIn: true,
      };
      setUser(fullUser);

    } catch (e) {
      console.error("Erro carregando perfil completo:", e);
      setUser({
        ...authUser,
        profile: { 
          full_name: (authUser.email?.split('@')[0] ?? 'Zen Fan'), 
          avatar_url: null, 
          level: 1, 
          xp: 0, 
          rank: 'Zen Newcomer' 
        },
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
    } catch (error) {
      console.error('Login failed:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error logging out:", error)
    }
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
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
      console.error('Registration failed:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) {
            console.error('Google login failed before redirect:', error);
            setLoading(false); 
            throw error;
        }
    } catch (error) {
        console.error('Google login failed unexpectedly:', error);
        setLoading(false);
        throw error;
    }
  };

  const updateProfileData = async (data: Partial<User['profile']>) => {
    if (!user?.id) {
      console.error("Usuário não logado, impossível atualizar perfil.");
      return;
    }
    setLoading(true);
    try {
      const dataToUpdate = { ...data, updated_at: new Date().toISOString() };
      Object.keys(dataToUpdate).forEach(key => dataToUpdate[key] === undefined && delete dataToUpdate[key]);

      const { error } = await supabase
        .from('profiles')
        .update(dataToUpdate)
        .eq('id', user.id);
      if (error) throw error;
      
      setUser(prevUser => {
        if (!prevUser) return null;
        // Cria um novo objeto de perfil para garantir a imutabilidade
        const newProfile = { ...prevUser.profile, ...data } as User['profile'];
        return {
          ...prevUser,
          profile: newProfile,
        };
      });

    } catch (error) {
      console.error('Falha ao atualizar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const earnXP = async (amount: number) => {
    if (!user?.id || !user.profile) return;
    
    const currentXP = user.profile.xp || 0;
    const currentLevel = user.profile.level || 1;
    const newXP = currentXP + amount;
    
    // Lógica de Level Up (exemplo: a cada 100 XP)
    let newLevel = currentLevel;
    let xpForNextLevel = currentLevel * 100; // XP necessário para o próximo nível atual
    let tempNewXP = newXP;

    while (tempNewXP >= xpForNextLevel) {
      newLevel++;
      tempNewXP -= xpForNextLevel; // Subtrai o XP usado para upar
      xpForNextLevel = newLevel * 100; // Calcula o XP para o *próximo* novo nível
    }
    // O XP do usuário deve ser o total acumulado ou o restante após o level up,
    // dependendo de como você quer que o sistema funcione.
    // Se o XP reseta a cada nível: tempNewXP
    // Se o XP é cumulativo: newXP
    // Vamos manter cumulativo por enquanto para consistência com `updateProfileData`.

    let newRank = user.profile.rank;
    if (newLevel >= 10) newRank = 'Zen Master';
    else if (newLevel >= 5) newRank = 'Zen Adept';
    else if (newLevel >= 1) newRank = 'Zen Novice'; // Ou mantenha o rank anterior se o nível não mudar o suficiente

    setLoading(true);
    try {
      await updateProfileData({ xp: newXP, level: newLevel, rank: newRank, lastActive: new Date() });
    } catch (error) {
      console.error("Falha ao registrar XP:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockAchievement = async (achievementId: string) => {
    if (!user?.id || !user.profile) return;
    if (user.achievements.find(ach => ach.id === achievementId && ach.unlockedAt)) {
      console.log(`Achievement ${achievementId} já desbloqueado.`);
      return;
    }

    setLoading(true);
    try {
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({ user_id: user.id, achievement_id: achievementId, unlocked_at: new Date().toISOString() });
      
      if (insertError) throw insertError;
      
      // Atualiza localmente de forma otimista
      const { data: achievementDetails, error: fetchError } = await supabase.from('all_achievements').select('*').eq('id', achievementId).single();
      if (fetchError || !achievementDetails) {
          console.error("Falha ao buscar detalhes do achievement após desbloqueio:", fetchError);
          // Mesmo se falhar ao buscar detalhes, tenta dar XP
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
      console.error("Falha ao desbloquear achievement:", error);
    } finally {
      setLoading(false);
    }
  };

  const acquireBadge = async (badgeId: string) => {
    if (!user?.id || !user.profile) return;
    if (user.badges.find(b => b.id === badgeId && b.acquiredAt)) {
        console.log(`Badge ${badgeId} já adquirido.`);
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
          console.error("Falha ao buscar detalhes do badge após aquisição:", fetchError);
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
      console.error("Falha ao adquirir badge:", error);
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