/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiUpdates from "../aiUpdates.js";
import type * as articles from "../articles.js";
import type * as content from "../content.js";
import type * as crons from "../crons.js";
import type * as guides from "../guides.js";
import type * as import_ from "../import.js";
import type * as ingest from "../ingest.js";
import type * as insertFeaturedArticle from "../insertFeaturedArticle.js";
import type * as newsIngestor from "../newsIngestor.js";
import type * as roadmapVotes from "../roadmapVotes.js";
import type * as securityRatings from "../securityRatings.js";
import type * as seed from "../seed.js";
import type * as verify from "../verify.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiUpdates: typeof aiUpdates;
  articles: typeof articles;
  content: typeof content;
  crons: typeof crons;
  guides: typeof guides;
  import: typeof import_;
  ingest: typeof ingest;
  insertFeaturedArticle: typeof insertFeaturedArticle;
  newsIngestor: typeof newsIngestor;
  roadmapVotes: typeof roadmapVotes;
  securityRatings: typeof securityRatings;
  seed: typeof seed;
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
