/**
 * Ingest Hub: normalizes NewsAPI + GNews into a single format and saves via articles.saveArticle.
 * Scheduled by cron every 30 minutes.
 *
 * Convex environment variables (Dashboard → Settings → Environment Variables):
 *   - NEWS_API_KEY or NEWSAPI_API_KEY  (NewsAPI, https://newsapi.org)
 *   - GNEWS_API_KEY                    (GNews, https://gnews.io)
 *
 * Run once manually: Dashboard → Functions → ingest → runIngestionPublic → Run
 */

import { action, internalAction, type ActionCtx } from "./_generated/server";
import { api } from "./_generated/api";

const NEWSAPI_BASE = "https://newsapi.org/v2";
const GNEWS_BASE = "https://gnews.io/api/v4";

interface NormalizedArticle {
  title: string;
  url: string;
  summary: string;
  source: string;
  imageUrl?: string;
  publishedAt: number;
}

async function runIngestionLogic(
  ctx: ActionCtx
): Promise<{ ok: boolean; ingested: number; errors?: string[] }> {
  const NEWS_KEY = process.env.NEWS_API_KEY ?? process.env.NEWSAPI_API_KEY;
  const GNEWS_KEY = process.env.GNEWS_API_KEY;
  const errors: string[] = [];
  let ingested = 0;

  const allArticles: NormalizedArticle[] = [];

  if (NEWS_KEY) {
    try {
      const res = await fetch(
        `${NEWSAPI_BASE}/top-headlines?category=technology&pageSize=30&apiKey=${NEWS_KEY}`
      );
      const data = (await res.json()) as {
        status?: string;
        articles?: Array<{
          title?: string;
          url?: string;
          description?: string;
          source?: { name?: string };
          urlToImage?: string;
          publishedAt?: string;
        }>;
        code?: string;
        message?: string;
      };
      if (data.status === "ok" && Array.isArray(data.articles)) {
        for (const a of data.articles) {
          if (!a?.url || !a?.title) continue;
          allArticles.push({
            title: a.title,
            url: a.url,
            summary: a.description ?? "",
            source: a.source?.name ?? "NewsAPI",
            imageUrl: a.urlToImage ?? undefined,
            publishedAt: new Date(a.publishedAt ?? 0).getTime(),
          });
        }
      } else {
        errors.push(`NewsAPI: ${data.code ?? "error"} - ${data.message ?? "Unknown"}`);
      }
    } catch (e) {
      errors.push(`NewsAPI fetch: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    errors.push("NEWS_API_KEY (or NEWSAPI_API_KEY) not set");
  }

  if (GNEWS_KEY) {
    try {
      const res = await fetch(
        `${GNEWS_BASE}/top-headlines?category=technology&max=30&apikey=${GNEWS_KEY}`
      );
      const data = (await res.json()) as {
        articles?: Array<{
          title?: string;
          url?: string;
          description?: string;
          source?: { name?: string };
          image?: string;
          publishedAt?: string;
        }>;
        errors?: Array<{ message?: string }>;
      };
      if (Array.isArray(data.articles)) {
        for (const a of data.articles) {
          if (!a?.url || !a?.title) continue;
          allArticles.push({
            title: a.title,
            url: a.url,
            summary: a.description ?? "",
            source: a.source?.name ?? "GNews",
            imageUrl: a.image ?? undefined,
            publishedAt: new Date(a.publishedAt ?? 0).getTime(),
          });
        }
      } else if (data.errors?.length) {
        errors.push(`GNews: ${data.errors.map((e) => e.message).join(", ")}`);
      }
    } catch (e) {
      errors.push(`GNews fetch: ${e instanceof Error ? e.message : String(e)}`);
    }
  } else {
    errors.push("GNEWS_API_KEY not set");
  }

  for (const article of allArticles) {
    try {
      await ctx.runMutation(api.articles.saveArticle, article);
      ingested++;
    } catch {
      // saveArticle is no-op on duplicate URL; count only new inserts if needed
    }
  }

  return {
    ok: errors.length === 0 || ingested > 0,
    ingested,
    errors: errors.length ? errors : undefined,
  };
}

export const runIngestion = internalAction({
  args: {},
  handler: async (ctx) => {
    return runIngestionLogic(ctx);
  },
});

/** Public action for manual run from Convex Dashboard. */
export const runIngestionPublic = action({
  args: {},
  handler: async (ctx) => {
    return runIngestionLogic(ctx);
  },
});
