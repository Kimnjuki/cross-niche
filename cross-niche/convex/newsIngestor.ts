/**
 * News Agency Ingestion Pipeline – Convex Action
 * Fetches from NewsAPI, handles rate limiting, upserts into content via mutation.
 * Triggered by cron every 60 minutes. Run manually from Dashboard: newsIngestor.runNewsIngestion
 */

import { action, internalAction } from "./_generated/server";
import { api } from "./_generated/api";

const NEWSAPI_BASE = "https://newsapi.org/v2";
const RATE_LIMIT_DELAY_MS = 1100; // Free tier: 100 req/day, 1 req/sec – wait between batches

interface NewsApiArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsApiResponse {
  status: string;
  totalResults?: number;
  articles?: NewsApiArticle[];
  code?: string;
  message?: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Maps NewsAPI category to our ingestion category.
 */
const CATEGORY_MAP: Record<string, string> = {
  technology: "technology",
  tech: "technology",
  science: "science",
  business: "business",
  sports: "sports",
  entertainment: "entertainment",
  general: "general",
  health: "health",
};

export const ingestFromNewsApi = internalAction({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.NEWSAPI_API_KEY;
    if (!apiKey) {
      console.warn("NEWSAPI_API_KEY not set – skipping ingestion");
      return { ok: false, reason: "missing_api_key", ingested: 0 };
    }

    const categories = ["technology", "science", "business"] as const;
    let totalIngested = 0;

    for (const category of categories) {
      const url = `${NEWSAPI_BASE}/top-headlines?country=us&category=${category}&pageSize=10&apiKey=${apiKey}`;
      let res: Response;
      try {
        res = await fetch(url);
      } catch (err) {
        console.error("NewsAPI fetch error:", err);
        continue;
      }

      if (res.status === 429) {
        console.warn("NewsAPI rate limit – waiting 60s");
        await sleep(60_000);
        continue;
      }

      let data: NewsApiResponse;
      try {
        data = (await res.json()) as NewsApiResponse;
      } catch {
        continue;
      }

      if (data.status !== "ok" || !Array.isArray(data.articles)) {
        console.warn("NewsAPI error:", data.code, data.message);
        continue;
      }

      const sourceName = category;
      for (const a of data.articles) {
        if (!a?.url || !a?.title) continue;
        const externalId = a.url;
        const body = a.content || a.description || a.title;
        const publishedAt = new Date(a.publishedAt).getTime();

        const result = await ctx.runMutation(api.content.upsertIngestedContent, {
          externalId,
          source: a.source?.name ?? "News",
          originalUrl: a.url,
          title: a.title,
          slug: externalId, // Add required slug field
          body,
          summary: a.description ?? undefined,
          publishedAt,
          authorId: a.author ?? undefined, // Change to authorId
          featuredImageUrl: a.urlToImage ?? undefined, // Change to featuredImageUrl
          status: "published",
        });
        if (result) totalIngested++; // Fix success check
      }

      await sleep(RATE_LIMIT_DELAY_MS);
    }

    return { ok: true, ingested: totalIngested };
  },
});

/**
 * Public action – run manually from Convex Dashboard to test ingestion.
 * Dashboard → Functions → newsIngestor → runNewsIngestion → Run (no args)
 */
export const runNewsIngestion = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.NEWSAPI_API_KEY;
    if (!apiKey) {
      return { ok: false, reason: "missing_api_key", ingested: 0, message: "Set NEWSAPI_API_KEY in Convex Dashboard → Settings → Environment Variables" };
    }

    const categories = ["technology", "science", "business"] as const;
    let totalIngested = 0;
    const errors: string[] = [];

    for (const category of categories) {
      const url = `${NEWSAPI_BASE}/top-headlines?country=us&category=${category}&pageSize=10&apiKey=${apiKey}`;
      let res: Response;
      try {
        res = await fetch(url);
      } catch (err) {
        errors.push(`Fetch error: ${err}`);
        continue;
      }

      const data = (await res.json()) as NewsApiResponse;

      if (data.status !== "ok" || !Array.isArray(data.articles)) {
        errors.push(`NewsAPI: ${data.code ?? "error"} - ${data.message ?? "Unknown"}`);
        if (res.status === 426) {
          errors.push("NewsAPI free tier only allows localhost. Use a paid plan for production.");
        }
        continue;
      }

      for (const a of data.articles) {
        if (!a?.url || !a?.title) continue;
        const result = await ctx.runMutation(api.content.upsertIngestedContent, {
          externalId: a.url,
          source: a.source?.name ?? "News",
          originalUrl: a.url,
          title: a.title,
          slug: a.url, // Use URL as slug
          body: a.content || a.description || a.title,
          summary: a.description ?? undefined,
          publishedAt: new Date(a.publishedAt).getTime(),
          authorId: a.author ?? undefined,
          featuredImageUrl: a.urlToImage ?? undefined,
          status: "published",
        });
        if (result) totalIngested++;
      }
      await sleep(RATE_LIMIT_DELAY_MS);
    }

    return {
      ok: true,
      ingested: totalIngested,
      errors: errors.length ? errors : undefined,
    };
  },
});
