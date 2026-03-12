import { internalAction } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { ROADMAP_PHASES, NICHE_CATEGORY_MAP } from "../roadmapData";

export const seedRoadmapFeatures = internalAction({
  args: {},
  handler: async (ctx) => {
    for (const phase of ROADMAP_PHASES) {
      for (const feature of phase.features) {
        const existing = await ctx.runQuery(api.content.getContentBySlug, { slug: feature.contentSlug });
        if (existing) continue;

        const contentId = await ctx.runMutation(api.content.upsertIngestedContent, {
          title: feature.name,
          slug: feature.contentSlug,
          body: feature.description,
          summary: feature.tagline,
          contentType: "feature",
          source: "roadmap",
          externalId: `roadmap:${feature.featureId}`,
          featuredImageUrl: undefined,
          authorId: undefined,
          publishedAt: Date.now(),
          isAutomated: true,
          status: "published",
        });

        await ctx.runMutation(api.content.updateSEOFields, {
          contentId,
          metaTitle: feature.metaTitle,
          seoDescription: feature.seoDescription,
          focusKeyword: feature.focusKeyword,
          schema_org: { "@type": feature.schemaType },
        });

        const nicheId = NICHE_CATEGORY_MAP[feature.category] ?? 1;
        await ctx.runMutation(internal.roadmapInternal.ensureNicheLink, {
          contentId,
          nicheId,
        });

        for (const tagSlug of feature.tags) {
          await ctx.runMutation(internal.roadmapInternal.ensureTagLink, {
            contentId,
            tagSlug,
          });
        }
      }
    }

    return { success: true };
  },
});
