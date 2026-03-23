// src/types/gamification.ts

/**
 * ZenGame v1.1.0 Type Definitions
 * Aligned with zengame.php REST API
 */

export interface ZenGamePoint {
    name: string;
    amount: number;
    image: string;
}

export interface ZenGameRankRequirement {
    title: string;
    current: number;
    required: number;
    percent: number;
}

export interface ZenGameRank {
    current: {
        id: number;
        title: string;
        image: string;
    };
    progress: number;
    requirements: ZenGameRankRequirement[];
    next: {
        id: number;
        title: string;
        image: string;
    } | null;
}

export interface ZenGameAchievement {
    id: number;
    title: string;
    description: string;
    image: string;
    earned: boolean;
    points_awarded: number;
    date_earned: string;
}

export interface ZenGameLog {
    id: number;
    type: string;
    description: string;
    date: string;
    points: number;
}

export interface ZenGameStats {
    totalTracks: number;
    eventsAttended: number;
    streak: number;
    streakFire: boolean;
}

export interface ZenGameUserData {
    user_id: number;
    points: Record<string, ZenGamePoint>;
    rank: ZenGameRank;
    achievements_earned: ZenGameAchievement[];
    achievements_locked: ZenGameAchievement[];
    recent_achievements: ZenGameAchievement[];
    achievement_highlights?: ZenGameAchievement[];

    logs: ZenGameLog[];
    stats: ZenGameStats;
    main_points_slug: string;
    lastUpdate: string;
    version: string;
}

export interface ZenGameLeaderboardEntry {
    user_id: number;
    display_name: string;
    points: number;
    avatar: string;
}

export interface ZenGameLeaderboard {
    [pointType: string]: ZenGameLeaderboardEntry[];
}

