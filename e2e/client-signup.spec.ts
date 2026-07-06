import { test, expect } from "@playwright/test";

// A unique email per run so reruns don't collide.
const unique = `signup-${Date.now()}@example.com`;

test("visitor submits a registration request", async ({ page }) => {
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', "Test Registrant");
    await page.fill('input[name="email"]', unique);
    await page.fill('input[name="password"]', "supersecret1");
    await page.fill('input[name="confirmPassword"]', "supersecret1");
    await page.fill('input[name="company"]', "Test Co");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal\/register\?success=1/);
    await expect(page.getByText(/Awaiting admin approval|Menunggu persetujuan admin/)).toBeVisible();
});

test("registering with an existing user email is rejected generically", async ({ page }) => {
    // `pnpm seed:client` creates a user client@example.com — reuse it as an existing account.
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', "Dup");
    await page.fill('input[name="email"]', "client@example.com");
    await page.fill('input[name="password"]', "supersecret1");
    await page.fill('input[name="confirmPassword"]', "supersecret1");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal\/register\?error=exists/);
    await expect(page.getByText(/already registered or is being processed|sudah terdaftar atau sedang diproses/)).toBeVisible();
});
