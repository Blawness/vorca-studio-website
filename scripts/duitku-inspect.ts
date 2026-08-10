/**
 * Lihat isi tabel payments + payment_events terakhir.
 *
 *   pnpm duitku:inspect                # 10 payment terakhir
 *   pnpm duitku:inspect sbx-1234567    # detail satu order + semua event-nya
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

async function main() {
    const { db } = await import("../db");
    const { payments, paymentEvents } = await import("../db/schema");
    const { desc, eq } = await import("drizzle-orm");

    const orderId = process.argv[2];

    if (orderId) {
        const [p] = await db
            .select()
            .from(payments)
            .where(eq(payments.merchantOrderId, orderId))
            .limit(1);
        if (!p) {
            console.log(`(tidak ada payment dengan merchantOrderId=${orderId})`);
        } else {
            console.log(p);
        }
        const events = await db
            .select()
            .from(paymentEvents)
            .where(eq(paymentEvents.merchantOrderId, orderId))
            .orderBy(desc(paymentEvents.createdAt));
        console.log(`\n${events.length} event:`);
        for (const e of events) {
            console.log(
                `  [${e.createdAt.toISOString()}] ${e.source} result=${e.resultCode} sigValid=${e.signatureValid}`
            );
        }
        process.exit(0);
    }

    const rows = await db.select().from(payments).orderBy(desc(payments.createdAt)).limit(10);
    if (rows.length === 0) {
        console.log("(belum ada payment)");
    }
    for (const r of rows) {
        console.log(
            `${String(r.id).padStart(4)}  ${r.merchantOrderId.padEnd(24)} ${String(r.amount).padStart(9)}  ${r.status.padEnd(8)} ${r.paymentMethod ?? "-"}  ${r.reference ?? "-"}`
        );
    }
    process.exit(0);
}

main().catch((err) => {
    console.error("❌", err instanceof Error ? err.message : err);
    process.exit(1);
});
