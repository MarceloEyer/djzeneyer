// src/hooks/index.ts

// Hooks existentes
export { useGamiPress } from './useGamiPress';
export { useUserTracks } from './useUserTracks';
export { useUserEvents } from './useUserEvents';
export { useUserStreak } from './useUserStreak';
export { useRecentActivity } from './useRecentActivity';

// Novos hooks
export { useUserFriends } from './useUserFriends';
export { useUserBadges } from './useUserBadges';

// Types existentes
export type { GamiPressData, Achievement } from './useGamiPress';
export type { UserTracksData, Track } from './useUserTracks';
export type { UserEventsData, Event } from './useUserEvents';
export type { UserStreakData } from './useUserStreak';
export type { RecentActivityData, Activity } from './useRecentActivity';

// Novos types
export type { UserFriendsData, Friend } from './useUserFriends';
export type { UserBadgesData, Badge } from './useUserBadges';
