import { test, expect } from "@playwright/test";

/**
 * Blog as seen by a guest. Article content is served from Sanity, so these
 * tests assert on structure (listing renders, a detail page is reachable)
 * rather than on specific article copy.
 */

test.describe("articles", () => {
  test("listing page renders", async ({ page }) => {
    await page.goto("/articles");

    await expect(page).toHaveURL(/\/articles$/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("an article can be opened from the listing", async ({ page }) => {
    // The detail route is force-dynamic and fetches from Sanity, so the first
    // (cold) dev compile can be slow; give it extra headroom.
    test.setTimeout(90_000);

    await page.goto("/articles");

    const href = await page
      .locator('a[href^="/articles/"]')
      .first()
      .getAttribute("href");
    test.skip(!href, "No articles published in Sanity to open.");

    // domcontentloaded avoids blocking on external (Unsplash) article images.
    await page.goto(href!, { waitUntil: "domcontentloaded" });

    await expect(page).toHaveURL(/\/articles\/[^/]+$/);
    await expect(page.getByRole("heading").first()).toBeVisible();
  });
});
