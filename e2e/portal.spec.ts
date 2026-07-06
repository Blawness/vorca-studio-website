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
    // Wait for an actual departure from the login route (not just a URL that
    // still matches "/portal*", which /portal/login itself would satisfy).
    await page.waitForURL((url: URL) => !url.pathname.includes("/login"), { timeout: 15000 });
}

test("unauthenticated portal access redirects to login", async ({ page }) => {
    await page.goto("/portal");
    await expect(page).toHaveURL(/\/portal\/login/);
});

test("client logs in and sees their project", async ({ page }) => {
    await login(page);
    await expect(page.getByText("Sample Website Project")).toBeVisible();
});

test("client sees project dashboard sections", async ({ page }) => {
    await login(page);
    await page.goto("/portal/seed-project-001");
    await expect(page.getByText("Sample Website Project")).toBeVisible();
    await expect(page.getByText("Homepage design")).toBeVisible(); // a deliverable
});

test("ownership gate: bogus slug is not found", async ({ page }) => {
    await login(page);
    await page.goto("/portal/does-not-exist-000");
    // This app has cacheComponents:true (PPR): the root layout has no dynamic
    // data, so Next streams it as a static shell with a 200 status before the
    // dynamic notFound() thrown deep in the [slug] page resolves — the outer
    // HTTP status can't be retroactively flipped to 404 once that shell has
    // flushed. So we assert on the rendered not-found UI (app/not-found.tsx)
    // rather than the response status, which is the meaningful behavior here:
    // the client's project data for a project they don't own never renders.
    await expect(page.getByText(/swam too far|berenang terlalu jauh/i)).toBeVisible();
    await expect(page.getByText("Sample Website Project")).not.toBeVisible();
});

test("client approves a deliverable", async ({ page }) => {
    await login(page);
    await page.goto("/portal/seed-project-001");
    await page.getByRole("button", { name: /Approve|Setujui/ }).first().click();
    await expect(page.getByText(/Approved|Disetujui/).first()).toBeVisible();
});
