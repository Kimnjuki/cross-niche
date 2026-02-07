import { test, expect } from '@playwright/test';

test.describe('Article Page Unified Resolution', () => {
  test('should load a mock article directly without crashing', async ({ page }) => {
    await page.goto('/article/tech-1');

    // 1. Verify we don't see the "Not Found" UI
    await expect(page.locator('h1')).not.toHaveText('Article Not Found');

    // 2. Verify specific mock content is visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('article')).toContainText('min read');
  });

  test('should show 404 UI for a non-existent slug', async ({ page }) => {
    await page.goto('/article/this-slug-does-not-exist-12345');

    await expect(page.getByText('Article Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Go Home' })).toBeVisible();
  });

  test('should navigate from home to full view successfully', async ({ page }) => {
    await page.goto('/');

    const firstArticle = page.locator('a[href^="/article/"]').first();
    const articleHref = await firstArticle.getAttribute('href');

    await firstArticle.click();

    await expect(page).toHaveURL(expect.stringContaining(articleHref ?? '/article/'));

    await expect(page.locator('h1')).toBeVisible();
  });
});
