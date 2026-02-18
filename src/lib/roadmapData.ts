export const NICHE_CATEGORY_MAP: Record<string, number> = {
  tech: 1,
  security: 2,
  gaming: 3,
  education: 4,
  networking: 5,
  developer: 6,
  research: 7,
  ai: 8,
  innovation: 9,
};

export type RoadmapFeatureSeed = {
  featureId: string;
  contentSlug: string;
  name: string;
  tagline: string;
  description: string;
  category: keyof typeof NICHE_CATEGORY_MAP;
  tags: string[];
  schemaType: string;
  focusKeyword: string;
  metaTitle: string;
  seoDescription: string;
  isPremium?: boolean;
};

export const ROADMAP_PHASES: Array<{ phase: number; title: string; features: RoadmapFeatureSeed[] }> = [
  {
    phase: 1,
    title: "Core Platforms",
    features: [
      {
        featureId: "ai-pulse-full",
        contentSlug: "ai-pulse-activation",
        name: "AI Pulse",
        tagline: "Compare every AI model in real time",
        description: "Track major AI model releases and compare benchmarks, pricing, and performance.",
        category: "ai",
        tags: ["ai", "benchmarks", "comparisons"],
        schemaType: "SoftwareApplication",
        focusKeyword: "AI model comparison tool",
        metaTitle: "AI Pulse — Compare Every AI Model in Real Time | The Grid Nexus",
        seoDescription:
          "Track GPT-5, Claude 4, Gemini, LLaMA releases in real time. Compare AI model benchmarks, pricing, and performance.",
      },
      {
        featureId: "breach-sim",
        contentSlug: "breach-sim-interactive",
        name: "Breach Sim",
        tagline: "Interactive cybersecurity training simulator",
        description: "Practice defending against ransomware, phishing, SQL injection, and zero-day exploits in a safe sandbox.",
        category: "security",
        tags: ["training", "simulator", "incident-response"],
        schemaType: "LearningResource",
        focusKeyword: "cybersecurity breach simulation platform",
        metaTitle: "Breach Sim — Interactive Cybersecurity Training Simulator | Grid Nexus",
        seoDescription:
          "Practice defending against real-world attacks in a browser-based sandbox with scenario-driven learning.",
      },
      {
        featureId: "security-score",
        contentSlug: "security-score-platform",
        name: "Security Score",
        tagline: "Free website security rating and scanner",
        description: "Scan domains for SSL/TLS, DNS weaknesses, CVEs, and compliance gaps.",
        category: "security",
        tags: ["scanner", "ssl", "dns", "cve"],
        schemaType: "WebApplication",
        focusKeyword: "website security score checker",
        metaTitle: "Security Score — Free Website Security Rating & Vulnerability Scanner | Grid Nexus",
        seoDescription:
          "Instantly scan any domain and get a security score with actionable remediation steps.",
      },
      {
        featureId: "threat-dashboard",
        contentSlug: "live-threat-dashboard",
        name: "Live Threat Dashboard",
        tagline: "Real-time global cyber attack map",
        description: "Watch cyber attacks unfold globally and track active ransomware and CVE exploitation.",
        category: "security",
        tags: ["threat-intel", "live", "dashboard"],
        schemaType: "WebApplication",
        focusKeyword: "live cyber attack map real-time",
        metaTitle: "Live Threat Dashboard — Real-Time Global Cyber Attack Map | Grid Nexus",
        seoDescription:
          "Track global threats, ransomware campaigns, and active exploitation on an interactive dashboard.",
      },
      {
        featureId: "gaming-hub",
        contentSlug: "gaming-hub-community",
        name: "Gaming Hub",
        tagline: "Games database + esports tracker + deals",
        description: "Track games, follow esports, find deals, and read community walkthroughs.",
        category: "gaming",
        tags: ["esports", "deals", "database"],
        schemaType: "WebSite",
        focusKeyword: "gaming news esports database 2026",
        metaTitle: "Gaming Hub — Games Database, Esports Tracker & Best Game Deals | Grid Nexus",
        seoDescription:
          "Track games, tournaments, deals, and guides in a single gaming platform.",
      },
    ],
  },
  {
    phase: 2,
    title: "Community & Intelligence",
    features: [
      {
        featureId: "roadmap-interactive",
        contentSlug: "roadmap",
        name: "Interactive Roadmap",
        tagline: "Public roadmap with community voting",
        description: "A transparent, community-driven product roadmap with live voting and discussion.",
        category: "innovation",
        tags: ["roadmap", "voting", "community"],
        schemaType: "WebPage",
        focusKeyword: "public product roadmap with community voting",
        metaTitle: "Product Roadmap | Vote on Features | The Grid Nexus",
        seoDescription: "Shape the future of The Grid Nexus by voting on upcoming features.",
      },
      {
        featureId: "nexus-intelligence",
        contentSlug: "nexus-intelligence",
        name: "Nexus Intelligence",
        tagline: "AI-powered tech news curation",
        description: "Personalized intelligence feed across tech, security, and gaming.",
        category: "ai",
        tags: ["personalization", "curation", "ai"],
        schemaType: "SoftwareApplication",
        focusKeyword: "AI-powered tech news curation",
        metaTitle: "Nexus Intelligence — AI-Powered Tech News Curation | The Grid Nexus",
        seoDescription: "AI-driven curation that keeps you ahead across tech, security and gaming.",
      },
      {
        featureId: "nexus-academy",
        contentSlug: "nexus-academy-platform",
        name: "Nexus Academy",
        tagline: "Courses and certifications with labs",
        description: "Learn cybersecurity, AI engineering, and game dev with hands-on labs and certifications.",
        category: "education",
        tags: ["courses", "labs", "certification"],
        schemaType: "EducationalOrganization",
        focusKeyword: "online cybersecurity AI certification 2026",
        metaTitle: "Nexus Academy — Cybersecurity, AI & Game Dev Courses | Grid Nexus",
        seoDescription: "Hands-on labs and certifications for cybersecurity, AI and game development.",
      },
    ],
  },
];
