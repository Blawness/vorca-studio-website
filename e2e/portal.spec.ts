import { test, expect } from "@playwright/test";

// Assumes `pnpm seed:client` has run: client@example.com / client-password-123
// owns project slug "seed-project-001".
const EMAIL = "client@example.com";
const PASSWORD = "client-password-123";

async function login(page) {
    await page.goto("/portal/login");
    await page.fill('input[name="email"]', EMAIL);
    await page.fill('input[name="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/portal(\/.*)?$/);
}

test("unauthenticated portal access redirects to login", async ({ page }) => {
    await page.goto("/portal");
    await expect(page).toHaveURL(/\/portal\/login/);
});

test("client logs in and sees their project", async ({ page }) => {
    await login(page);
    // Single-project auto-redirect (Task 9): the seeded client owns exactly one
    // project, so /portal redirects straight to its detail page. That page
    // doesn't exist until Task 10, so we assert the URL here; Task 10 restores
    // the visible-name assertion.
    await expect(page).toHaveURL(/\/portal\/seed-project-001/);
});
