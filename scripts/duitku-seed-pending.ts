/**
 * Bikin satu row payment `pending` untuk keperluan tes callback.
 *
 *   pnpm duitku:pending                 # order id auto, amount 40000
 *   pnpm duitku:pending my-order-1 25000
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

async function main() {
    const { createPendingPayment } = await import("../lib/payments");

    const merchantOrderId = process.argv[2] ?? `sbx-${Date.now()}`;
    const amount = Number(process.argv[3] ?? 40000);

    const row = await createPendingPayment({
        merchantOrderId,
        amount,
        productDetails: "Sandbox test Duitku",
        customerEmail: "test@test.com",
    });

    console.log(`✅ pending payment dibuat`);
    console.log(`   id              : ${row.id}`);
    console.log(`   merchantOrderId : ${row.merchantOrderId}`);
    console.log(`   amount          : ${row.amount}`);
    console.log(`\nTes callback-nya:`);
    console.log(
        `   ORDER_ID=${row.merchantOrderId} AMOUNT=${row.amount} scripts/duitku-callback-test.sh`
    );
    process.exit(0);
}

main().catch((err) => {
    console.error("❌", err instanceof Error ? err.message : err);
    process.exit(1);
});
