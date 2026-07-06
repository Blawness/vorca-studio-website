import { notFound } from "next/navigation";
import { db } from "@/db";
import { clientSignupRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { approveRequestFormAction, rejectRequestFormAction } from "../actions";

export default async function ClientRequestDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const reqId = Number(id);
    if (!Number.isInteger(reqId)) notFound();

    const [req] = await db
        .select()
        .from(clientSignupRequests)
        .where(eq(clientSignupRequests.id, reqId))
        .limit(1);
    if (!req) notFound();

    return (
        <div className="max-w-xl p-6">
            <h1 className="mb-4 text-2xl font-semibold">{req.name}</h1>
            <dl className="space-y-1 text-sm">
                <div><dt className="inline font-medium">Email: </dt><dd className="inline">{req.email}</dd></div>
                <div><dt className="inline font-medium">Company: </dt><dd className="inline">{req.company ?? "—"}</dd></div>
                <div><dt className="inline font-medium">Phone: </dt><dd className="inline">{req.phone ?? "—"}</dd></div>
                <div><dt className="inline font-medium">Language: </dt><dd className="inline">{req.locale}</dd></div>
                <div><dt className="inline font-medium">Status: </dt><dd className="inline">{req.status}</dd></div>
                <div className="pt-2"><dt className="font-medium">Note:</dt><dd className="whitespace-pre-wrap">{req.note ?? "—"}</dd></div>
                {req.reviewNote && (
                    <div className="pt-2"><dt className="font-medium">Review note:</dt><dd className="whitespace-pre-wrap">{req.reviewNote}</dd></div>
                )}
            </dl>

            {req.status === "pending" && (
                <div className="mt-6 space-y-4">
                    <form action={approveRequestFormAction}>
                        <input type="hidden" name="id" value={req.id} />
                        <button type="submit" className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white">
                            Approve
                        </button>
                    </form>
                    <form action={rejectRequestFormAction} className="space-y-2">
                        <input type="hidden" name="id" value={req.id} />
                        <textarea name="reviewNote" placeholder="Reason (optional)" className="w-full rounded border px-3 py-2 text-sm" />
                        <button type="submit" className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white">
                            Reject
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
