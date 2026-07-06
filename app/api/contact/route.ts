import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

interface ContactRequest {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceType: string;
    message: string;
    language: string;
}

async function sendContactEmail(contact: ContactRequest): Promise<void> {
    await sendEmail({
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
    });
}

export async function POST(request: NextRequest) {
    try {
        const body: ContactRequest = await request.json();

        // Validate required fields
        if (!body.name || !body.email || !body.serviceType || !body.message) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Send notification email
        try {
            await sendContactEmail(body);
        } catch (error) {
            console.error("Failed to send email:", error);
            // Don't fail the request if email fails
        }

        const message = body.language === "en"
            ? "Thank you for your message! We'll get back to you soon."
            : "Terima kasih atas pesan Anda! Kami akan segera menghubungi Anda.";

        return NextResponse.json({ success: true, message });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to process request" },
            { status: 500 }
        );
    }
}
