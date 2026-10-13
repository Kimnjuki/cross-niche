/**
 * Enrich threatIntel rows with gamer-relevance fields.
 *
 * The ingest (KEV/NVD) populates threatIntel with raw CVE data but leaves
 * affectsGamers / gamerImpactScore / gamingPlatforms unset — those are the
 * "does this affect players?" moat fields. This mutation computes them via a
 * conservative keyword heuristic over the title + description:
 *
 *   - Detect which gaming platforms a threat touches (Windows/Chrome/GPU →
 *     PC, Android/iOS → Mobile, PlayStation/Xbox/Nintendo → console).
 *   - Exclude clearly enterprise/server products (Ivanti, Exchange, Fortinet,
 *     routers, CMS, ICS) so a VPN-appliance CVE is NOT mislabelled as gamer
 *     relevant.
 *   - gamerImpactScore = severity baseline + a small multi-platform bump when
 *     relevant; a low residual score when NOT relevant (still stored so the
 *     dashboard can rank everything).
 *
 * Idempotent: skips rows that already carry affectsGamers. Re-run after a new
 * ingest to enrich the delta.
 *
 * Run:
 *   npx convex run enrichThreatIntel:enrich --prod
 */
import { mutation } from './_generated/server';
import { v } from 'convex/values';

const PLATFORM_KEYWORDS: Array<{ platform: string; terms: string[] }> = [
  {
    platform: 'PC',
    terms: [
      'windows', 'chrome', 'chromium', 'edge', 'microsoft', 'nvidia', 'amd',
      'intel', 'directx', 'vulkan', 'graphics', 'gpu', 'steam', 'discord',
      'epic', 'riot', 'vanguard', 'kernel', 'office', 'outlook', 'excel',
      'powerpoint', '.net', 'visual studio', 'xbox',
    ],
  },
  {
    platform: 'Mobile',
    terms: ['android', 'ios', 'iphone', 'ipad', 'mobile', 'safari', 'apple'],
  },
  { platform: 'PlayStation', terms: ['playstation', 'sony'] },
  { platform: 'Nintendo Switch', terms: ['nintendo', 'switch'] },
];

// Products that are NOT consumer/gaming surface area — enterprise, servers,
// network appliances, CMS, ICS. A match here vetoes affectsGamers.
const ENTERPRISE_EXCLUDE = [
  'ivanti', 'proftpd', 'exchange', 'sharepoint', 'citrix', 'fortinet', 'fortios',
  'cisco', 'vmware', 'palo alto', 'juniper', 'barracuda', 'netgear', 'draytek',
  'zyxel', 'qnap', 'synology', 'sonicwall', 'connect secure', 'moodle', 'gitlab',
  'jenkins', 'apache', 'nginx', 'php', 'drupal', 'wordpress', 'joomla', 'oracle',
  'sap', 'supervisor', 'cacti', 'rockwell', 'schneider', 'siemens', 'moxa',
  'progress', 'mirth', 'f5 ', 'owncloud', 'nextcloud', 'zimbra', 'roundcube',
  'exim', 'postfix', 'dovecot', 'openssh', 'openssl', 'log4j', 'spring',
  'grafana', 'prometheus', 'kubernetes', 'docker', 'ansible', 'terraform',
];

function severityBase(severity: string): number {
  switch (severity) {
    case 'critical':
      return 95;
    case 'high':
      return 80;
    case 'medium':
      return 55;
    case 'low':
      return 25;
    default:
      return 40;
  }
}

export const enrich = mutation({
  args: { batch: v.optional(v.number()), dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query('threatIntel').collect();

    let enriched = 0;
    let skipped = 0;
    const sample: Array<{ title: string; affectsGamers: boolean; platforms: string[]; score: number }> = [];

    for (const row of rows) {
      if (row.affectsGamers !== undefined) {
        skipped++;
        continue;
      }

      const text = `${row.title ?? ''} ${row.description ?? ''}`.toLowerCase();
      const isEnterprise = ENTERPRISE_EXCLUDE.some((t) => text.includes(t));
      const platforms = PLATFORM_KEYWORDS
        .filter((p) => p.terms.some((t) => text.includes(t)))
        .map((p) => p.platform);

      const affectsGamers = platforms.length > 0 && !isEnterprise;
      const base = severityBase(row.severity ?? 'medium');
      const gamerImpactScore = affectsGamers
        ? Math.min(100, base + (platforms.length > 1 ? 5 : 0))
        : Math.round(base * 0.2);

      if (!args.dryRun) {
        await ctx.db.patch(row._id, {
          affectsGamers,
          gamerImpactScore,
          gamingPlatforms: platforms,
          gameSlugs: [],
        });
      }

      enriched++;
      if (sample.length < 10) {
        sample.push({ title: String(row.title).slice(0, 70), affectsGamers, platforms, score: gamerImpactScore });
      }
      if (args.batch && enriched >= args.batch) break;
    }

    return { total: rows.length, enriched, skipped, sample };
  },
});
