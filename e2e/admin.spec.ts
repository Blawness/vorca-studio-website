import { test, expect } from "@playwright/test";

test.describe("Admin area", () => {
    test("login page renders", async ({ page }) => {
        await page.goto("/admin/login");
        await expect(
            page.getByRole("heading", { name: /masuk admin/i }),
        ).toBeVisible();
        await expect(page.locator('input[type="email"]')).toBeVisible();
        await expect(page.locator('input[type="password"]')).toBeVisible();
        await expect(
            page.getByRole("button", { name: /masuk|sign in|login/i }),
        ).toBeVisible();
    });

    test("unauthenticated /admin redirects to login", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/admin\/login/);
    });

    test("login with valid credentials reaches dashboard", async ({ page }) => {
        const email = process.env.ADMIN_EMAIL ?? "admin@vorcastudio.com";
        const password = process.env.ADMIN_PASSWORD;

        test.skip(!password, "Set ADMIN_PASSWORD env var to run admin login test");

        await page.goto("/admin/login");
        await page.locator('input[type="email"]').fill(email);
        await page.locator('input[type="password"]').fill(password!);
        await page
            .getByRole("button", { name: /masuk|sign in|login/i })
            .click();

        await expect(page).toHaveURL(/\/admin(?!\/login)/);
        await expect(page.getByRole("heading")).toBeVisible();
    });
});
