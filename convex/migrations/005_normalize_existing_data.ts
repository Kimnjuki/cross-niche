import { mutation } from "../_generated/server";

export default mutation(async ({ db }) => {
  console.log("Starting data normalization...");
  
  // Fix users missing createdAt
  const allUsers = await db.query("users").collect();
  let usersFixed = 0;
  
  for (const user of allUsers) {
    if (!user.createdAt) {
      await db.patch(user._id, {
        createdAt: user._creationTime, // Use system creation time
      });
      usersFixed++;
    }
  }
  
  console.log(`Fixed ${usersFixed} users with missing createdAt`);
  
  // Validate content types
  const allContent = await db.query("content").collect();
  const validTypes = [
    "article", "review", "guide", "news", "opinion",
    "technology", "security", "gaming", "feature", "tutorial"
  ];
  
  let contentFixed = 0;
  for (const content of allContent) {
    if (content.contentType && !validTypes.includes(content.contentType)) {
      // Map old types to new types or set default
      await db.patch(content._id, {
        contentType: "article", // Default fallback
      });
      contentFixed++;
    }
  }
  
  console.log(`Fixed ${contentFixed} content items with invalid contentType`);
  
  return { 
    usersFixed,
    contentFixed,
    totalUsers: allUsers.length,
    totalContent: allContent.length,
  };
});
