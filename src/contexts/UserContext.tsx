// Caminho: src/contexts/UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // <<< CAMINHO CORRIGIDO!
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
        // Evitar loop se a sessão não mudou de verdade ou durante o logout
        if (newSession?.access_token === session?.access_token && newSession?.user?.id === session?.user?.id && newSession !== null) {
          if(!user && newSession?.user) await loadUserProfile(newSession.user); // Carrega perfil se user está null mas sessão existe
          setLoadingInitial(false);
          return;
        }

        setLoadingInitial(true); // Indica que estamos processando uma mudança de sessão
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
  }, []); // Removido 'session' e 'user' das dependências para evitar loops desnecessários com onAuthStateChange

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
            profile: { full_name: (authUser.email?.split('@')[0] ?? 'Zen Fan'), avatar_url: null, level: 1, xp: 0, rank: 'Zen Newcomer' },
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
          xp: profile