import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { paymentEvents, payments } from "@/db/schema";
import type { DuitkuCallbackPayload } from "@/lib/duitku";
import { DUITKU_SUCCESS } from "@/lib/duitku";

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export interface CreatePaymentInput {
    merchantOrderId: string;
    amount: number;
    productDetails?: string;
    customerEmail?: string;
    paymentMethod?: string;
    projectId?: number;
    userId?: number;
    expiresAt?: Date;
}

/** Bikin row `pending` sebelum manggil inquiry ke Duitku. */
export async function createPendingPayment(input: CreatePaymentInput) {
    const [row] = await db
        .insert(payments)
        .values({
            merchantOrderId: input.merchantOrderId,
            amount: input.amount,
            productDetails: input.productDetails,
            customerEmail: input.customerEmail,
            paymentMethod: input.paymentMethod,
            projectId: input.projectId,
            userId: input.userId,
            expiresAt: input.expiresAt,
            status: "pending",
        })
        .returning();
    return row;
}

export async function getPaymentByOrderId(merchantOrderId: string) {
    const [row] = await db
        .select()
        .from(payments)
        .where(eq(payments.merchantOrderId, merchantOrderId))
        .limit(1);
    return row ?? null;
}

/** Simpan hasil inquiry (paymentUrl / vaNumber / reference) ke row pending. */
export async function attachInquiryResult(
    merchantOrderId: string,
    data: { reference?: string; paymentUrl?: string; vaNumber?: string; paymentMethod?: string }
) {
    await db
        .update(payments)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(payments.merchantOrderId, merchantOrderId));
}

export async function recordPaymentEvent(event: {
    paymentId?: number | null;
    merchantOrderId: string;
    source: "callback" | "status_check" | "inquiry";
    resultCode?: string | null;
    signatureValid: boolean;
    payload: unknown;
}) {
    await db.insert(paymentEvents).values({
        paymentId: event.paymentId ?? null,
        merchantOrderId: event.merchantOrderId,
        source: event.source,
        resultCode: event.resultCode ?? null,
        signatureValid: event.signatureValid,
        payload: event.payload as object,
    });
}

export type CallbackOutcome =
    | { kind: "applied"; status: PaymentStatus }
    | { kind: "already_settled"; status: PaymentStatus }
    | { kind: "unknown_order" }
    | { kind: "amount_mismatch"; expected: number; received: number };

/**
 * Terapkan callback ke tabel payments. Idempoten:
 * update hanya jalan kalau row masih `pending`, jadi callback duplikat aman.
 */
export async function applyCallback(payload: DuitkuCallbackPayload): Promise<CallbackOutcome> {
    const existing = await getPaymentByOrderId(payload.merchantOrderId);

    if (!existing) {
        await recordPaymentEvent({
            merchantOrderId: payload.merchantOrderId,
            source: "callback",
            resultCode: payload.resultCode,
            signatureValid: true,
            payload,
        });
        return { kind: "unknown_order" };
    }

    await recordPaymentEvent({
        paymentId: existing.id,
        merchantOrderId: payload.merchantOrderId,
        source: "callback",
        resultCode: payload.resultCode,
        signatureValid: true,
        payload,
    });

    // Jangan pernah percaya amount dari callback tanpa dicocokkan ke order kita.
    const receivedAmount = Number(payload.amount);
    if (!Number.isFinite(receivedAmount) || receivedAmount !== existing.amount) {
        return {
            kind: "amount_mismatch",
            expected: existing.amount,
            received: receivedAmount,
        };
    }

    if (existing.status !== "pending") {
        return { kind: "already_settled", status: existing.status as PaymentStatus };
    }

    const nextStatus: PaymentStatus = payload.resultCode === DUITKU_SUCCESS ? "paid" : "failed";

    // Guard `status = pending` di WHERE → menang-race aman kalau callback dobel bareng.
    const updated = await db
        .update(payments)
        .set({
            status: nextStatus,
            reference: payload.reference ?? existing.reference,
            publisherOrderId: payload.publisherOrderId ?? existing.publisherOrderId,
            paymentMethod: payload.paymentCode ?? existing.paymentMethod,
            paidAt: nextStatus === "paid" ? new Date() : null,
            updatedAt: new Date(),
        })
        .where(
            and(
                eq(payments.merchantOrderId, payload.merchantOrderId),
                eq(payments.status, "pending")
            )
        )
        .returning({ id: payments.id });

    if (updated.length === 0) {
        return { kind: "already_settled", status: existing.status as PaymentStatus };
    }

    return { kind: "applied", status: nextStatus };
}
