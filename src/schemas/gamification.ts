import { z } from 'zod';

// Helper: campos de imagem/URL — PHP pode retornar false, null ou undefined
// z.string().catch('') é o padrão Zod v4 mais robusto para esse caso
const phpImageField = z.string().catch('');

export const ZenGamePointSchema = z.object({
  name: z.string(),
  amount: z.number(),
  image: phpImageField,
}).catchall(z.unknown());

export const ZenGameRankRequirementSchema = z.object({
  title: z.string(),
  current: z.number(),
  required: z.number(),
  percent: z.number(),
}).catchall(z.unknown());

const ZenGameRankItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: phpImageField,
}).catchall(z.unknown());

export const ZenGameRankSchema = z.object({
  current: ZenGameRankItemSchema,
  progress: z.number(),
  requirements: z.array(ZenGameRankRequirementSchema),
  next: ZenGameRankItemSchema.nullable(),
}).catchall(z.unknown());

export const ZenGameAchievementSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  image: phpImageField,
  earned: z.boolean(),
  points_awarded: z.number(),
  // Conquistas não desbloqueadas têm date_earned vazio/null/undefined
  date_earned: z.string().catch(''),
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
  main_points_slug: z.string().catch('points'),
  lastUpdate: z.string().catch(''),
  version: z.string().catch(''),
}).catchall(z.unknown());

export const ZenGameLeaderboardEntrySchema = z.object({
  user_id: z.number(),
  display_name: z.string(),
  points: z.number(),
  // PHP get_avatar_url() pode retornar false quando não há avatar
  avatar: phpImageField,
}).catchall(z.unknown());

export const ZenGameLeaderboardSchema = z.record(z.string(), z.array(ZenGameLeaderboardEntrySchema));
