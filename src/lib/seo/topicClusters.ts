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
        { title: 'How AI Works', url: '/article/ai-basics', keywords: ['AI basics', 'how AI works'] },
        { title: 'Machine Learning Explained', url: '/article/ml-explained', keywords: ['machine learning', 'ML'] },
        { title: 'Deep Learning Guide', url: '/article/deep-learning', keywords: ['deep learning', 'neural networks'] },
        { title: 'AI Security Concerns', url: '/article/ai-security', keywords: ['AI security', 'AI risks'] },
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
        { title: 'Cloud Computing Basics', url: '/article/cloud-basics', keywords: ['cloud basics'] },
        { title: 'AWS vs Azure vs GCP', url: '/article/cloud-comparison', keywords: ['cloud comparison'] },
        { title: 'Cloud Security Best Practices', url: '/article/cloud-security', keywords: ['cloud security'] },
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
        { title: 'Blockchain Explained', url: '/article/blockchain-explained', keywords: ['blockchain'] },
        { title: 'Cryptocurrency Security', url: '/article/crypto-security', keywords: ['crypto security'] },
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
        { title: 'Cybersecurity Basics', url: '/article/cybersecurity-basics', keywords: ['cybersecurity basics'] },
        { title: 'Network Security Guide', url: '/article/network-security', keywords: ['network security'] },
        { title: 'Endpoint Protection', url: '/article/endpoint-security', keywords: ['endpoint security'] },
        { title: 'Threat Intelligence', url: '/article/threat-intelligence', keywords: ['threat intelligence'] },
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
        { title: 'Ransomware Prevention', url: '/article/ransomware-prevention', keywords: ['ransomware prevention'] },
        { title: 'Malware Removal Guide', url: '/article/malware-removal', keywords: ['malware removal'] },
        { title: 'Best Antivirus Software', url: '/article/best-antivirus', keywords: ['antivirus', 'malware protection'] },
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
        { title: 'GDPR Compliance Guide', url: '/article/gdpr-compliance', keywords: ['GDPR', 'compliance'] },
        { title: 'Data Privacy Best Practices', url: '/article/data-privacy', keywords: ['data privacy'] },
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
        { title: 'Gaming Account Security', url: '/article/gaming-account-security', keywords: ['gaming security'] },
        { title: 'Protect Gaming Data', url: '/article/gaming-data-protection', keywords: ['gaming privacy'] },
        { title: 'Gaming Security Ratings', url: '/security-score', keywords: ['security ratings'] },
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
        { title: 'Best Gaming Laptops 2026', url: '/article/best-gaming-laptops', keywords: ['gaming laptops'] },
        { title: 'Gaming Mouse Reviews', url: '/article/gaming-mice', keywords: ['gaming mice'] },
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
        { title: 'Esports Guide', url: '/article/esports-guide', keywords: ['esports'] },
        { title: 'Major Tournaments 2026', url: '/article/esports-tournaments', keywords: ['tournaments'] },
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
