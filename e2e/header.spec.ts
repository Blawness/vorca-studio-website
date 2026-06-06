import { test, expect } from "@playwright/test";

/**
 * Header behaviour available to guests: the bilingual (id/en) language toggle.
 * Default locale is Indonesian; toggling switches every nav label to English.
 */

test.describe("language toggle", () => {
  test("switches navigation labels between Indonesian and English", async ({
    page,
  }) => {
    await page.goto("/");

    const header = page.getByRole("banner");
    const toggle = header.getByRole("button", { name: /^(ID|EN)$/ });

    // Default state: Indonesian.
    await expect(toggle).toHaveText(/ID/);
    await expect(
      header.getByRole("link", { name: "Beranda", exact: true }),
    ).toBeVisible();

    // Switch to English.
    await toggle.click();
    await expect(toggle).toHaveText(/EN/);
    await expect(
      header.getByRole("link", { name: "Home", exact: true }),
    ).toBeVisible();
    await expect(
      header.getByRole("link", { name: "Contact", exact: true }),
    ).toBeVisible();

    // Switch back to Indonesian.
    await toggle.click();
    await expect(toggle).toHaveText(/ID/);
    await expect(
      header.getByRole("link", { name: "Kontak", exact: true }),
    ).toBeVisible();
  });
});
