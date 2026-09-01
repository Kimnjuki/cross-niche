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
export const TOPIC_CLUSTERS: Record<string, TopicCluster[]> = {
  tech: [
    {
      hub: {
        title: 'Artificial Intelligence & Machine Learning',
        url: '/tech?q=artificial+intelligence',
        description: 'Complete guide to AI and ML technologies',
        keywords: ['artificial intelligence', 'machine learning', 'AI', 'ML', 'deep learning']
      },
      spokes: [
        { title: 'How AI Works', url: '/article/ai-enabled-security-awareness-training-adaptive-learning-2026', keywords: ['AI basics', 'how AI works'] },
        { title: 'Machine Learning Explained', url: '/article/ai-security-threats-2026', keywords: ['machine learning', 'ML'] },
        { title: 'Deep Learning Guide', url: '/article/ai-enabled-security-awareness-training-adaptive-learning-2026', keywords: ['deep learning', 'neural networks'] },
        { title: 'AI Security Concerns', url: '/article/ai-security-threats-2026', keywords: ['AI security', 'AI risks'] },
      ]
    },
    {
      hub: {
        title: 'Cloud Computing',
        url: '/tech?q=cloud+computing',
        description: 'Cloud infrastructure and services',
        keywords: ['cloud computing', 'AWS', 'Azure', 'GCP', 'cloud services']
      },
      spokes: [
        { title: 'Cloud Computing Basics', url: '/article/cloud-native-security-intelligence-cspm-cwpp-2026', keywords: ['cloud basics'] },
        { title: 'AWS vs Azure vs GCP', url: '/article/cloud-native-security-intelligence-cspm-cwpp-2026', keywords: ['cloud comparison'] },
        { title: 'Cloud Security Best Practices', url: '/article/cloud-native-security-intelligence-cspm-cwpp-2026', keywords: ['cloud security'] },
      ]
    },
    {
      hub: {
        title: 'Blockchain & Cryptocurrency',
        url: '/tech?q=blockchain',
        description: 'Blockchain technology and crypto',
        keywords: ['blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'web3']
      },
      spokes: [
        { title: 'Blockchain Explained', url: '/article/identity-centric-security-passwordless-auth-2026-roadmap', keywords: ['blockchain'] },
        { title: 'Cryptocurrency Security', url: '/article/identity-centric-security-passwordless-auth-2026-roadmap', keywords: ['crypto security'] },
      ]
    }
  ],
  security: [
    {
      hub: {
        title: 'Cybersecurity Fundamentals',
        url: '/security',
        description: 'Essential cybersecurity knowledge',
        keywords: ['cybersecurity', 'security basics', 'cyber threats', 'network security']
      },
      spokes: [
        { title: 'Cybersecurity Basics', url: '/article/secure-devops-devsecops-intelligence-cicd-2026', keywords: ['cybersecurity basics'] },
        { title: 'Network Security Guide', url: '/article/complete-guide-to-scanning-gaming-servers-for-vulnerabilities', keywords: ['network security'] },
        { title: 'Endpoint Protection', url: '/article/gaming-pc-security-hardening-guide-2026', keywords: ['endpoint security'] },
        { title: 'Threat Intelligence', url: '/article/ai-security-threats-2026', keywords: ['threat intelligence'] },
      ]
    },
    {
      hub: {
        title: 'Ransomware & Malware Protection',
        url: '/security?q=ransomware',
        description: 'Protect against ransomware and malware',
        keywords: ['ransomware', 'malware', 'virus protection', 'antivirus']
      },
      spokes: [
        { title: 'Ransomware Prevention', url: '/article/how-to-check-if-your-gaming-accounts-have-been-compromised', keywords: ['ransomware prevention'] },
        { title: 'Malware Removal Guide', url: '/article/discord-malware-gamers-how-to-stay-safe', keywords: ['malware removal'] },
        { title: 'Best Antivirus Software', url: '/article/gaming-pc-antivirus-best-2026', keywords: ['antivirus', 'malware protection'] },
      ]
    },
    {
      hub: {
        title: 'Data Privacy & GDPR',
        url: '/security?q=data+privacy',
        description: 'Data privacy and compliance',
        keywords: ['data privacy', 'GDPR', 'CCPA', 'privacy compliance']
      },
      spokes: [
        { title: 'GDPR Compliance Guide', url: '/article/bitwarden-security-incident-gaming-password-manager', keywords: ['GDPR', 'compliance'] },
        { title: 'Data Privacy Best Practices', url: '/article/gaming-headset-malware-privacy-guide', keywords: ['data privacy'] },
      ]
    }
  ],
  gaming: [
    {
      hub: {
        title: 'Gaming Security',
        url: '/gaming?q=security',
        description: 'Protect your gaming accounts and data',
        keywords: ['gaming security', 'account protection', 'gaming privacy']
      },
      spokes: [
        { title: 'Gaming Account Security', url: '/article/complete-gaming-account-security-guide-2026', keywords: ['gaming security'] },
        { title: 'Protect Gaming Data', url: '/article/gaming-headset-malware-privacy-guide', keywords: ['gaming privacy'] },
        { title: 'Gaming Security Ratings', url: '/security-score', keywords: ['security ratings'] },
      ]
    },
    {
      hub: {
        title: 'Gaming PC & Antivirus Security',
        url: '/article/gaming-pc-antivirus-best-2026',
        description: 'Best antivirus for gaming PCs in 2026',
        keywords: ['antivirus gaming', 'best antivirus', 'gaming pc', 'gaming antivirus', 'antivirus for gaming', 'best antivirus for gaming computer']
      },
      spokes: [
        { title: 'Best Antivirus for Gaming PC 2026', url: '/article/gaming-pc-antivirus-best-2026', keywords: ['best antivirus', 'gaming pc', 'antivirus gaming'] },
        { title: 'Gaming PC Security Hardening Guide', url: '/article/gaming-pc-security-hardening-guide', keywords: ['gaming pc security', 'hardening'] },
        { title: 'Free Antivirus for Gaming', url: '/article/gaming-pc-antivirus-best-2026', keywords: ['free antivirus', 'gaming'] },
        { title: 'Antivirus Performance Impact on Gaming', url: '/article/gaming-pc-security-hardening-guide', keywords: ['antivirus performance', 'gaming fps'] },
        { title: 'Gaming Malware Protection', url: '/article/discord-malware-gamers-how-to-stay-safe', keywords: ['gaming malware', 'protection'] },
      ]
    },
    {
      hub: {
        title: 'Gaming Hardware Reviews',
        url: '/gaming?q=hardware',
        description: 'Gaming hardware reviews and comparisons',
        keywords: ['gaming hardware', 'gaming laptops', 'gaming mice', 'gaming keyboards']
      },
      spokes: [
        { title: 'Best Gaming Laptops 2026', url: '/article/steam-deck-2-specs-release-date-leaks', keywords: ['gaming laptops'] },
        { title: 'Gaming Mouse Reviews', url: '/article/steam-controller-security-risks-gamers', keywords: ['gaming mice'] },
      ]
    },
    {
      hub: {
        title: 'Esports & Competitive Gaming',
        url: '/gaming?q=esports',
        description: 'Esports news and competitive gaming',
        keywords: ['esports', 'competitive gaming', 'tournaments', 'pro gaming']
      },
      spokes: [
        { title: 'Esports Guide', url: '/article/game-recommendations-by-security-score-finding-safe-multiplayer-games', keywords: ['esports'] },
        { title: 'Major Tournaments 2026', url: '/article/how-we-predict-game-release-dates-signal-analysis', keywords: ['tournaments'] },
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

