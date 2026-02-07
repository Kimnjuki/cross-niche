/**
 * Content is managed in Convex; auto-fix is disabled.
 */
export async function autoFixAndPublishAll(): Promise<{
  success: boolean;
  fixed: number;
  published: number;
  linked: number;
  errors: string[];
}> {
  return {
    success: false,
    fixed: 0,
    published: 0,
    linked: 0,
    errors: ['Content is managed in Convex. Use the Convex dashboard.'],
  };
}










