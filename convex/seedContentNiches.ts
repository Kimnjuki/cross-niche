/**
 * Seed content-niche relationships for existing articles
 */

import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seedContentNiches = mutation({
  handler: async (ctx) => {
    // Get all content
    const allContent = await ctx.db.query('content').collect();
    
    // Get niches
    const techNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 1)).first();
    const securityNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 2)).first();
    const gamingNiche = await ctx.db.query('niches').withIndex('by_id_num', q => q.eq('idNum', 3)).first();

    if (!techNiche || !securityNiche || !gamingNiche) {
      throw new Error('Niches not found in database');
    }

    // Clear existing content-niche relationships
    const existingContentNiches = await ctx.db.query('contentNiches').collect();
    for (const cn of existingContentNiches) {
      await ctx.db.delete(cn._id);
    }

    // Map content to niches based on contentType
    const relationships = [];
    for (const content of allContent) {
      if (content.status !== 'published') continue;

      let nicheId: number;
      if (content.contentType === 'technology') {
        nicheId = techNiche.idNum;
      } else if (content.contentType === 'security') {
        nicheId = securityNiche.idNum;
      } else if (content.contentType === 'gaming') {
        nicheId = gamingNiche.idNum;
      } else if (content.contentType === 'news') {
        // News articles go to security niche for now
        nicheId = securityNiche.idNum;
      } else {
        // Default to tech for other types
        nicheId = techNiche.idNum;
      }

      // Create content-niche relationship
      const relationshipId = await ctx.db.insert('contentNiches', {
        contentId: content._id,
        nicheId: nicheId
      });
      relationships.push(relationshipId);
      console.log(`Linked "${content.title}" to niche ${nicheId}`);
    }

    return {
      relationships: relationships.length,
      contentProcessed: allContent.filter(c => c.status === 'published').length
    };
  },
});
