// e2e tests for auth
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  //verify login page renders correctly and demo login works end-to-end
  test('should show login page and log in with demo credentials', async ({ page }) => {
    await page.goto('/login');
    //check that login page headings are present
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('h2')).toContainText('Log in');


    //fll in demo credentials and submit
    await page.fill('input[type="email"]', 'demo@cinematch.local');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // redirect to home and navbar
    await page.waitForURL('/');
    await expect(page.locator('nav')).toBeVisible();
  });

  //client validation missing password
  test('should show validation error for missing password', async ({ page }) => {
    await page.goto('/login');

    //no password test
    await page.fill('input[type="email"]', 'demo@cinematch.local');
    await page.click('button[type="submit"]');

    // inline error message
    await expect(page.locator('.form-error')).toContainText('Enter your password');
  });

  //shows movie content after login
  test('should navigate to home after login and see movie content', async ({ page }) => {
    await page.goto('/login');
//fills demo credentials
    await page.fill('input[type="email"]', 'demo@cinematch.local');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('/');
    await expect(page.locator('nav')).toBeVisible();
    // Confirm the hero banner (featured movie section) is rendered
    await expect(page.locator('.hero-banner').first()).toBeVisible();
  });
});
