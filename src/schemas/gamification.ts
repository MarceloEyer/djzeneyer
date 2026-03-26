import { z } from 'zod';

export const ZenGamePointSchema = z.object({
  name: z.string(),
  amount: z.number(),
  image: z.string(),
}).catchall(z.unknown());

export const ZenGameRankRequirementSchema = z.object({
  title: z.string(),
  current: z.number(),
  required: z.number(),
  percent: z.number(),
}).catchall(z.unknown());

export const ZenGameRankSchema = z.object({
  current: z.object({
    id: z.number(),
    title: z.string(),
    image: z.string(),
  }).catchall(z.unknown()),
  progress: z.number(),
  requirements: z.array(ZenGameRankRequirementSchema),
  next: z.object({
    id: z.number(),
    title: z.string(),
    image: z.string(),
  }).catchall(z.unknown()).nullable(),
}).catchall(z.unknown());

export const ZenGameAchievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  earned: z.boolean(),
  points_awarded: z.number(),
  date_earned: z.string(),
}).catchall(z.unknown());

export const ZenGameLogSchema = z.object({
  id: z.number(),
  type: z.string(),
  description: z.string(),
  date: z.string(),
  points: z.number(),
}).catchall(z.unknown());

export const ZenGameStatsSchema = z.object({
  totalTracks: z.number(),
  eventsAttended: z.number(),
  streak: z.number(),
  streakFire: z.boolean(),
}).catchall(z.unknown());

export const ZenGameUserDataSchema = z.object({
  user_id: z.number(),
  points: z.record(z.string(), ZenGamePointSchema),
  rank: ZenGameRankSchema,
  achievements_earned: z.array(ZenGameAchievementSchema),
  achievements_locked: z.array(ZenGameAchievementSchema),
  recent_achievements: z.array(ZenGameAchievementSchema),
  achievement_highlights: z.array(ZenGameAchievementSchema).optional(),
  logs: z.array(ZenGameLogSchema),
  stats: ZenGameStatsSchema,
  main_points_slug: z.string(),
  lastUpdate: z.string(),
  version: z.string(),
}).catchall(z.unknown());

export const ZenGameLeaderboardEntrySchema = z.object({
  user_id: z.number(),
  display_name: z.string(),
  points: z.number(),
  avatar: z.string(),
}).catchall(z.unknown());

export const ZenGameLeaderboardSchema = z.record(z.string(), z.array(ZenGameLeaderboardEntrySchema));
