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
  register: (name: string, email: string, password: string