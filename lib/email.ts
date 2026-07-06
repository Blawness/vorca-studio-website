const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "noreply@vorcastudio.com";

/**
 * Send an email via Resend's REST API. If RESEND_API_KEY is unset this is a
 * logged no-op (dev/test). Throws on a non-OK response so callers can decide
 * whether to swallow it (they should — email is best-effort).
 */
export async function sendEmail(opts: {
    to: string | string[];
    subject: string;
    html: string;
}): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("RESEND_API_KEY not configured, skipping email:", opts.subject);
        return;
    }

    const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM,
            to: Array.isArray(opts.to) ? opts.to : [opts.to],
            subject: opts.subject,
            html: opts.html,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to send email: ${res.status} ${res.statusText}`);
    }
}
