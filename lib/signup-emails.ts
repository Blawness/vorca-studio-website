const SITE_URL = "https://www.vorcastudio.com";

export function adminNewRequestEmail(req: {
    id: number;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    note?: string;
}): { subject: string; html: string } {
    return {
        subject: `Pendaftaran klien baru — ${req.name}`,
        html: `
        <h2>Permintaan pendaftaran klien baru</h2>
        <p><strong>Nama:</strong> ${req.name}</p>
        <p><strong>Email:</strong> ${req.email}</p>
        <p><strong>Perusahaan:</strong> ${req.company || "-"}</p>
        <p><strong>No. HP:</strong> ${req.phone || "-"}</p>
        <p><strong>Catatan:</strong></p>
        <p>${req.note || "-"}</p>
        <p><a href="${SITE_URL}/admin/client-requests/${req.id}">Tinjau permintaan di admin</a></p>
      `,
    };
}

export function clientApprovedEmail(opts: {
    locale: "id" | "en";
    name: string;
}): { subject: string; html: string } {
    if (opts.locale === "en") {
        return {
            subject: "Your Vorca Studio account is approved",
            html: `
            <h2>Welcome, ${opts.name}!</h2>
            <p>Your client account has been approved. You can now log in to your project portal.</p>
            <p><a href="${SITE_URL}/portal/login">Log in to the portal</a></p>
          `,
        };
    }
    return {
        subject: "Akun Vorca Studio Anda telah disetujui",
        html: `
        <h2>Selamat datang, ${opts.name}!</h2>
        <p>Akun klien Anda telah disetujui. Anda sekarang bisa masuk ke portal project Anda.</p>
        <p><a href="${SITE_URL}/portal/login">Masuk ke portal</a></p>
      `,
    };
}

export function clientRejectedEmail(opts: {
    locale: "id" | "en";
    name: string;
    reason?: string;
}): { subject: string; html: string } {
    if (opts.locale === "en") {
        return {
            subject: "Update on your Vorca Studio registration",
            html: `
            <h2>Hi ${opts.name},</h2>
            <p>Thank you for your interest. We're unable to approve your registration at this time.</p>
            ${opts.reason ? `<p><strong>Note:</strong> ${opts.reason}</p>` : ""}
            <p>If you think this is a mistake, please contact us.</p>
          `,
        };
    }
    return {
        subject: "Kabar mengenai pendaftaran Vorca Studio Anda",
        html: `
        <h2>Halo ${opts.name},</h2>
        <p>Terima kasih atas minat Anda. Saat ini kami belum bisa menyetujui pendaftaran Anda.</p>
        ${opts.reason ? `<p><strong>Catatan:</strong> ${opts.reason}</p>` : ""}
        <p>Jika Anda merasa ini keliru, silakan hubungi kami.</p>
      `,
    };
}
