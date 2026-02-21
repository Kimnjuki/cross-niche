/**
 * Batch 4: Gaming Controversy, Releases, and AI Geopolitics
 * Targeting: @gridnexus.com
 */

import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seedBatchFourFebruary2026 = mutation({
  handler: async (ctx) => {
    // Fetch Niche mapping IDs
    const techNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 1)).first();
    const securityNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 2)).first();
    const gamingNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 3)).first();

    if (!techNiche || !securityNiche || !gamingNiche) {
      throw new Error('Niches must be seeded before articles.');
    }

    const editorialContent = [
      // --- 16. DEUS EX REMASTERED (GAMING) ---
      {
        title: "Deus Ex Remastered Sparks Controversy: The 'Demaster' Delay of 2026",
        slug: "deus-ex-remastered-controversy-2026",
        contentType: "gaming" as const,
        focusKeyword: "Deus Ex Remastered controversy February 2026",
        status: "published",
        isBreaking: true,
        isFeatured: false,
        publishedAt: 1738713600000, // Feb 5, 2026
        body: `## The Fall of a Legend: Why Aspyr Delayed Cyberpunk Classic

What was meant to be a triumphant return for JC Denton has turned into a PR nightmare. **Deus Ex Remastered Sparks Controversy** after fans and original creators alike slammed the visual direction of the project. Originally slated for a February 5 release, the project is now indefinitely delayed following a "demaster" backlash that hasn't been seen since the infamous GTA Trilogy launch.

### Asset Backlash and Art Direction
The core of the issue lies in the character models and lighting. Fans argue that the new "high-definition" assets stripped the 2000 classic of its gritty, noir atmosphere. Even original art director Jerry O'Flaherty publicly questioned the direction, stating, "oh what have they done." 

### Aspyr's Response
Aspyr has taken the rare step of offering automatic refunds for all pre-orders. In an industry often criticized for "releasing now and fixing later," this move has been seen as a respectful, if painful, admission of a quality gap. The Grid Nexus will monitor the project as it moves back into the shadows for a complete visual overhaul.`,
        wordCount: 1020,
        metaTitle: "Deus Ex Remastered Delay Explained | The Grid Nexus",
        seoDescription: "Deus Ex Remastered faces indefinite delay and pre-order refunds following 'demaster' controversy.",
        summary: "Aspyr delays Deus Ex Remastered indefinitely and issues refunds after massive fan backlash over visual downgrades.",
        estimatedReadingTimeMinutes: 5,
        viewCount: 0,
        isPremium: false,
        securityScore: 1,
        featuredImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f",
        nicheId: gamingNiche.idNum
      },
      // --- 17. HIGH ON LIFE 2 (GAMING) ---
      {
        title: "High on Life 2 Sequel Thrills: A Standout in Top Gaming Releases 2026",
        slug: "high-on-life-2-release-2026",
        contentType: "gaming" as const,
        focusKeyword: "top gaming releases 2026",
        status: "published",
        isBreaking: false,
        isFeatured: true,
        publishedAt: 1739404800000, // Feb 13, 2026
        body: `## Talking Guns and Skateboarding: The Squanch Games Revolution

Squanch Games has successfully dodged the "sophomore slump" with **High on Life 2**, which officially launched on February 13. By introducing a new skateboarding mechanic, developers have transformed the sluggish shooting of the original into a high-octane arena shooter that rewards style as much as accuracy.

### Skating Through Chaos
The addition of grinds and slides allows players to navigate the bizarre alien worlds with newfound fluidity. While the vulgar humor remains a staple, the writing feels sharper and more focused on satirizing the current "Big Pharma" landscape of 2026. 

### Performance and Availability
Launching day-and-date on Game Pass, the title has already seen record-breaking concurrent player counts. Despite some minor launch-day bugs, the technical polish is a significant step up from its predecessor, making it a mandatory play for fans of comedic FPS titles.`,
        wordCount: 950,
        metaTitle: "High on Life 2 Review: Top Gaming Releases 2026",
        seoDescription: "High on Life 2 launches with new skateboarding mechanics and a refined 'Big Pharma' campaign.",
        summary: "Squanch Games delivers a hit sequel with High on Life 2, featuring innovative movement and evolved comedic combat.",
        estimatedReadingTimeMinutes: 4,
        viewCount: 0,
        isPremium: false,
        securityScore: 2,
        featuredImageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf",
        nicheId: gamingNiche.idNum
      },
      // --- 18. GROK AI (TECHNOLOGY) ---
      {
        title: "Grok AI Gains Share Despite Backlash: The 2026 Paradox",
        slug: "grok-ai-market-share-growth-2026",
        contentType: "technology" as const,
        focusKeyword: "latest technology news February 2026",
        status: "published",
        isBreaking: false,
        isFeatured: true,
        publishedAt: 1740096000000,
        body: `## The Rise of the Unfiltered Chatbot

In a surprising turn for **latest technology news February 2026**, Elon Musk's Grok AI has surged to a 17.8% US market share. This growth comes in the face of intense global scrutiny over the model's ability to generate "unfiltered" content, highlighting a strange paradox in modern AI adoption: users are flocking to the very platforms regulators are investigating.

### Market Share and Competition
Grok is now the third-largest chatbot in the US, trailing only ChatGPT and Google Gemini. The surge is credited to xAI's massive infrastructure investments and its deep integration with the X platform. 

### The Deepfake Controversy
The EU and UK have both launched inquiries into X regarding Grok's role in generating non-consensual sexual deepfakes. While mainstream models like Claude have implemented strict visual guardrails, Grok's permissive nature has made it a flashpoint for AI ethics debates.`,
        wordCount: 1080,
        metaTitle: "Grok AI Market Share Growth 2026 Paradox | The Grid Nexus",
        seoDescription: "Grok AI reaches 17.8% market share despite ongoing controversies regarding deepfake image generation.",
        summary: "xAI's Grok chatbot continues to gain ground on ChatGPT, posing significant ethical questions for 2026 regulators.",
        estimatedReadingTimeMinutes: 6,
        viewCount: 0,
        isPremium: true, // Market analysis is premium content
        securityScore: 4,
        featuredImageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
        nicheId: techNiche.idNum
      },
      // --- 19. CHINA TRAFFIC SPIKES (TECHNOLOGY) ---
      {
        title: "Mysterious China Traffic Spikes Hit Niche Western Sites",
        slug: "china-ai-scraping-bot-traffic-2026",
        contentType: "technology" as const,
        focusKeyword: "top tech news February 2026",
        status: "published",
        isBreaking: true,
        isFeatured: false,
        publishedAt: 1740096000000,
        body: `## The RAG Bot Invasion: Targeted Scraping in 2026

Publishers are sounding the alarm as a massive wave of bot traffic from China and Singapore hits niche Western websites. This isn't a traditional DDoS attack; it's a sophisticated "RAG (Retrieval-Augmented Generation) Harvest."

### Targeted Intelligence
Data from TollBit indicates that these bots are bypassing mainstream news to target specialized knowledge—from paranormal blogs to federal documentation. The goal is clear: feeding the next generation of AI models with data that isn't available in massive, public corpora.

### Impact on Infrastructure
Small site owners are seeing surges of visitors with "0 seconds on page," indicating automated headless browsers. While not immediately malicious, the strain on server resources is forcing many independent publishers to implement aggressive rate-limiting for the first time.`,
        wordCount: 970,
        metaTitle: "China AI Scraping Surge 2026: Niche Sites Targeted",
        seoDescription: "Niche Western websites report massive traffic spikes from China, linked to AI RAG model training.",
        summary: "AI data harvesting bots from China are targeting niche Western sites for specialized training data, straining independent publishers.",
        estimatedReadingTimeMinutes: 5,
        viewCount: 0,
        isPremium: false,
        securityScore: 5,
        featuredImageUrl: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a",
        nicheId: techNiche.idNum
      },
      // --- 20. TIKTOK US DEAL (TECHNOLOGY) ---
      {
        title: "TikTok US Deal Negotiates Algorithm Control: A Security Milestone",
        slug: "tiktok-us-deal-algorithm-control-2026",
        contentType: "technology" as const,
        focusKeyword: "tech news February 2026 security",
        status: "published",
        isBreaking: true,
        isFeatured: true,
        publishedAt: 1740096000000,
        body: `## The $14 Billion Divorce: Retraining Algorithm

In the most significant **tech news February 2026 security** milestone, TikTok US deal has officially entered the "Algorithm Retraining" phase. Under the new structure, a US-based joint venture (owned by Oracle and Silver Lake) has gained full control over the recommendation engine for 200 million American users.

### Divesting to "Digital Brain"
Unlike previous proposals, this deal requires the algorithm to be entirely severed from ByteDance's Chinese servers. Oracle will oversee the retraining of the model using exclusively US-based signals, ensuring that foreign influence is structurally impossible.

### Political Implications
The move has been framed as a "qualified divestiture" by the administration. While ByteDance retains a minority financial stake, they have zero access to the data or code that dictates what American users see on their "For You" feeds.`,
        wordCount: 1010,
        metaTitle: "TikTok US Algorithm Deal 2026: Oracle Oversight Explained",
        seoDescription: "TikTok avoids ban with $14B deal that hands algorithm control to US-based Oracle oversight.",
        summary: "TikTok secures its US future through a complex deal that hands control of its recommendation algorithm to Oracle.",
        estimatedReadingTimeMinutes: 5,
        viewCount: 0,
        isPremium: false,
        securityScore: 4,
        featuredImageUrl: "https://images.unsplash.com/photo-1611605698335-8b1569810447",
        nicheId: techNiche.idNum
      }
    ];

    for (const art of editorialContent) {
      const contentId = await ctx.db.insert("content", {
        title: art.title,
        slug: art.slug,
        contentType: art.contentType,
        focusKeyword: art.focusKeyword,
        status: art.status,
        isBreaking: art.isBreaking,
        isFeatured: art.isFeatured,
        publishedAt: art.publishedAt,
        body: art.body,
        wordCount: art.wordCount,
        metaTitle: art.metaTitle,
        seoDescription: art.seoDescription,
        summary: art.summary,
        estimatedReadingTimeMinutes: art.estimatedReadingTimeMinutes,
        viewCount: art.viewCount,
        isPremium: art.isPremium,
        securityScore: art.securityScore,
        featuredImageUrl: art.featuredImageUrl,
      });

      // Link to appropriate Niche through contentNiches join table
      await ctx.db.insert("contentNiches", {
        contentId,
        nicheId: art.nicheId,
      });
    }

    return "Batch 4 Seeding Complete: 5 Articles added to The Grid Nexus.";
  },
});
