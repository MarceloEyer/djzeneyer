import React, { createContext, useState, useContext, ReactNode } from 'react';

// Types
type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
};

type Badge = {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  acquiredAt: Date | null;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  rank: string;
  joinDate: Date;
  streakDays: number;
  lastActive: Date;
  achievements: Achievement[];
  badges: Badge[];
  isLoggedIn: boolean;
};

type UserContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  earnXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  acquireBadge: (badgeId: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample achievements
const sampleAchievements: Achievement[] = [
  {
    id: 'first-login',
    name: 'First Beat',
    description: 'Welcome to the Zen Tribe',
    icon: '🎧',
    unlockedAt: new Date(),
  },
  {
    id: 'listen-10-tracks',
    name: 'Rhythm Explorer',
    description: 'Listen to 10 different tracks',
    icon: '🔍',
    unlockedAt: null,
  },
  {
    id: 'share-track',
    name: 'Sound Sharer',
    description: 'Share your first track on social media',
    icon: '📢',
    unlockedAt: null,
  },
];

// Sample badges
const sampleBadges: Badge[] = [
  {
    id: 'zen-novice',
    name: 'Zen Novice',
    description: 'You\'ve taken your first steps into the Zen Tribe',
    image: '🥉',
    rarity: 'common',
    acquiredAt: new Date(),
  },
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'You joined during the launch phase',
    image: '🚀',
    rarity: 'rare',
    acquiredAt: new Date(),
  },
  {
    id: 'festival-vip',
    name: 'Festival VIP',
    description: 'Attended a DJ Zen Eyer festival',
    image: '🎪',
    rarity: 'epic',
    acquiredAt: null,
  },
];

// Sample user
const sampleUser: User = {
  id: '1',
  name: 'Zen Fan',
  email: 'fan@example.com',
  avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
  level: 3,
  xp: 350,
  rank: 'Zen Apprentice',
  joinDate: new Date(),
  streakDays: 5,
  lastActive: new Date(),
  achievements: sampleAchievements,
  badges: sampleBadges,
  isLoggedIn: true,
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(sampleUser); // For demo purposes, initialize with sample user

  const login = async (email: string, password: string) => {
    // Mock login - in a real application, this would validate credentials against a backend
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(sampleUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        ...sampleUser,
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        level: 1,
        xp: 0,
        rank: 'Zen Newcomer',
        joinDate: new Date(),
        streakDays: 0,
        lastActive: new Date(),
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Registration failed. Please try again.');
    }
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  const earnXP = (amount: number) => {
    if (!user) return;
    
    const newXP = user.xp + amount;
    let newLevel = user.level;
    
    // Simple leveling system: 100 XP per level
    if (newXP >= (user.level * 100)) {
      newLevel++;
    }
    
    setUser({
      ...user,
      xp: newXP,
      level: newLevel,
      lastActive: new Date(),
    });
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user) return;
    
    const updatedAchievements = user.achievements.map(achievement => 
      achievement.id === achievementId && !achievement.unlockedAt
        ? { ...achievement, unlockedAt: new Date() }
        : achievement
    );
    
    setUser({
      ...user,
      achievements: updatedAchievements,
    });
    
    // Reward XP for unlocking an achievement
    earnXP(50);
  };

  const acquireBadge = (badgeId: string) => {
    if (!user) return;
    
    const updatedBadges = user.badges.map(badge => 
      badge.id === badgeId && !badge.acquiredAt
        ? { ...badge, acquiredAt: new Date() }
        : badge
    );
    
    setUser({
      ...user,
      badges: updatedBadges,
    });
    
    // Reward XP for acquiring a badge
    earnXP(100);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateProfile,
        earnXP,
        unlockAchievement,
        acquireBadge,
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