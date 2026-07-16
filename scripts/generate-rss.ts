import { ConvexHttpClient } from "convex/browser";
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { format } from "date-fns";

// Initialize Convex client
const convexUrl = process.env.VITE_CONVEX_URL || "https://your-project.convex.cloud";
const client = new ConvexHttpClient(convexUrl);

// RSS feed template
const generateRSSFeed = (articles: Array<{
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  author?: string;
  category?: string;
}>) => {
  const pubDate = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Grid Nexus</title>
    <link>https://www.thegridnexus.com</link>
    <description>Latest news, reviews, and guides at the intersection of gaming, security, and technology.</description>
    <language>en-us</language>
    <lastBuildDate>${pubDate}</lastBuildDate>
    <atom:link href="https://www.thegridnexus.com/rss.xml" rel="self" type="application/rss+xml" />
    ${articles.map(article => `
      <item>
        <title>${escapeXml(article.title)}</title>
        <link>${article.link}</link>
        <description><![CDATA[${escapeXml(article.description)}]]></description>
        <pubDate>${article.pubDate}</pubDate>
        <guid>${article.guid}</guid>
        ${article.author ? `<author>${escapeXml(article.author)}</author>` : ''}
        ${article.category ? `<category>${escapeXml(article.category)}</category>` : ''}
      </item>
    `).join('')}
  </channel>
</rss>`;
};

const escapeXml = (str: string) => {
  return str.replace(/&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '&apos;');
};

const formatDate = (dateString: number | string) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
  return date.toUTCString();
};

async function main() {
  try {
    // Fetch latest published articles (limit to 50 for RSS)
    const articles = await client.query("content:getAllPublishedContent", {});
    const limitedArticles = articles.slice(0, 50);

    // Map to RSS items
    const rssItems = limitedArticles.map((article: any) => ({
      title: article.title || '',
      link: `https://www.thegridnexus.com/article/${article.slug || article.id}`,
      description: article.excerpt || article.body?.substring(0, 200) || '',
      pubDate: formatDate(article.publishedAt || Date.now()),
      guid: article.id,
      author: article.author || 'The Grid Nexus',
      category: article.niche,
    }));

    const rssXml = generateRSSFeed(rssItems);

    // Write to public/rss.xml
    const outputPath = resolve(process.cwd(), "public/rss.xml");
    await writeFile(outputPath, rssXml, "utf8");
    console.log(`RSS feed generated at ${outputPath}`);
  .*) fail("Failed to generate RSS feed:", error);
 process.exit(1);
 }
}

main();