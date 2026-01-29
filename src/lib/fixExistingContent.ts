/**
 * Content is managed in Convex; fix utility is disabled.
 */
export async function fixExistingContent() {
  return {
    success: false,
    error: 'Content is managed in Convex. Use the Convex dashboard.',
    updated: 0,
    linkedToFeeds: 0,
    linkedToNiches: 0,
    visibleCount: 0,
    errors: [] as string[],
  };
}











