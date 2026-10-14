/**
 * Recovery Navigator (blueprint F02 / T06) — public, published-only read path.
 *
 * Returns a reviewed, published playbook + active official links for a platform
 * and scenario. Never returns drafts, and never invents a support URL.
 * Private progress is intentionally NOT part of this query: the MVP recovery
 * checklist is browser-local (blueprint: "saved cases are optional").
 */
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPublishedPlaybook = query({
  args: { platformSlug: v.string(), scenario: v.string(), locale: v.string() },
  handler: async (ctx, args) => {
    const platform = await ctx.db
      .query("securityEntities")
      .withIndex("by_slug", (q) => q.eq("slug", args.platformSlug))
      .first();
    if (!platform || platform.kind !== "platform" || platform.status !== "active") {
      return null;
    }

    const playbook = await ctx.db
      .query("recoveryPlaybooks")
      .withIndex("by_entity_scenario_locale", (q) =>
        q.eq("entityId", platform._id).eq("scenario", args.scenario).eq("locale", args.locale)
      )
      .first();
    if (!playbook || playbook.status !== "published") {
      return null;
    }

    const links = await ctx.db
      .query("officialLinks")
      .withIndex("by_entity_purpose_locale", (q) => q.eq("entityId", platform._id))
      .collect();

    let steps;
    try {
      steps = JSON.parse(playbook.stepsJson);
    } catch {
      // Corrupt stored steps must never render.
      return null;
    }

    return {
      platform: { slug: platform.slug, name: platform.name },
      playbook: {
        scenario: playbook.scenario,
        version: playbook.version,
        steps,
        reviewedAt: playbook.reviewedAt,
      },
      officialLinks: links
        .filter((l) => l.state === "active" && l.locale === args.locale)
        .map((l) => ({ purpose: l.purpose, url: l.url, verifiedAt: l.verifiedAt })),
    };
  },
});
