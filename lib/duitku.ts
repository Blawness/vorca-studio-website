import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Duitku payment gateway helpers (sandbox experiment).
 * Docs: https://docs.duitku.com/api
 *
 * Semua signature = HMAC-SHA256 (hex lowercase) dengan apiKey sebagai secret.
 * Metode MD5 lama sudah obsolete.
 */

export const DUITKU_BASE_URL = {
    sandbox: "https://sandbox.duitku.com/webapi",
    production: "https://passport.duitku.com/webapi",
} as const;

export type DuitkuEnv = keyof typeof DUITKU_BASE_URL;

export interface DuitkuConfig {
    merchantCode: string;
    apiKey: string;
    env: DuitkuEnv;
    baseUrl: string;
    callbackUrl?: string;
    returnUrl?: string;
}

/** Throws kalau env belum lengkap. Panggil hanya dari server. */
export function getDuitkuConfig(): DuitkuConfig {
    const merchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;
    const env: DuitkuEnv = process.env.DUITKU_ENV === "production" ? "production" : "sandbox";

    if (!merchantCode || !apiKey) {
        throw new Error("Missing DUITKU_MERCHANT_CODE / DUITKU_API_KEY env vars");
    }

    return {
        merchantCode,
        apiKey,
        env,
        baseUrl: DUITKU_BASE_URL[env],
        callbackUrl: process.env.DUITKU_CALLBACK_URL,
        returnUrl: process.env.DUITKU_RETURN_URL,
    };
}

/** HMAC-SHA256 hex lowercase. */
export function duitkuSignature(stringToSign: string, apiKey: string): string {
    return createHmac("sha256", apiKey).update(stringToSign, "utf8").digest("hex");
}

/** signature = HMAC(merchantCode + merchantOrderId + paymentAmount) — untuk v2/inquiry. */
export function inquirySignature(
    merchantCode: string,
    merchantOrderId: string,
    paymentAmount: number | string,
    apiKey: string
): string {
    return duitkuSignature(`${merchantCode}${merchantOrderId}${paymentAmount}`, apiKey);
}

/** signature = HMAC(merchantCode + merchantOrderId) — untuk transactionStatus. */
export function statusSignature(
    merchantCode: string,
    merchantOrderId: string,
    apiKey: string
): string {
    return duitkuSignature(`${merchantCode}${merchantOrderId}`, apiKey);
}

/** signature = HMAC(merchantcode + amount + datetime) — untuk getpaymentmethod. */
export function paymentMethodSignature(
    merchantCode: string,
    amount: number | string,
    datetime: string,
    apiKey: string
): string {
    return duitkuSignature(`${merchantCode}${amount}${datetime}`, apiKey);
}

function safeEqualHex(a: string, b: string): boolean {
    const bufA = Buffer.from(a.toLowerCase(), "utf8");
    const bufB = Buffer.from(b.toLowerCase(), "utf8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
}

/** Payload callback Duitku (POST x-www-form-urlencoded). */
export interface DuitkuCallbackPayload {
    merchantCode: string;
    amount: string;
    merchantOrderId: string;
    signature: string;
    /** "00" = success, "01" = failed */
    resultCode: string;
    reference?: string;
    paymentCode?: string;
    productDetail?: string;
    additionalParam?: string;
    merchantUserId?: string;
    publisherOrderId?: string;
    spUserHash?: string;
    settlementDate?: string;
    issuerCode?: string;
    customerName?: string;
}

export function parseCallbackForm(form: FormData | URLSearchParams): DuitkuCallbackPayload | null {
    const get = (k: string) => {
        const v = form.get(k);
        return typeof v === "string" ? v : undefined;
    };

    const merchantCode = get("merchantCode");
    const amount = get("amount");
    const merchantOrderId = get("merchantOrderId");
    const signature = get("signature");

    if (!merchantCode || !amount || !merchantOrderId || !signature) return null;

    return {
        merchantCode,
        amount,
        merchantOrderId,
        signature,
        resultCode: get("resultCode") ?? "",
        reference: get("reference"),
        paymentCode: get("paymentCode"),
        productDetail: get("productDetail"),
        additionalParam: get("additionalParam"),
        merchantUserId: get("merchantUserId"),
        publisherOrderId: get("publisherOrderId"),
        spUserHash: get("spUserHash"),
        settlementDate: get("settlementDate"),
        issuerCode: get("issuerCode"),
        customerName: get("customerName"),
    };
}

/**
 * Verifikasi callback: stringToSign = merchantCode + amount + merchantOrderId.
 * Juga memastikan merchantCode-nya milik kita.
 */
export function verifyCallbackSignature(
    payload: DuitkuCallbackPayload,
    config: Pick<DuitkuConfig, "merchantCode" | "apiKey">
): boolean {
    if (payload.merchantCode !== config.merchantCode) return false;
    const expected = duitkuSignature(
        `${payload.merchantCode}${payload.amount}${payload.merchantOrderId}`,
        config.apiKey
    );
    return safeEqualHex(expected, payload.signature);
}

export const DUITKU_SUCCESS = "00";
