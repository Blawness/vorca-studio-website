import { api } from "encore.dev/api";
import { contactDB } from "./db";
import { sendContactEmail } from "./email";

export interface ContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceType: string;
  message: string;
  language: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

// Submits a new contact form.
export const submit = api<ContactRequest, ContactResponse>(
  { expose: true, method: "POST", path: "/contact" },
  async (req) => {
    // Validate required fields
    if (!req.name || !req.email || !req.serviceType || !req.message) {
      throw new Error("Missing required fields");
    }

    // Store in database
    await contactDB.exec`
      INSERT INTO contacts (name, email, phone, company, service_type, message, language)
      VALUES (${req.name}, ${req.email}, ${req.phone || null}, ${req.company || null}, ${req.serviceType}, ${req.message}, ${req.language})
    `;

    // Send notification email
    try {
      await sendContactEmail(req);
    } catch (error) {
      console.error("Failed to send email:", error);
      // Don't fail the request if email fails
    }

    return {
      success: true,
      message: req.language === "en" 
        ? "Thank you for your message! We'll get back to you soon."
        : "Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda."
    };
  }
);
