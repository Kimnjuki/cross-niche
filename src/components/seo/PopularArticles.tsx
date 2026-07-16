/**
 * PopularArticles - Contextual sidebar component showing top-performing articles
 * Based on actual GSC performance data for thegridnexus.com
 * Improves internal linking by creating contextual article-to-article links
 */
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Gamepad2, Cpu } from 'lucide-react';

interface PopularArticle {
  title: string;
  slug: string;
  impressions: number;
  niche: 'security' | 'gaming' | 'tech';
}

// Top articles by impressions from GSC data (Apr-Jul 2026)
const TOP_ARTICLES: PopularArticle[] = [
  { title: 'Steam Account Takeover Protection Guide 2026', slug: '/article/steam-account-takeover-protection-guide-2026', impressions: 292, niche: 'security' },
  { title: '2FA Setup for Every Gaming Platform', slug: '/article/2fa-setup-every-gaming-platform', impressions: 149, niche: 'security' },
  { title: 'Game Key Reseller Scams: G2A, CDKeys Exposed', slug: '/article/game-key-reseller-scams-g2a-cdkeys', impressions: 105, niche: 'security' },
  { title: 'Minecraft Server Security Guide', slug: '/article/minecraft-server-security-guide', impressions: 64, niche: 'security' },
  { title: 'Gaming PC Security Hardening Guide', slug: '/article/gaming-pc-security-hardening-guide', impressions: 58, niche: 'security' },
  { title: 'Fake Game Cheats: Malware & Account Stealer', slug: '/article/fake-game-cheats-malware-account-stealer', impressions: 39, niche: 'security' },
  { title: 'Best Antivirus for Gaming PC 2026', slug: '/article/gaming-pc-antivirus-best-2026', impressions: 38, niche: 'security' },
  { title: 'What Gamers Think About Security 2026', slug: '/article/what-gamers-think-about-security-sentiment-analysis-2026', impressions: 34, niche: 'security' },
  { title: 'NVIDIA RTX 5090 Benchmarks Leak', slug: '/article/nvidia-rtx-5090-benchmarks-leak-2x-performance', impressions: 1, niche: 'tech' },
  { title: 'Nintendo Switch 2 Security Guide', slug: '/article/nintendo-switch-2-security-guide', impressions: 16, niche: 'gaming' },
  { title: 'Roblox Parents Guide: Account Security', slug: '/article/roblox-parents-guide-account-security-safety', impressions: 13, niche: 'gaming' },
];

const NicheIcon = ({ niche }: { niche: string }) => {
  switch (niche) {
    case 'security': return <Shield className="h-3.5 w-3.5 text-security" />;
    case 'gaming': return <Gamepad2 className="h-3.5 w-3.5 text-gaming" />;
    case 'tech': return <Cpu className="h-3.5 w-3.5 text-tech" />;
    default: return null;
  }
};

interface PopularArticlesProps {
  title?: string;
  limit?: number;
  className?: string;
  currentSlug?: string; // Exclude current article
}

export function PopularArticles({ 
  title = 'Popular on The Grid Nexus', 
  limit = 5, 
  className = '',
  currentSlug 
}: PopularArticlesProps) {
  const articles = TOP_ARTICLES
    .filter(a => currentSlug ? a.slug !== `/article/${currentSlug}` && a.slug !== currentSlug : true)
    .slice(0, limit);

  if (articles.length === 0) return null;

  return (
    <section className={className} aria-label="Popular articles">
      <h2 className="font-display font-bold text-lg mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-primary" />
        {title}
      </h2>
      <div className="space-y-2">
        {articles.map((article, index) => (
          <Link
            key={article.slug}
            to={article.slug}
            className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-accent/50 transition-colors group"
          >
            <span className="text-sm font-bold text-muted-foreground w-6 shrink-0 mt-0.5 group-hover:text-primary transition-colors">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <NicheIcon niche={article.niche} />
                <span>{article.impressions.toLocaleString()} impressions</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Link
        to="/topics"
        className="text-sm text-primary hover:underline font-medium mt-3 inline-block"
      >
        View all popular topics →
      </Link>
    </section>
  );
}

/**
 * HotTopicsWidget - Quick topic links for homepage sidebar
 * Based on high-value queries from GSC
 */
export function HotTopicsWidget({ className = '' }: { className?: string }) {
  const topics = [
    { label: 'Steam Account Security', href: '/article/steam-account-takeover-protection-guide-2026' },
    { label: '2FA Setup Guide', href: '/article/2fa-setup-every-gaming-platform' },
    { label: 'G2A Scams Explained', href: '/article/game-key-reseller-scams-g2a-cdkeys' },
    { label: 'Minecraft Server Security', href: '/article/minecraft-server-security-guide' },
    { label: 'Gaming PC Hardening', href: '/article/gaming-pc-security-hardening-guide' },
    { label: 'Best Antivirus for Gaming', href: '/article/gaming-pc-antivirus-best-2026' },
    { label: 'Razer Synapse Fix', href: '/article/razer-synapse-security-vulnerability-fix' },
    { label: 'Twitch Streamer Safety', href: '/article/twitch-streamer-security-guide-doxxing-swatting' },
    { label: 'Discord Malware Guide', href: '/article/discord-malware-gamers-how-to-stay-safe' },
    { label: 'Nintendo Switch 2 Security', href: '/article/nintendo-switch-2-security-guide' },
  ];

  return (
    <section className={className} aria-label="Hot Topics">
      <h2 className="font-display font-bold text-lg mb-3">🔥 Hot Topics</h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Link
            key={topic.href}
            to={topic.href}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-card hover:bg-accent hover:border-primary/50 transition-colors"
          >
            {topic.label}
          </Link>
        ))}
      </div>
    </section>
  );
}