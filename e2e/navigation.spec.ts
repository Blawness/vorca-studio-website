import { test, expect } from "@playwright/test";

/**
 * Smoke navigation for a guest visitor: every primary page should be reachable
 * from the header and render its own content. Labels use the default
 * Indonesian (id) locale.
 */

const pages = [
  { nav: "Beranda", path: "/" },
  { nav: "Layanan", path: "/services" },
  { nav: "Portfolio", path: "/portfolio" },
  { nav: "Tentang", path: "/about" },
  { nav: "Untuk Mahasiswa", path: "/students" },
  { nav: "Artikel", path: "/articles" },
  { nav: "Kontak", path: "/contact" },
];

test.describe("guest navigation", () => {
  test("homepage loads with header and footer chrome", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Vorca Studio/i);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Vorca Studio" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  for (const { nav, path } of pages) {
    test(`navigates to ${nav} (${path}) via the header`, async ({ page }) => {
      await page.goto("/");

      await page
        .getByRole("banner")
        .getByRole("link", { name: nav, exact: true })
        .click();

      await expect(page).toHaveURL(new RegExp(`${path.replace("/", "\\/")}$`));
      // Each page renders at least one visible heading.
      await expect(
        page.getByRole("heading").first(),
      ).toBeVisible();
    });
  }

  test("logo returns to the homepage", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("link", { name: "Vorca Studio" }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });
});
