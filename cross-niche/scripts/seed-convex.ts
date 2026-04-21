import { ConvexHttpClient } from "convex/browser";

const client = new ConvexHttpClient(process.env.VITE_CONVEX_URL!);

const articles = [
  {
    title: "The Future of AI in 2026: What to Expect",
    slug: "future-ai-2026",
    summary: "A comprehensive look at AI developments shaping the future",
    body: `<p>Artificial intelligence continues to evolve at an unprecedented pace. As we move into 2026, several key trends are emerging that will shape the future of AI technology.</p>
    
    <h2>Key Developments</h2>
    <ul>
      <li><strong>Multimodal AI</strong> - Systems that can process text, images, and audio simultaneously</li>
      <li><strong>Edge AI</strong> - AI processing on devices rather than in the cloud</li>
      <li><strong>AI Safety</strong> - Enhanced focus on ethical AI development</li>
      <li><strong>Quantum AI</strong> - Integration of quantum computing with AI algorithms</li>
    </ul>
    
    <h2>Industry Impact</h2>
    <p>These advancements will transform industries from healthcare to finance, creating new opportunities and challenges for businesses and consumers alike.</p>`,
    contentType: "article",
    status: "published",
    publishedAt: Date.now(),
    isFeatured: true,
    isBreaking: false,
    viewCount: 0,
    estimatedReadingTimeMinutes: 5,
  },
  {
    title: "Critical Vulnerability Discovered in Popular Framework",
    slug: "critical-vulnerability-framework",
    summary: "Security researchers identify severe security flaw affecting millions of applications",
    body: `<p>A critical vulnerability has been discovered in a widely-used web framework that could allow attackers to execute arbitrary code on affected systems.</p>
    
    <h2>Vulnerability Details</h2>
    <ul>
      <li><strong>CVE Identifier</strong>: CVE-2026-1234</li>
      <li><strong>Severity</strong>: Critical</li>
      <li><strong>Affected Versions</strong>: All versions prior to 2.1.0</li>
    </ul>
    
    <h2>Mitigation</h2>
    <p>Users are strongly advised to update to the latest version immediately. Temporary workarounds are available but not recommended for long-term use.</p>`,
    contentType: "security",
    status: "published",
    publishedAt: Date.now() - 86400000, // 1 day ago
    isFeatured: false,
    isBreaking: true,
    viewCount: 1250,
    estimatedReadingTimeMinutes: 3,
  },
  {
    title: "Next-Gen Gaming Consoles: Performance Analysis",
    slug: "next-gen-gaming-consoles",
    summary: "In-depth comparison of upcoming gaming hardware and performance metrics",
    body: `<p>The gaming industry is gearing up for the next generation of consoles, promising unprecedented performance and immersive experiences.</p>
    
    <h2>Hardware Specifications</h2>
    <ul>
      <li><strong>GPU Power</strong> - Ray tracing and AI-enhanced graphics</li>
      <li><strong>Memory</strong> - High-speed RAM with improved bandwidth</li>
      <li><strong>Storage</strong> - NVMe SSDs as standard with expandable options</li>
    </ul>
    
    <h2>Gaming Features</h2>
    <p>Expect 8K gaming, VR support, and seamless cross-platform integration with PC and mobile devices.</p>`,
    contentType: "gaming",
    status: "published",
    publishedAt: Date.now() - 172800000, // 2 days ago
    isFeatured: true,
    isBreaking: false,
    viewCount: 890,
    estimatedReadingTimeMinutes: 7,
  },
  {
    title: "Cloud Security Best Practices for 2026",
    slug: "cloud-security-best-practices",
    summary: "Essential security measures for modern cloud deployments",
    body: `<p>As organizations increasingly rely on cloud infrastructure, implementing robust security measures has become more critical than ever.</p>
    
    <h2>Key Security Areas</h2>
    <ul>
      <li><strong>Identity and Access Management</strong> - Zero-trust architectures</li>
      <li><strong>Data Encryption</strong> - End-to-end encryption for sensitive data</li>
      <li><strong>Network Security</strong> - Advanced threat detection and response</li>
      <li><strong>Compliance</strong> - Meeting regulatory requirements</li>
    </ul>
    
    <h2>Implementation Strategy</h2>
    <p>Organizations should adopt a layered security approach, combining technical controls with employee training and incident response planning.</p>`,
    contentType: "security",
    status: "published",
    publishedAt: Date.now() - 259200000, // 3 days ago
    isFeatured: false,
    isBreaking: false,
    viewCount: 567,
    estimatedReadingTimeMinutes: 6,
  },
  {
    title: "The Rise of Indie Game Development",
    slug: "indie-game-development-rise",
    summary: "How independent developers are reshaping the gaming landscape",
    body: `<p>The indie game development scene has exploded in recent years, with creators leveraging new tools and platforms to reach global audiences.</p>
    
    <h2>Success Factors</h2>
    <ul>
      <li><strong>Accessible Tools</strong> - Unity, Unreal Engine, and custom frameworks</li>
      <li><strong>Digital Distribution</strong> - Steam, Epic Games Store, and Itch.io</li>
      <li><strong>Community Building</strong> - Social media and direct fan engagement</li>
      <li><strong>Crowdfunding</strong> - Kickstarter and Patreon for funding</li>
    </ul>
    
    <h2>Market Impact</h2>
    <p>Indie games now compete with AAA titles in quality and innovation, offering unique experiences that resonate with players seeking something different.</p>`,
    contentType: "gaming",
    status: "published",
    publishedAt: Date.now() - 345600000, // 4 days ago
    isFeatured: false,
    isBreaking: false,
    viewCount: 445,
    estimatedReadingTimeMinutes: 8,
  },
];

async function seed() {
  console.log('🌱 Starting Convex seed...');
  
  try {
    for (const article of articles) {
      const result = await client.mutation("content:upsertIngestedContent", article);
      console.log(`✅ Created: ${article.title}`);
    }
    
    console.log('🎉 Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
