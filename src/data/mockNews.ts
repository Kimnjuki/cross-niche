/**
 * Mock news data for NewsFeed fallback when Convex is disabled.
 * Mirrors the structure returned by api.articles.getLatestFeed.
 */

export interface MockNewsItem {
  _id: string;
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  published_at?: string | null;
  publishedAt?: number | null;
  featured_image_url?: string | null;
  source?: string | null;
  isAutomated?: boolean;
  originalUrl?: string | null;
  feed_name?: string;
}

export const MOCK_NEWS: MockNewsItem[] = [
  {
    _id: 'mock-news-1',
    id: 'steam-account-takeovers-surge',
    slug: 'steam-account-takeovers-surge',
    title: 'Steam Account Takeovers Up 340% — Complete Protection Guide for Gamers',
    excerpt: 'A massive wave of Steam account takeovers is targeting gamers through phishing links and social engineering. Here\'s how to lock down your account in 5 minutes.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 2,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Security Intelligence',
  },
  {
    _id: 'mock-news-2',
    id: 'discord-malware-spreading-fast',
    slug: 'discord-malware-spreading-fast',
    title: 'Discord Malware Is Spreading Fast — How Gamers Get Infected Through Voice Chat',
    excerpt: 'A new strain of info-stealer malware is spreading through Discord game servers. Over 50,000 accounts compromised this month alone.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 5,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Security Intelligence',
  },
  {
    _id: 'mock-news-3',
    id: 'windows-11-update-breaks-anti-cheat',
    slug: 'windows-11-update-breaks-anti-cheat',
    title: 'Windows 11 Update Breaks Popular Anti-Cheat Software — Fix Guide Inside',
    excerpt: 'The latest Windows 11 cumulative update is causing BSOD errors with kernel-level anti-cheat. Valorant and Fortnite players most affected.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 8,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Gaming',
  },
  {
    _id: 'mock-news-4',
    id: 'fake-game-cheats-stealing-accounts',
    slug: 'fake-game-cheats-stealing-accounts',
    title: 'Fake Game Cheats Are Stealing Thousands of Accounts Weekly',
    excerpt: 'Cybercriminals are distributing malware disguised as game cheats and mods. CS2, Valorant, and GTA V players are primary targets.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 12,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Security Intelligence',
  },
  {
    _id: 'mock-news-5',
    id: 'sim-swapping-targeting-gamers',
    slug: 'sim-swapping-targeting-gamers',
    title: 'SIM Swapping Attacks Are Targeting Gamers — Protect Your Accounts Now',
    excerpt: 'SIM swap attacks are rising as hackers target high-value gaming accounts with rare skins and items. Here\'s how to prevent it.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 18,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Security Intelligence',
  },
  {
    _id: 'mock-news-6',
    id: 'nioh-3-announced-sony-state-of-play',
    slug: 'nioh-3-announced-sony-state-of-play',
    title: 'Nioh 3 Announced at Sony State of Play: What to Expect',
    excerpt: 'Team Ninja reveals Nioh 3 with a cinematic trailer. Set in feudal Japan with expanded Yokai mechanics and a new online co-op mode.',
    published_at: new Date().toISOString(),
    publishedAt: Date.now() - 3600000 * 24,
    featured_image_url: null,
    source: 'The Grid Nexus',
    isAutomated: false,
    originalUrl: null,
    feed_name: 'Gaming',
  },
];

export default MOCK_NEWS;
