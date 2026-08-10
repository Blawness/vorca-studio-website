/**
 * Cek kredensial Duitku (merchantCode + apiKey) ke endpoint getPaymentMethod.
 *
 *   pnpm duitku:check          # amount default 40000
 *   pnpm duitku:check 100000
 */
import "dotenv/config";
import { config as loadEnv } from "dotenv";
import { getDuitkuConfig, paymentMethodSignature } from "../lib/duitku";

loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

function formatDatetime(d: Date): string {
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(
        d.getMinutes()
    )}:${p(d.getSeconds())}`;
}

interface PaymentFee {
    paymentMethod: string;
    paymentName: string;
    paymentImage: string;
    totalFee: string;
}

async function main() {
    const cfg = getDuitkuConfig();
    const amount = Number(process.argv[2] ?? 40000);
    const datetime = formatDatetime(new Date());

    console.log(`env          : ${cfg.env}`);
    console.log(`merchantCode : ${cfg.merchantCode}`);
    console.log(`apiKey       : ${cfg.apiKey.slice(0, 4)}…${cfg.apiKey.slice(-4)} (${cfg.apiKey.length} chars)`);
    console.log(`amount       : ${amount}`);
    console.log(`datetime     : ${datetime}\n`);

    const body = {
        merchantcode: cfg.merchantCode,
        amount: String(amount),
        datetime,
        signature: paymentMethodSignature(cfg.merchantCode, amount, datetime, cfg.apiKey),
    };

    const res = await fetch(`${cfg.baseUrl}/api/merchant/paymentmethod/getpaymentmethod`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    const text = await res.text();
    if (!res.ok) {
        console.error(`❌ HTTP ${res.status}\n${text}`);
        process.exit(1);
    }

    const json = JSON.parse(text) as {
        paymentFee?: PaymentFee[];
        responseCode?: string;
        responseMessage?: string;
    };

    if (json.responseCode !== "00") {
        console.error(`❌ ${json.responseCode} ${json.responseMessage}`);
        console.error("   Cek lagi DUITKU_MERCHANT_CODE / DUITKU_API_KEY (harus dari project yang sama).");
        process.exit(1);
    }

    console.log(`✅ ${json.responseMessage} — ${json.paymentFee?.length ?? 0} metode pembayaran aktif:\n`);
    for (const m of json.paymentFee ?? []) {
        console.log(`  ${m.paymentMethod.padEnd(4)} ${m.paymentName.padEnd(28)} fee ${m.totalFee}`);
    }
}

main().catch((err) => {
    console.error("❌", err instanceof Error ? err.message : err);
    process.exit(1);
});
