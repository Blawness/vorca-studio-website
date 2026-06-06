import { test, expect } from "@playwright/test";

/**
 * Guest contact form. The /api/contact route returns a success response even
 * without RESEND_API_KEY configured (it just skips the email), so the happy
 * path is exercisable in local/CI environments without secrets.
 */

test.describe("contact form", () => {
  test("renders all expected fields", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();
    await expect(page.locator("#company")).toBeVisible();
    await expect(page.locator("#message")).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Kirim Pesan" }),
    ).toBeVisible();
  });

  test("shows a validation error when the service is missing", async ({
    page,
  }) => {
    await page.goto("/contact");

    // Fill the natively-required fields so the browser lets the form submit,
    // but leave the (non-native) service Select empty to hit the JS guard.
    await page.locator("#name").fill("Guest Tester");
    await page.locator("#email").fill("guest@example.com");
    await page.locator("#message").fill("Halo, saya ingin konsultasi.");

    await page.getByRole("button", { name: "Kirim Pesan" }).click();

    // Toast copy renders both in the visible region and an aria-live mirror.
    await expect(
      page.getByText("Please fill in all required fields.").first(),
    ).toBeVisible();
  });

  test("submits successfully with valid input", async ({ page }) => {
    await page.goto("/contact");

    await page.locator("#name").fill("Guest Tester");
    await page.locator("#email").fill("guest@example.com");
    await page.locator("#phone").fill("08123456789");
    await page.locator("#message").fill("Halo, saya ingin konsultasi proyek.");

    // Radix Select: open and choose the first available service.
    await page.getByRole("combobox").click();
    await page.getByRole("option").first().click();

    await page.getByRole("button", { name: "Kirim Pesan" }).click();

    // Success toast (Indonesian copy returned by /api/contact).
    await expect(
      page.getByText(/Terima kasih atas pesan Anda/i).first(),
    ).toBeVisible();

    // Form resets after a successful submission.
    await expect(page.locator("#name")).toHaveValue("");
  });
});
