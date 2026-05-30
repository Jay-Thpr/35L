// search feature tests
import { test, expect } from '@playwright/test';

test.describe('Search', () => {
  //login before test
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'demo@cinematch.local');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  //verifies results from searching
  test('should search for movies and display results', async ({ page }) => {
    await page.goto('/search');

    //landing state
    await expect(page.locator('.search-page__heading')).toContainText('Find your next film');

    //movie title search
    await page.fill('.search-page__input', 'Inception');
    await page.click('.search-page__submit');

    //movie results
    await expect(page.locator('.search-page__results-title')).toContainText('Inception');
    await expect(page.locator('.search-page__grid')).toBeVisible();
  });

  //verify that a nonsense query shows the empty state UI
  test('should show empty state for nonsense query', async ({ page }) => {
    await page.goto('/search');

    //attempts no-match query
    await page.fill('.search-page__input', 'zzzzzxxxxxnofilmhere');
    await page.click('.search-page__submit');

    //empty container state
    await expect(page.locator('.search-page__empty')).toBeVisible();
    await expect(page.locator('.search-page__empty h2')).toContainText('No movies found');
  });
});
