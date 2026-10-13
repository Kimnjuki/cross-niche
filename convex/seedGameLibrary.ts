/**
 * Seed the gameLibrary with a starter set of real, well-known games/platforms.
 *
 * WHY: the "Nexus Grade" framework (gameLibrary + securityRatings +
 * gameSecurityAdvisories) was built but never populated — gameLibrary is empty.
 * This seeds the core catalogue so the per-game security-grade pages have real
 * data to serve.
 *
 * HONESTY: securityGrade + securityNotes are based on DOCUMENTED, public facts
 * (whether the platform ships TOTP 2FA, passkeys, and known account-takeover /
 * breach history). They are INITIAL assessments, not lab tests — each note
 * states the basis. Sentiment fields (sentimentScores, securityMentionRate,
 * themes, complaints) are left at neutral/empty defaults because no sentiment
 * data has been collected yet; they are explicitly NOT invented.
 *
 * Idempotent: upsert by slug.
 *
 * Run:
 *   npx convex run seedGameLibrary:seed --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

type Game = {
  slug: string;
  name: string;
  aliases: string[];
  genres: string[];
  platforms: string[];
  releaseYear?: number;
  developer?: string;
  publisher?: string;
  minHardwareTier: 'low' | 'mid' | 'high' | 'ultra';
  approximateCostUSD: number;
  securityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  securityNotes: string;
  budgetTier: 'free' | 'budget' | 'mid' | 'high' | 'ultra';
  recommendedForGoals: Array<'gaming_pc' | 'find_game' | 'both'>;
  stylesMatch: string[];
};

const NEUTRAL_SENTIMENT = {
  gameplay: 0.5,
  balance: 0.5,
  security: 0.5,
  performance: 0.5,
  community: 0.5,
};

const GAMES: Game[] = [
  {
    slug: 'steam',
    name: 'Steam',
    aliases: ['Steam Client', 'Steam Platform'],
    genres: ['storefront'],
    platforms: ['PC'],
    releaseYear: 2003,
    developer: 'Valve',
    publisher: 'Valve',
    minHardwareTier: 'low',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes:
      'Steam Guard mobile authenticator (TOTP) plus hardware security-key support. One of the strongest account protections in gaming.',
    budgetTier: 'free',
    recommendedForGoals: ['gaming_pc', 'both'],
    stylesMatch: ['pc', 'storefront'],
  },
  {
    slug: 'discord',
    name: 'Discord',
    aliases: ['Discord App'],
    genres: ['communication'],
    platforms: ['PC', 'Mobile'],
    releaseYear: 2015,
    developer: 'Discord Inc.',
    publisher: 'Discord Inc.',
    minHardwareTier: 'low',
    approximateCostUSD: 0,
    securityGrade: 'B',
    securityNotes:
      'Supports TOTP 2FA and hardware keys, but account-token-stealing malware and phishing are rampant on the platform. Enable 2FA and never run unverified scripts.',
    budgetTier: 'free',
    recommendedForGoals: ['both'],
    stylesMatch: ['communication', 'voice'],
  },
  {
    slug: 'fortnite',
    name: 'Fortnite',
    aliases: ['Fortnite Battle Royale'],
    genres: ['battle-royale', 'shooter'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile'],
    releaseYear: 2017,
    developer: 'Epic Games',
    publisher: 'Epic Games',
    minHardwareTier: 'mid',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes:
      'Epic account supports TOTP 2FA and email/app verification. Strong anti-cheat and active account-recovery support.',
    budgetTier: 'free',
    recommendedForGoals: ['both'],
    stylesMatch: ['shooter', 'battle-royale'],
  },
  {
    slug: 'minecraft',
    name: 'Minecraft',
    aliases: ['Minecraft Java', 'Minecraft Bedrock'],
    genres: ['sandbox', 'survival'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch', 'Mobile'],
    releaseYear: 2011,
    developer: 'Mojang Studios',
    publisher: 'Microsoft',
    minHardwareTier: 'low',
    approximateCostUSD: 30,
    securityGrade: 'B',
    securityNotes:
      'Migrated to Microsoft accounts with 2FA. Younger player base is a heavy phishing target; account-migration confusion is a common entry point for attackers.',
    budgetTier: 'budget',
    recommendedForGoals: ['both'],
    stylesMatch: ['sandbox', 'creative'],
  },
  {
    slug: 'roblox',
    name: 'Roblox',
    aliases: ['Roblox Platform'],
    genres: ['sandbox', 'social'],
    platforms: ['PC', 'Xbox', 'Mobile'],
    releaseYear: 2006,
    developer: 'Roblox Corporation',
    publisher: 'Roblox Corporation',
    minHardwareTier: 'low',
    approximateCostUSD: 0,
    securityGrade: 'B',
    securityNotes:
      'Supports TOTP 2FA and account PINs. Very young audience is heavily targeted by fake "free Robux" scams and cookie-theft phishing.',
    budgetTier: 'free',
    recommendedForGoals: ['find_game'],
    stylesMatch: ['sandbox', 'social'],
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    aliases: ['VALORANT'],
    genres: ['tactical-shooter'],
    platforms: ['PC'],
    releaseYear: 2020,
    developer: 'Riot Games',
    publisher: 'Riot Games',
    minHardwareTier: 'mid',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes:
      'Riot account supports TOTP 2FA; Vanguard anti-cheat and active account-recovery. High-value accounts are frequent targets, so 2FA is essential.',
    budgetTier: 'free',
    recommendedForGoals: ['gaming_pc', 'both'],
    stylesMatch: ['shooter', 'competitive'],
  },
  {
    slug: 'league-of-legends',
    name: 'League of Legends',
    aliases: ['LoL'],
    genres: ['moba'],
    platforms: ['PC'],
    releaseYear: 2009,
    developer: 'Riot Games',
    publisher: 'Riot Games',
    minHardwareTier: 'low',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes: 'Riot account supports TOTP 2FA and active account-recovery.',
    budgetTier: 'free',
    recommendedForGoals: ['gaming_pc', 'both'],
    stylesMatch: ['moba', 'competitive'],
  },
  {
    slug: 'counter-strike-2',
    name: 'Counter-Strike 2',
    aliases: ['CS2', 'Counter-Strike'],
    genres: ['tactical-shooter'],
    platforms: ['PC'],
    releaseYear: 2023,
    developer: 'Valve',
    publisher: 'Valve',
    minHardwareTier: 'mid',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes:
      'Runs on Steam, inheriting Steam Guard TOTP 2FA and hardware-key support. High-value inventory makes accounts prime targets.',
    budgetTier: 'free',
    recommendedForGoals: ['gaming_pc', 'both'],
    stylesMatch: ['shooter', 'competitive'],
  },
  {
    slug: 'genshin-impact',
    name: 'Genshin Impact',
    aliases: ['Genshin'],
    genres: ['rpg', 'gacha'],
    platforms: ['PC', 'PlayStation', 'Mobile'],
    releaseYear: 2020,
    developer: 'HoYoverse',
    publisher: 'HoYoverse',
    minHardwareTier: 'mid',
    approximateCostUSD: 0,
    securityGrade: 'B',
    securityNotes:
      'HoYoverse account supports 2FA and email verification, but spending-linked accounts are heavily phished.',
    budgetTier: 'free',
    recommendedForGoals: ['find_game'],
    stylesMatch: ['rpg', 'open-world'],
  },
  {
    slug: 'call-of-duty',
    name: 'Call of Duty',
    aliases: ['CoD', 'Warzone', 'Modern Warfare'],
    genres: ['shooter'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseYear: 2003,
    developer: 'Activision',
    publisher: 'Activision',
    minHardwareTier: 'mid',
    approximateCostUSD: 70,
    securityGrade: 'C',
    securityNotes:
      'Activision accounts support 2FA but have seen documented account-takeover waves and account-unlink attacks. Review linked accounts regularly.',
    budgetTier: 'high',
    recommendedForGoals: ['both'],
    stylesMatch: ['shooter'],
  },
  {
    slug: 'gta-online',
    name: 'GTA Online',
    aliases: ['Grand Theft Auto Online', 'GTA V'],
    genres: ['open-world', 'action'],
    platforms: ['PC', 'PlayStation', 'Xbox'],
    releaseYear: 2013,
    developer: 'Rockstar Games',
    publisher: 'Rockstar Games',
    minHardwareTier: 'mid',
    approximateCostUSD: 30,
    securityGrade: 'C',
    securityNotes:
      'Rockstar Social Club supports 2FA but account takeovers and modding-based theft are common, especially on PC. Use 2FA and a unique password.',
    budgetTier: 'budget',
    recommendedForGoals: ['both'],
    stylesMatch: ['open-world', 'action'],
  },
  {
    slug: 'apex-legends',
    name: 'Apex Legends',
    aliases: ['Apex'],
    genres: ['battle-royale', 'shooter'],
    platforms: ['PC', 'PlayStation', 'Xbox', 'Switch'],
    releaseYear: 2019,
    developer: 'Respawn Entertainment',
    publisher: 'Electronic Arts',
    minHardwareTier: 'mid',
    approximateCostUSD: 0,
    securityGrade: 'B',
    securityNotes: 'EA account supports 2FA; account-recovery can be slow, so protect the email account behind it.',
    budgetTier: 'free',
    recommendedForGoals: ['both'],
    stylesMatch: ['shooter', 'battle-royale'],
  },
  {
    slug: 'nintendo-switch-online',
    name: 'Nintendo Switch Online',
    aliases: ['Nintendo Account', 'Switch Online'],
    genres: ['platform'],
    platforms: ['Switch'],
    releaseYear: 2018,
    developer: 'Nintendo',
    publisher: 'Nintendo',
    minHardwareTier: 'low',
    approximateCostUSD: 20,
    securityGrade: 'B',
    securityNotes:
      'Nintendo accounts support 2FA and passkeys, but have a documented credential-stuffing history (2020 NNID breach). Enable 2FA and unique credentials.',
    budgetTier: 'budget',
    recommendedForGoals: ['both'],
    stylesMatch: ['console'],
  },
  {
    slug: 'playstation-network',
    name: 'PlayStation Network',
    aliases: ['PSN', 'PlayStation'],
    genres: ['platform'],
    platforms: ['PlayStation'],
    releaseYear: 2006,
    developer: 'Sony Interactive Entertainment',
    publisher: 'Sony',
    minHardwareTier: 'low',
    approximateCostUSD: 0,
    securityGrade: 'A',
    securityNotes:
      'PSN supports 2FA and passkeys. The 2011 breach is historical; current account protection is strong with 2FA enabled.',
    budgetTier: 'free',
    recommendedForGoals: ['both'],
    stylesMatch: ['console'],
  },
];

export const seed = mutation({
  args: { trigger: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    if (args.trigger === false) return { skipped: true };

    const results: Array<{ slug: string; status: string }> = [];
    for (const g of GAMES) {
      const existing = await ctx.db
        .query('gameLibrary')
        .withIndex('by_slug', (q) => q.eq('slug', g.slug))
        .first();

      const data = {
        ...g,
        sentimentScores: NEUTRAL_SENTIMENT,
        sentimentTrendDirection: 'stable' as const,
        securityMentionRate: 0,
        positiveThemes: [] as string[],
        negativeThemes: [] as string[],
        recentSecurityComplaints: [] as Array<{ id: string; summary: string; date: string }>,
        isSupported: true,
        updatedAt: Date.now(),
      };

      if (existing) {
        await ctx.db.replace(existing._id, data);
        results.push({ slug: g.slug, status: 'replaced' });
      } else {
        await ctx.db.insert('gameLibrary', data);
        results.push({ slug: g.slug, status: 'inserted' });
      }
    }

    return { count: results.length, results };
  },
});
