import { NextRequest, NextResponse } from "next/server";
import {
    getDuitkuConfig,
    parseCallbackForm,
    verifyCallbackSignature,
} from "@/lib/duitku";
import { applyCallback } from "@/lib/payments";

// Catatan: repo ini pakai `cacheComponents`, jadi route segment config
// (`runtime` / `dynamic`) DILARANG di sini. Node runtime sudah default, dan
// route handler POST yang baca body memang selalu dinamis.

/**
 * POST /callback — Duitku payment callback (x-www-form-urlencoded).
 *
 * Kontrak Duitku:
 * - Balas HTTP 200 secepatnya, kalau tidak Duitku akan retry.
 * - Callback bisa terkirim lebih dari sekali → handler harus idempoten.
 * - Status pembayaran hanya boleh dipercaya dari sini (atau transactionStatus API),
 *   TIDAK dari returnUrl.
 */
export async function POST(request: NextRequest) {
    let config;
    try {
        config = getDuitkuConfig();
    } catch (error) {
        console.error("[duitku:callback] config error", error);
        // 500 → Duitku retry setelah env dibenerin.
        return new NextResponse("Misconfigured", { status: 500 });
    }

    let form: FormData | URLSearchParams;
    try {
        const contentType = request.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
            const json = (await request.json()) as Record<string, unknown>;
            form = new URLSearchParams(
                Object.entries(json).map(([k, v]) => [k, String(v ?? "")])
            );
        } else {
            form = await request.formData();
        }
    } catch (error) {
        console.error("[duitku:callback] unparsable body", error);
        return new NextResponse("Bad Request", { status: 400 });
    }

    const payload = parseCallbackForm(form);
    if (!payload) {
        console.warn("[duitku:callback] missing required fields");
        return new NextResponse("Bad Request", { status: 400 });
    }

    if (!verifyCallbackSignature(payload, config)) {
        console.warn("[duitku:callback] invalid signature", {
            merchantOrderId: payload.merchantOrderId,
            merchantCode: payload.merchantCode,
        });
        return new NextResponse("Invalid signature", { status: 400 });
    }

    const base = {
        env: config.env,
        merchantOrderId: payload.merchantOrderId,
        reference: payload.reference,
        publisherOrderId: payload.publisherOrderId,
        amount: payload.amount,
        paymentCode: payload.paymentCode,
        resultCode: payload.resultCode,
    };

    try {
        const outcome = await applyCallback(payload);

        switch (outcome.kind) {
            case "applied":
                console.info("[duitku:callback] applied", { ...base, status: outcome.status });
                break;
            case "already_settled":
                // Callback duplikat — normal, tetap 200 biar Duitku berhenti retry.
                console.info("[duitku:callback] duplicate ignored", {
                    ...base,
                    status: outcome.status,
                });
                break;
            case "unknown_order":
                // Signature valid tapi order tak dikenal. Sudah tercatat di payment_events.
                console.warn("[duitku:callback] unknown order", base);
                break;
            case "amount_mismatch":
                console.error("[duitku:callback] AMOUNT MISMATCH", {
                    ...base,
                    expected: outcome.expected,
                    received: outcome.received,
                });
                break;
        }
    } catch (error) {
        // Gagal nulis DB → balas 500 supaya Duitku retry, jangan sampai pembayaran hilang.
        console.error("[duitku:callback] persist failed", {
            ...base,
            error: error instanceof Error ? error.message : error,
        });
        return new NextResponse("Retry later", { status: 500 });
    }

    return new NextResponse("OK", { status: 200 });
}

export async function GET() {
    // Bikin gampang ngecek endpoint hidup tanpa bocorin apa-apa.
    return NextResponse.json(
        { ok: true, message: "Duitku callback endpoint. Use POST." },
        { status: 405, headers: { Allow: "POST" } }
    );
}
