import { test, expect } from "@playwright/test";

/**
 * Homepage hero, footer and the floating WhatsApp button as seen by a guest.
 */

test.describe("homepage", () => {
  test("primary CTA links to the contact page", async ({ page }) => {
    await page.goto("/");

    const cta = page.getByRole("link", { name: "Mulai Proyek" });
    await expect(cta).toBeVisible();
    await cta.click();

    await expect(page).toHaveURL(/\/contact$/);
  });

  test("consultation CTA opens WhatsApp in a new tab", async ({ page }) => {
    await page.goto("/");

    const consult = page.getByRole("link", { name: "Jadwalkan Konsultasi" });
    await expect(consult).toBeVisible();
    await expect(consult).toHaveAttribute("href", /wa\.me\/6285167002152/);
    await expect(consult).toHaveAttribute("target", "_blank");
  });

  test("floating WhatsApp button is present with a valid link", async ({
    page,
  }) => {
    await page.goto("/");

    const float = page.getByRole("link", { name: /Konsultasi Sekarang/i });
    await expect(float).toBeVisible();
    await expect(float).toHaveAttribute("href", /wa\.me\/6285167002152/);
    await expect(float).toHaveAttribute("target", "_blank");
  });

  test("footer exposes the contact email", async ({ page }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    // The email link is icon-only, so match it by its mailto href.
    await expect(
      footer.locator('a[href="mailto:marketing@vorcastudio.com"]').first(),
    ).toBeVisible();
  });
});
