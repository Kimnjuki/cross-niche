/**
 * Seed top articles for homepage - remove previous and add new featured content
 */

import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seedTopArticles = mutation({
  handler: async (ctx) => {
    // First, remove all existing content to start fresh
    const existingContent = await ctx.db.query('content').collect();
    for (const content of existingContent) {
      await ctx.db.delete(content._id);
      console.log(`Deleted existing article: ${content.title}`);
    }

    // New top articles
    const articles = [
      {
        title: "Tata Partners with OpenAI for India's First Major AI Data Center",
        slug: "tata-openai-india-data-center-2026",
        contentType: "technology" as const,
        focusKeyword: "technology news February 18 2026",
        featuredImageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=630&fit=crop",
        status: "published",
        isBreaking: true,
        isFeatured: true,
        publishedAt: 1740030000000,
        body: `## India's Leap Toward Silicon Sovereignty

In a landmark move that has sent shockwaves through the global tech sector, **Tata Partners with OpenAI for India's First Major AI Data Center**, signaling a new era of digital independence for the subcontinent. Announced at the India AI Impact Summit, this massive infrastructure project stands as the most significant **technology news February 18 2026** development, aiming to provide the compute power necessary for a 'sovereign AI' future. When **Tata Partners with OpenAI for India's First Major AI Data Center**, they aren't just building a warehouse for servers; they are creating the foundation for **India's first major AI data center** to rival the hyperscale giants of the West.

### The HyperVault Initiative: 100MW to 1GW

At the heart of this partnership is TCS's newly formed **HyperVault AI Data Center Limited**. The initial phase, which is already underway, involves a 100-megawatt (MW) facility designed specifically for the extreme demands of Large Language Model (LLM) training. However, the roadmap doesn't stop there. Tata Sons Chairman N Chandrasekaran confirmed that the facility has a clear path to scale up to **1 gigawatt (GW)**.

To understand the scale, a 1GW data center is essentially a small city of silicon. It requires massive energy grids and cutting-edge cooling. To solve this, the Tata-OpenAI facility will feature **liquid-cooled high-density racks**, a necessity for the next-generation NVIDIA and AMD chips that will power OpenAI's future iterations. This isn't just a win for Tata; it's a critical milestone for the **OpenAI for India initiative**, ensuring that Indian data stays on Indian soil.

### Why 'Sovereign AI' is the Buzzword of 2026

At The Grid Nexus, we've observed a growing trend of 'data nationalism.' Countries no longer want to rely on the 'Big Three' US cloud providers for their mission-critical AI workloads. By building **sovereign AI infrastructure**, India is protecting its strategic interests.

* **Data Residency:** Sensitive government and financial data will never leave the country.
* **Reduced Latency:** Local hosting means faster response times for the 100 million+ weekly ChatGPT users in India.
* **Cost Efficiency:** Localizing the compute stack removes the heavy 'cloud tax' associated with international data transfers.

### The Sam Altman Factor: A Global Stargate

This deal is a key piece of Sam Altman's 'Stargate' project—a trillion-dollar global vision to build a network of AI super-clusters. By partnering with Tata, OpenAI gains an 'anchor tenant' in the world's most populous internet market. During his visit to Delhi, Altman emphasized that India isn't just a consumer of AI, but a co-creator.

Beyond hardware, the collaboration extends to **Agentic AI solutions**. Tata Consultancy Services (TCS) will work with OpenAI to build autonomous agents for banking, retail, and manufacturing sectors. These aren't just chatbots; they are digital employees capable of handling complex procurement and logistics without human intervention.

### The Grid Nexus Verdict: A Trillion-Dollar Foundation

We believe this is the most consequential **technology news February 18 2026** has offered. While the $2.5 trillion global AI spending is impressive, the *location* of that spending matters. India is no longer waiting for the future to be exported from Silicon Valley—it is building the future in its own backyard. The scale of the 1GW target suggests that Tata and OpenAI are preparing for a world where AI is as ubiquitous as electricity.

For the Indian tech ecosystem, this is the 'Jio moment' for artificial intelligence. It democratizes access to high-end compute, allowing local startups to train their own models without the prohibitive costs of international cloud rentals. The grid is growing, and the nexus is moving East.`,
        wordCount: 940,
        metaTitle: "Tata & OpenAI Partner for India's First 1GW AI Data Center | The Grid Nexus",
        seoDescription: "Tata Group and OpenAI announce India's first major AI data center. A 1GW project for sovereign AI infrastructure. Read the full tech news from February 18, 2026.",
        summary: "Tata and OpenAI partner to build India's first 1GW AI data center, marking a major step toward sovereign AI infrastructure and digital independence.",
        estimatedReadingTimeMinutes: 5,
        viewCount: 0,
        isPremium: false,
        securityScore: 4
      },
      {
        title: "Meta Plans Facial Recognition in Smart Glasses",
        slug: "meta-facial-recognition-smart-glasses-2026",
        contentType: "technology" as const,
        focusKeyword: "top news in tech February 2026",
        featuredImageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&h=630&fit=crop",
        status: "published",
        isFeatured: true,
        publishedAt: 1740030000000,
        body: `## The End of Anonymity in Public Spaces?

Imagine walking into a coffee shop and instantly knowing the name, occupation, and social media handle of everyone inside just by looking at them. This sci-fi reality is inching closer as **Meta Plans Facial Recognition in Smart Glasses**, a move that has reignited a fierce global debate over biometric privacy. This story has surfaced as **top news in tech February 2026**, following leaked internal documents detailing a project codenamed 'Name Tag.' When **Meta Plans Facial Recognition in Smart Glasses**, it signals a pivot from the company's previous cautious stance on biometrics toward a bold—and controversial—new future for wearable AI.

### What is Project 'Name Tag'?

According to reports first surfacing this week, 'Name Tag' is a software layer designed for Ray-Ban Meta and Oakley smart glasses. Unlike previous versions that focused on photography and voice commands, this update utilizes **on-device AI processing** to identify faces in real-time.

The system reportedly offers two tiers of recognition:
1. **Direct Connections:** Identifying people you are already friends with on Facebook or Instagram.
2. **Public Profiles:** Identifying strangers who have opted into public visibility on Meta's platforms.

While Meta claims this will help people 'build stronger connections' and assist the visually impaired in navigating social settings, privacy advocates are calling it a 'surveillance nightmare.'

### The 'Dynamic Political Environment' Leak

Perhaps the most shocking part of this **top news in tech February 2026** is a leaked internal memo from Meta's Reality Labs. The document suggested that Meta chose this moment to launch because civil society groups are 'distracted' by other political crises. This 'calculated rollout' has drawn sharp criticism from the ACLU and EFF, who argue that Meta is trying to sneak a major privacy-eroding feature past regulators.

At The Grid Nexus, we find the timing particularly aggressive. Meta is riding a wave of commercial success, with hardware partner EssilorLuxottica reporting an 18% sales jump this quarter. By adding **facial recognition in smart glasses**, Meta hopes to create a 'moat' against upcoming rivals from Apple and Samsung. If glasses become your primary way of interacting with the world, Meta becomes the ultimate gatekeeper of social identity.

### Technical Hurdles and 'Super Sensing'

It's not just about ID-ing your friends. Meta is also working on a feature called **'Super Sensing'**. This would allow glasses to run the camera continuously (within the limits of battery life) to 'recap' your day. Imagine asking your glasses, 'Where did I meet that guy with the blue hat?' and having the AI pull up his LinkedIn profile.

However, technical and legal challenges remain:
* **The Illinois/Texas Problem:** Strong biometric laws in certain states have previously cost Meta billions in settlements. Reintroducing this tech requires a legal tightrope walk.
* **Spoofing Risks:** Early tests show that high-resolution photos or deepfake masks can still trick the system, raising security concerns for 'Name Tag' users.
* **Consent:** How do you get consent from a bystander who isn't even a Meta user? This remains the largest 'unsolved' ethical question of 2026.

### The Nexus Insight: A Social Interpreter or a Surveillance Tool?

We believe adoption of this technology will be split down generational lines. For Gen Alpha, the idea of 'digital overlays' on the real world is second nature. For older generations, the loss of 'practical anonymity' in public is a terrifying prospect.

In this **top news in tech February 2026** cycle, we are witnessing the death of the 'stranger.' If Meta succeeds, the world becomes a searchable database. Whether that makes us more connected or more paranoid remains to be seen. But one thing is certain: the 'off' switch on our privacy is being replaced by a lens.

### Conclusion: The Looming Regulatory Storm

With lawmakers already signaling inquiries, the 'Name Tag' feature may face a localized rollout or heavy restrictions in the EU. As we continue to track this at The Grid Nexus, we recommend users pay close attention to upcoming 'Privacy Mode' updates in the Meta View app. The future of your face is officially on the table.`,
        wordCount: 1050,
        metaTitle: "Meta Plans Facial Recognition in Smart Glasses: Name Tag Leak | The Grid Nexus",
        seoDescription: "Meta is bringing facial recognition to Ray-Ban smart glasses via 'Name Tag.' Explore the privacy debates and top tech news for February 2026.",
        summary: "Meta's 'Name Tag' project brings facial recognition to smart glasses, sparking intense privacy debates over biometric surveillance in public spaces.",
        estimatedReadingTimeMinutes: 6,
        viewCount: 0,
        isPremium: false,
        securityScore: 5
      }
    ];

    // Insert new articles
    const insertedArticles = [];
    for (const article of articles) {
      const articleId = await ctx.db.insert('content', article);
      insertedArticles.push(articleId);
      console.log(`Inserted top article: ${article.title}`);
    }

    return {
      deleted: existingContent.length,
      inserted: insertedArticles.length,
      articles: insertedArticles
    };
  },
});
