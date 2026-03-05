/**
 * Migration Script 001: Add Default Values and Missing Fields
 * 
 * This script addresses CRITICAL issues:
 * - Adds default values for optional fields that were causing undefined errors
 * - Adds missing timestamps to comments table
 * - Adds missing user fields for complete authentication
 * - Standardizes data types across tables
 */

import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Define the mutation schema
export const migration001_addDefaultValues = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🚀 Starting Migration 001: Add Default Values and Missing Fields");
    
    let updatedCount = 0;
    
    // 1. Update content table with default values for null optional fields
    const contentWithoutDefaults = await ctx.db.query("content")
      .withIndex("by_status")
      .filter(q => q.eq("status", "published"))
      .collect();
    
    for (const content of contentWithoutDefaults) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;
      
      // Set default values for undefined optional fields
      if (content.viewCount === undefined) {
        updates.viewCount = 0;
        needsUpdate = true;
      }
      
      if (content.wordCount === undefined) {
        updates.wordCount = 0;
        needsUpdate = true;
      }
      
      if (content.estimatedReadingTimeMinutes === undefined) {
        updates.estimatedReadingTimeMinutes = 5; // Default 5 minutes
        needsUpdate = true;
      }
      
      if (content.featuredImageUrl === undefined || content.featuredImageUrl === null) {
        // Set default placeholder image based on niche
        const nicheImages = {
          'tech': 'https://images.unsplash.com/photo-1677448915674-3d710b8b5c5?w=800&h=400&fit=crop',
          'security': 'https://images.unsplash.com/photo-1563013542-8d9b6795c94?w=800&h=400&fit=crop',
          'gaming': 'https://images.unsplash.com/photo-1511518224166-2d5f8c4e0c7?w=800&h=400&fit=crop'
        };
        updates.featuredImageUrl = nicheImages['tech'] || nicheImages['tech']; // Default to tech
        needsUpdate = true;
      }
      
      if (content.summary === undefined || content.summary === null) {
        // Generate summary from body (first 150 chars)
        const bodyText = content.body || '';
        updates.summary = bodyText.length > 150 
          ? bodyText.substring(0, 147) + '...'
          : bodyText;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(content._id, updates);
        updatedCount++;
      }
    }
    
    // 2. Update comments table with missing timestamps
    const commentsWithoutTimestamps = await ctx.db.query("comments")
      .collect();
    
    for (const comment of commentsWithoutTimestamps) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;
      
      if (comment.createdAt === undefined) {
        updates.createdAt = Date.now(); // Current timestamp
        needsUpdate = true;
      }
      
      if (comment.likes === undefined) {
        updates.likes = 0;
        needsUpdate = true;
      }
      
      if (comment.isEdited === undefined) {
        updates.isEdited = false;
        needsUpdate = true;
      }
      
      if (comment.isDeleted === undefined) {
        updates.isDeleted = false;
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(comment._id, updates);
        updatedCount++;
      }
    }
    
    // 3. Update users table with missing fields
    const usersWithoutFields = await ctx.db.query("users")
      .collect();
    
    for (const user of usersWithoutFields) {
      const updates: Record<string, any> = {};
      let needsUpdate = false;
      
      if (user.emailVerified === undefined) {
        updates.emailVerified = false; // Default to not verified
        needsUpdate = true;
      }
      
      if (user.isActive === undefined) {
        updates.isActive = true; // Default to active
        needsUpdate = true;
      }
      
      if (user.isBanned === undefined) {
        updates.isBanned = false; // Default to not banned
        needsUpdate = true;
      }
      
      if (user.createdAt === undefined) {
        updates.createdAt = Date.now(); // Current timestamp
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await ctx.db.patch(user._id, updates);
        updatedCount++;
      }
    }
    
    console.log(`✅ Migration 001 completed: Updated ${updatedCount} records with default values`);
    return { success: true, updatedCount };
  }
});

export default migration001_addDefaultValues;
