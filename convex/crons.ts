/**
 * Convex Crons – scheduled jobs
 * - news-ingestion: content table (NewsAPI), every 60 minutes
 * - refresh-news-feed: articles table (NewsAPI + GNews), every 30 minutes
 */

import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "news-ingestion",
  { hours: 1 },
  internal.newsIngestor.ingestFromNewsApi
);

crons.interval(
  "refresh-news-feed",
  { minutes: 30 },
  internal.ingest.runIngestion
);

crons.interval(
  "refresh-threat-intel-kev",
  { hours: 6 },
  internal.threatIntelIngest.runKevIngestion
);

crons.interval(
  "refresh-threat-intel-nvd",
  { hours: 6 },
  internal.threatIntelNvdIngest.runNvdIngestion,
  { hoursBack: 24, maxResults: 200 }
);

export default crons;
