/**
 * RelatedTools - Internal linking component that connects articles to relevant tools
 * Improves SEO by creating contextual links between content and interactive tools
 */
import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Wrench, Shield, Gamepad2, Search, AlertTriangle, Cpu, Globe, Lock, Users, Zap } from 'lucide-react';

interface ToolLink {
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  niche: 'tech' | 'security' | 'gaming';
}

const ALL_TOOLS: ToolLink[] = [
  { slug: '/tools/security-scanner', name: 'Security Scanner', description: 'Scan your system for vulnerabilities', icon: <Shield className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/nexusguard', name: 'NexusGuard', description: 'Real-time threat protection for gamers', icon: <Lock className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/steam-scanner', name: 'Steam Security Scanner', description: 'Check your Steam account security', icon: <Gamepad2 className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/tools/gaming-security-checkup', name: 'Gaming Security Checkup', description: 'Audit your gaming account security', icon: <Shield className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/tools/patch-risk-tracker', name: 'Patch Risk Tracker', description: 'Track game patch vulnerabilities', icon: <AlertTriangle className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/tools/ioc-lookup', name: 'IOC Threat Lookup', description: 'Hunt for indicators of compromise', icon: <Search className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/pc-builder', name: 'AI PC Builder', description: 'Build your perfect gaming PC', icon: <Cpu className="h-5 w-5" />, niche: 'tech' },
  { slug: '/tools/release-predictor', name: 'Game Release Predictor', description: 'Predict upcoming game releases', icon: <Zap className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/tools/breach-explainer', name: 'Breach Explainer', description: 'Understand data breaches', icon: <AlertTriangle className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/threat-scanner', name: 'Real-Time Threat Scanner', description: 'Scan for active threats', icon: <Globe className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/exploit-risk-meter', name: 'Exploit Risk Meter', description: 'Measure exploit risk levels', icon: <AlertTriangle className="h-5 w-5" />, niche: 'security' },
  { slug: '/tools/gaming-copilot', name: 'Gaming Copilot AI', description: 'AI assistant for gamers', icon: <Gamepad2 className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/tools/sentiment-analyzer', name: 'Game Sentiment Analyzer', description: 'Analyze gaming community sentiment', icon: <Users className="h-5 w-5" />, niche: 'gaming' },
  { slug: '/security-score', name: 'Security Score', description: 'Check your security rating', icon: <Shield className="h-5 w-5" />, niche: 'security' },
  { slug: '/breach-sim', name: 'Breach Simulator', description: 'Simulate a security breach', icon: <AlertTriangle className="h-5 w-5" />, niche: 'security' },
];

// Map article niches/tags to relevant tools
const NICHE_TOOL_MAP: Record<string, string[]> = {
  security: ['/tools/security-scanner', '/tools/nexusguard', '/tools/ioc-lookup', '/tools/breach-explainer', '/tools/threat-scanner', '/tools/exploit-risk-meter', '/security-score', '/breach-sim'],
  gaming: ['/tools/steam-scanner', '/tools/gaming-security-checkup', '/tools/patch-risk-tracker', '/tools/gaming-copilot', '/tools/sentiment-analyzer', '/tools/release-predictor'],
  tech: ['/tools/pc-builder', '/tools/security-scanner', '/tools/threat-scanner', '/tools/nexusguard'],
};

// Tag-based tool recommendations
const TAG_TOOL_MAP: Record<string, string[]> = {
  steam: ['/tools/steam-scanner', '/tools/gaming-security-checkup'],
  minecraft: ['/tools/gaming-security-checkup', '/tools/patch-risk-tracker'],
  '2fa': ['/tools/gaming-security-checkup', '/tools/nexusguard'],
  antivirus: ['/tools/security-scanner', '/tools/threat-scanner'],
  g2a: ['/tools/steam-scanner', '/tools/gaming-security-checkup'],
  nvidia: ['/tools/pc-builder', '/tools/release-predictor'],
  gpu: ['/tools/pc-builder', '/tools/release-predictor'],
  router: ['/tools/security-scanner', '/tools/nexusguard'],
  twitch: ['/tools/gaming-security-checkup', '/tools/nexusguard'],
  discord: ['/tools/gaming-security-checkup', '/tools/nexusguard'],
  nintendo: ['/tools/gaming-security-checkup', '/tools/release-predictor'],
  xbox: ['/tools/gaming-security-checkup', '/tools/release-predictor'],
  ps5: ['/tools/gaming-security-checkup', '/tools/release-predictor'],
  breach: ['/tools/breach-explainer', '/tools/ioc-lookup', '/security-score'],
  malware: ['/tools/security-scanner', '/tools/threat-scanner', '/tools/nexusguard'],
  ransomware: ['/tools/security-scanner', '/tools/threat-scanner', '/breach-sim'],
  vpn: ['/tools/security-scanner', '/tools/nexusguard'],
  password: ['/tools/nexusguard', '/tools/gaming-security-checkup'],
  'pc building': ['/tools/pc-builder'],
  'game release': ['/tools/release-predictor'],
};

interface RelatedToolsProps {
  niche: 'tech' | 'security' | 'gaming';
  tags?: string[];
  className?: string;
}

export function RelatedTools({ niche, tags = [], className = '' }: RelatedToolsProps) {
  const relevantTools = useMemo(() => {
    const toolSlugs = new Set<string>();
    
    // Add tools by niche
    const nicheTools = NICHE_TOOL_MAP[niche] || [];
    nicheTools.forEach(slug => toolSlugs.add(slug));
    
    // Add tools by tags
    tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      const tagTools = TAG_TOOL_MAP[tagLower] || [];
      tagTools.forEach(slug => toolSlugs.add(slug));
      
      // Also check partial matches
      Object.entries(TAG_TOOL_MAP).forEach(([key, tools]) => {
        if (tagLower.includes(key) || key.includes(tagLower)) {
          tools.forEach(slug => toolSlugs.add(slug));
        }
      });
    });
    
    // Get tool objects, limit to 4
    return Array.from(toolSlugs)
      .map(slug => ALL_TOOLS.find(t => t.slug === slug))
      .filter((t): t is ToolLink => t !== undefined)
      .slice(0, 4);
  }, [niche, tags]);

  if (relevantTools.length === 0) return null;

  return (
    <section className={`border-t border-border pt-8 mb-8 ${className}`} aria-label="Related Tools">
      <h2 className="font-display font-bold text-xl mb-2">
        <Wrench className="h-5 w-5 inline-block mr-2 text-primary" />
        Related Security Tools
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Use our interactive tools to enhance your security posture and stay protected.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {relevantTools.map((tool) => (
          <Link
            key={tool.slug}
            to={tool.slug}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors group"
          >
            <div className="mt-0.5 text-primary group-hover:text-primary/80 transition-colors">
              {tool.icon}
            </div>
            <div>
              <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}