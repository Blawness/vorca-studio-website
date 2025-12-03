import { secret } from "encore.dev/config";
import { ContactRequest } from "./submit";

const resendApiKey = secret("ResendApiKey");

export async function sendContactEmail(contact: ContactRequest): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "noreply@vorcastudio.com",
      to: ["marketing@vorcastudio.com"],
      subject: `New Contact Form Submission - ${contact.name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Phone:</strong> ${contact.phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${contact.company || "Not provided"}</p>
        <p><strong>Service Type:</strong> ${contact.serviceType}</p>
        <p><strong>Language:</strong> ${contact.language}</p>
        <p><strong>Message:</strong></p>
        <p>${contact.message}</p>
      `,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send email: ${response.statusText}`);
  }
}
