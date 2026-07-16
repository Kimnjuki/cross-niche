/**
 * Topic Clusters for Internal Linking
 * Hub-and-spoke model: Pillar pages (hubs) link to cluster content (spokes)
 */

export interface TopicCluster {
  hub: {
    title: string;
    url: string;
    description: string;
    keywords: string[];
  };
  spokes: Array<{
    title: string;
    url: string;
    keywords: string[];
  }>;
}

// Define topic clusters for tech, security, gaming
// Uses REAL article slugs from GSC data for actual internal linking
export const TOPIC_CLUSTERS: Record<string, TopicCluster[]> = {
  tech: [
    {
      hub: {
        title: 'NVIDIA & GPU Technology',
        url: '/tech?q=nvidia+gpu',
        description: 'Latest NVIDIA GPU benchmarks, leaks, and performance analysis',
        keywords: ['nvidia', 'gpu', 'rtx', 'graphics card', 'benchmarks']
      },
      spokes: [
        { title: 'NVIDIA RTX 5090 Benchmarks Leak: 2x Performance', url: '/article/nvidia-rtx-5090-benchmarks-leak-2x-performance', keywords: ['nvidia rtx 5090', 'gpu benchmarks'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['gaming pc', 'pc security'] },
        { title: 'PC Builder Tool', url: '/tools/pc-builder', keywords: ['pc builder', 'gaming pc build'] },
      ]
    },
    {
      hub: {
        title: 'AI & Emerging Tech',
        url: '/tech?q=ai',
        description: 'Artificial intelligence, machine learning, and emerging technology coverage',
        keywords: ['artificial intelligence', 'AI', 'machine learning', 'emerging tech']
      },
      spokes: [
        { title: 'AI Basics Guide', url: '/article/ai-basics', keywords: ['AI basics', 'how AI works'] },
        { title: 'Threat Intelligence & Proactive Defense', url: '/article/threat-intelligence-proactive-defense-stix-taxii-2026', keywords: ['threat intelligence', 'AI security'] },
        { title: '6G Networks Prototype Trials', url: '/article/6g-networks-prototype-trials-2024', keywords: ['6G', 'networks'] },
      ]
    },
    {
      hub: {
        title: 'Hardware & Supply Chain Security',
        url: '/tech?q=hardware+security',
        description: 'Hardware vulnerabilities, supply chain attacks, and firmware security',
        keywords: ['hardware security', 'supply chain', 'firmware', 'asus']
      },
      spokes: [
        { title: 'ASUS Supplier Firmware Breach', url: '/article/asus-supplier-firmware-breach-hardware-backdoor', keywords: ['asus breach', 'firmware backdoor'] },
        { title: 'Router Security for Gamers', url: '/article/router-security-gamers-network-protection', keywords: ['router security', 'network protection'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['pc hardening', 'gaming security'] },
      ]
    }
  ],
  security: [
    {
      hub: {
        title: 'Gaming Account Security & Protection',
        url: '/security?q=gaming+account',
        description: 'Complete guide to protecting your gaming accounts from hackers and thieves',
        keywords: ['gaming account', 'steam security', 'account takeover', 'hacked']
      },
      spokes: [
        { title: 'Steam Account Takeover Protection Guide 2026', url: '/article/steam-account-takeover-protection-guide-2026', keywords: ['steam account', 'account takeover'] },
        { title: '2FA Setup for Every Gaming Platform', url: '/article/2fa-setup-every-gaming-platform', keywords: ['2FA', 'two factor authentication', 'gaming platforms'] },
        { title: 'Fake Game Cheats Malware', url: '/article/fake-game-cheats-malware-account-stealer', keywords: ['fake cheats', 'malware', 'account stealer'] },
        { title: 'Steam Controller Security Risks', url: '/article/steam-controller-security-risks-gamers', keywords: ['steam controller', 'security risks'] },
        { title: 'Gmail Hack Attacks Surge for Gamers', url: '/article/gmail-hack-attacks-surge-gamers-2fa-2026', keywords: ['gmail hack', '2FA', 'gamers'] },
        { title: 'SIM Swapping Gaming Accounts Protection', url: '/article/sim-swapping-gaming-accounts-protection', keywords: ['sim swapping', 'gaming accounts'] },
      ]
    },
    {
      hub: {
        title: 'Gaming PC & Antivirus Security',
        url: '/security?q=antivirus+gaming',
        description: 'Best antivirus and security practices for gaming PCs',
        keywords: ['antivirus', 'gaming pc', 'malware protection', 'pc security']
      },
      spokes: [
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['pc hardening', 'gaming security'] },
        { title: 'Best Antivirus for Gaming PC 2026', url: '/article/gaming-pc-antivirus-best-2026', keywords: ['antivirus gaming', 'best antivirus'] },
        { title: 'Fake Game Cheats Malware', url: '/article/fake-game-cheats-malware-account-stealer', keywords: ['game cheats', 'malware'] },
        { title: 'Discord Malware Guide', url: '/article/discord-malware-gamers-how-to-stay-safe', keywords: ['discord malware', 'gaming safety'] },
      ]
    },
    {
      hub: {
        title: 'Game Key Reseller & Marketplace Security',
        url: '/security?q=game+keys',
        description: 'How to avoid scams on G2A, CDKeys, and other game key marketplaces',
        keywords: ['game keys', 'g2a', 'cdkeys', 'reseller scams', 'gray market']
      },
      spokes: [
        { title: 'Game Key Reseller Scams: G2A, CDKeys', url: '/article/game-key-reseller-scams-g2a-cdkeys', keywords: ['g2a scams', 'cdkeys', 'reseller'] },
        { title: 'Steam Account Takeover Protection Guide 2026', url: '/article/steam-account-takeover-protection-guide-2026', keywords: ['steam security', 'account protection'] },
        { title: '2FA Setup for Every Gaming Platform', url: '/article/2fa-setup-every-gaming-platform', keywords: ['2FA', 'platform security'] },
      ]
    },
    {
      hub: {
        title: 'Minecraft Server Security',
        url: '/security?q=minecraft',
        description: 'Secure your Minecraft server against DDoS, hackers, and exploits',
        keywords: ['minecraft', 'server security', 'ddos', 'minecraft server']
      },
      spokes: [
        { title: 'Minecraft Server Security Guide', url: '/article/minecraft-server-security-guide', keywords: ['minecraft security', 'server protection'] },
        { title: 'Router Security for Gamers', url: '/article/router-security-gamers-network-protection', keywords: ['router security', 'ddos protection'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['pc hardening', 'server security'] },
      ]
    },
    {
      hub: {
        title: 'Browser & Chrome Security for Gamers',
        url: '/security?q=chrome',
        description: 'Protect your browser and online accounts from zero-day exploits',
        keywords: ['chrome', 'browser security', 'zero-day', 'exploit']
      },
      spokes: [
        { title: 'Chrome Zero-Day Warning for Gamers', url: '/article/chrome-zero-day-warning-gamers-april-2026', keywords: ['chrome zero-day', 'gamer security'] },
        { title: 'Bitwarden Security Incident', url: '/article/bitwarden-security-incident-gaming-password-manager', keywords: ['bitwarden', 'password manager'] },
        { title: 'Gmail Hack Attacks Surge for Gamers', url: '/article/gmail-hack-attacks-surge-gamers-2fa-2026', keywords: ['gmail hack', '2FA'] },
      ]
    },
    {
      hub: {
        title: 'Streamer & Content Creator Security',
        url: '/security?q=streamer',
        description: 'Essential security guide for Twitch streamers and content creators',
        keywords: ['streamer', 'twitch', 'doxxing', 'swatting', 'content creator']
      },
      spokes: [
        { title: 'Twitch Streamer Security Guide', url: '/article/twitch-streamer-security-guide-doxxing-swatting', keywords: ['twitch security', 'doxxing', 'swatting'] },
        { title: 'Discord Malware Guide', url: '/article/discord-malware-gamers-how-to-stay-safe', keywords: ['discord', 'streamer safety'] },
        { title: 'SIM Swapping Gaming Accounts Protection', url: '/article/sim-swapping-gaming-accounts-protection', keywords: ['sim swap', 'streamer'] },
      ]
    }
  ],
  gaming: [
    {
      hub: {
        title: 'Gaming Security & Account Protection',
        url: '/gaming?q=security',
        description: 'Protect your gaming accounts, data, and privacy across all platforms',
        keywords: ['gaming security', 'account protection', 'gaming privacy', 'steam']
      },
      spokes: [
        { title: 'Steam Account Takeover Protection Guide 2026', url: '/article/steam-account-takeover-protection-guide-2026', keywords: ['steam security', 'account protection'] },
        { title: '2FA Setup for Every Gaming Platform', url: '/article/2fa-setup-every-gaming-platform', keywords: ['2FA', 'gaming platforms'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['gaming pc', 'security hardening'] },
        { title: 'Gaming Security Checkup Tool', url: '/tools/gaming-security-checkup', keywords: ['security checkup', 'gaming audit'] },
        { title: 'Steam Security Scanner Tool', url: '/tools/steam-scanner', keywords: ['steam scanner', 'account scan'] },
      ]
    },
    {
      hub: {
        title: 'Console & Platform Security',
        url: '/gaming?q=console+security',
        description: 'Security guides for Nintendo Switch, Xbox, PlayStation, and gaming platforms',
        keywords: ['nintendo switch', 'xbox', 'playstation', 'console security', 'ps5']
      },
      spokes: [
        { title: 'Nintendo Switch 2 Security Guide', url: '/article/nintendo-switch-2-security-guide', keywords: ['switch 2', 'nintendo security'] },
        { title: 'Xbox Rebrand Security Changes', url: '/article/xbox-rebrand-security-changes-gamers', keywords: ['xbox security', 'rebrand'] },
        { title: 'Razer Synapse Security Vulnerability', url: '/article/razer-synapse-security-vulnerability-fix', keywords: ['razer', 'synapse vulnerability'] },
        { title: 'PS5 Pro Specs & Price', url: '/gaming/ps5-pro-announced-specs-price-2024', keywords: ['ps5 pro', 'sony'] },
      ]
    },
    {
      hub: {
        title: 'Gaming Hardware & PC Building',
        url: '/gaming?q=hardware',
        description: 'Gaming hardware reviews, PC building guides, and performance optimization',
        keywords: ['gaming hardware', 'gaming pc', 'pc building', 'gpu']
      },
      spokes: [
        { title: 'NVIDIA RTX 5090 Benchmarks Leak', url: '/article/nvidia-rtx-5090-benchmarks-leak-2x-performance', keywords: ['rtx 5090', 'gpu'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['gaming pc', 'hardening'] },
        { title: 'PC Builder Tool', url: '/tools/pc-builder', keywords: ['pc builder', 'build guide'] },
        { title: 'Gaming Headset Malware Guide', url: '/article/gaming-headset-malware-privacy-guide', keywords: ['gaming headset', 'malware'] },
      ]
    },
    {
      hub: {
        title: 'Game Releases & Predictions',
        url: '/gaming?q=releases',
        description: 'Upcoming game releases, predictions, and release date tracking',
        keywords: ['game releases', 'nioh', 'release date', 'game launch']
      },
      spokes: [
        { title: 'Nioh 3 Release PS5 2026', url: '/article/nioh-3-release-ps5-2026', keywords: ['nioh 3', 'ps5 release'] },
        { title: 'Game Release Predictor Tool', url: '/tools/release-predictor', keywords: ['release predictor', 'game launch'] },
        { title: 'What Gamers Think About Security 2026', url: '/article/what-gamers-think-about-security-sentiment-analysis-2026', keywords: ['gamer sentiment', 'security survey'] },
      ]
    },
    {
      hub: {
        title: 'VPN & Network Security for Gaming',
        url: '/gaming?q=vpn',
        description: 'Best VPNs for gaming, latency testing, and network security',
        keywords: ['vpn gaming', 'network security', 'latency', 'router']
      },
      spokes: [
        { title: 'VPN Gaming Security & Latency Test 2026', url: '/article/vpn-gaming-security-latency-test-2026', keywords: ['vpn gaming', 'latency test'] },
        { title: 'Router Security for Gamers', url: '/article/router-security-gamers-network-protection', keywords: ['router security', 'gaming network'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['network hardening', 'gaming'] },
      ]
    }
  ]
};

/**
 * Get related cluster content for a given article
 */
export function getRelatedClusterContent(
  articleKeywords: string[],
  niche: 'tech' | 'security' | 'gaming'
): TopicCluster | null {
  const clusters = TOPIC_CLUSTERS[niche] || [];
  
  for (const cluster of clusters) {
    const hubKeywords = cluster.hub.keywords.map(k => k.toLowerCase());
    const articleKeywordsLower = articleKeywords.map(k => k.toLowerCase());
    
    // Check if article keywords match cluster keywords
    const hasMatch = articleKeywordsLower.some(ak => 
      hubKeywords.some(hk => hk.includes(ak) || ak.includes(hk))
    );
    
    if (hasMatch) {
      return cluster;
    }
  }
  
  return null;
}

/**
 * Generate internal links for topic cluster
 */
export function generateClusterLinks(cluster: TopicCluster): string {
  let links = `<h3>Related ${cluster.hub.title} Content</h3>\n<ul>\n`;
  links += `  <li><a href="${cluster.hub.url}">${cluster.hub.title}</a> - ${cluster.hub.description}</li>\n`;
  
  cluster.spokes.forEach(spoke => {
    links += `  <li><a href="${spoke.url}">${spoke.title}</a></li>\n`;
  });
  
  links += '</ul>';
  return links;
}
