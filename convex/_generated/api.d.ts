/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as admin_seedRoadmap from "../admin/seedRoadmap.js";
import type * as aiAutomation from "../aiAutomation.js";
import type * as aiUpdates from "../aiUpdates.js";
import type * as articles from "../articles.js";
import type * as bookmarks from "../bookmarks.js";
import type * as cleanAndSeedArticles from "../cleanAndSeedArticles.js";
import type * as comments from "../comments.js";
import type * as content from "../content.js";
import type * as crons from "../crons.js";
import type * as feeds from "../feeds.js";
import type * as gamification from "../gamification.js";
import type * as guides from "../guides.js";
import type * as import_ from "../import.js";
import type * as ingest from "../ingest.js";
import type * as insertFeaturedArticle from "../insertFeaturedArticle.js";
import type * as migrations_001_add_default_values from "../migrations/001_add_default_values.js";
import type * as migrations_005_normalize_existing_data from "../migrations/005_normalize_existing_data.js";
import type * as newsIngestor from "../newsIngestor.js";
import type * as newsletter from "../newsletter.js";
import type * as roadmap from "../roadmap.js";
import type * as roadmapData from "../roadmapData.js";
import type * as roadmapInternal from "../roadmapInternal.js";
import type * as roadmapVotes from "../roadmapVotes.js";
import type * as securityRatings from "../securityRatings.js";
import type * as seed from "../seed.js";
import type * as seedAllFiveArticles from "../seedAllFiveArticles.js";
import type * as seedFeaturedArticles from "../seedFeaturedArticles.js";
import type * as seedTopArticles from "../seedTopArticles.js";
import type * as semanticSearch from "../semanticSearch.js";
import type * as seoOptimization from "../seoOptimization.js";
import type * as threatAlerts from "../threatAlerts.js";
import type * as threatIntel from "../threatIntel.js";
import type * as threatIntelIngest from "../threatIntelIngest.js";
import type * as threatIntelNvdIngest from "../threatIntelNvdIngest.js";
import type * as users from "../users.js";
import type * as verify from "../verify.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  "admin/seedRoadmap": typeof admin_seedRoadmap;
  aiAutomation: typeof aiAutomation;
  aiUpdates: typeof aiUpdates;
  articles: typeof articles;
  bookmarks: typeof bookmarks;
  cleanAndSeedArticles: typeof cleanAndSeedArticles;
  comments: typeof comments;
  content: typeof content;
  crons: typeof crons;
  feeds: typeof feeds;
  gamification: typeof gamification;
  guides: typeof guides;
  import: typeof import_;
  ingest: typeof ingest;
  insertFeaturedArticle: typeof insertFeaturedArticle;
  "migrations/001_add_default_values": typeof migrations_001_add_default_values;
  "migrations/005_normalize_existing_data": typeof migrations_005_normalize_existing_data;
  newsIngestor: typeof newsIngestor;
  newsletter: typeof newsletter;
  roadmap: typeof roadmap;
  roadmapData: typeof roadmapData;
  roadmapInternal: typeof roadmapInternal;
  roadmapVotes: typeof roadmapVotes;
  securityRatings: typeof securityRatings;
  seed: typeof seed;
  seedAllFiveArticles: typeof seedAllFiveArticles;
  seedFeaturedArticles: typeof seedFeaturedArticles;
  seedTopArticles: typeof seedTopArticles;
  semanticSearch: typeof semanticSearch;
  seoOptimization: typeof seoOptimization;
  threatAlerts: typeof threatAlerts;
  threatIntel: typeof threatIntel;
  threatIntelIngest: typeof threatIntelIngest;
  threatIntelNvdIngest: typeof threatIntelNvdIngest;
  users: typeof users;
  verify: typeof verify;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
