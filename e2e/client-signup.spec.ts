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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test("admin approves a request and the new client can log in", async ({ page }) => {
    test.skip(!ADMIN_PASSWORD, "Set ADMIN_PASSWORD (and seed the admin) to run this test");

    const email = `approve-${Date.now()}@example.com`;
    const name = `Approve Me ${Date.now()}`;
    const password = "supersecret1";

    // 1. Visitor registers.
    await page.goto("/portal/register");
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/success=1/);

    // 2. Admin logs in and approves.
    await page.goto("/admin/login");
    await page.locator('input[type="email"]').fill(ADMIN_EMAIL);
    await page.locator('input[type="password"]').fill(ADMIN_PASSWORD!);
    await page.getByRole("button", { name: /masuk|sign in|login/i }).click();
    await expect(page).toHaveURL(/\/admin(?!\/login)/);

    await page.goto("/admin/client-requests");
    await page.getByRole("link", { name }).click();
    await page.getByRole("button", { name: "Approve" }).click();
    await expect(page).toHaveURL(/client-requests\?success=approved/);

    // 3. Log the admin out, then the new client logs in.
    await page.context().clearCookies();
    await page.goto("/portal/login");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/portal(\/.*)?$/);
});
