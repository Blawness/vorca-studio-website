import Link from "next/link";
import { db } from "@/db";
import { clientSignupRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { requirePermission } from "@blawness/admin-kit/auth-helpers";

export default async function ClientRequestsPage() {
    await requirePermission("clientRequests.review");

    const rows = await db
        .select({
            id: clientSignupRequests.id,
            name: clientSignupRequests.name,
            email: clientSignupRequests.email,
            company: clientSignupRequests.company,
            status: clientSignupRequests.status,
            createdAt: clientSignupRequests.createdAt,
        })
        .from(clientSignupRequests)
        .orderBy(desc(clientSignupRequests.createdAt));

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-semibold">Client Requests</h1>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="py-2">Name</th>
                        <th>Email</th>
                        <th>Company</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-b">
                            <td className="py-2">
                                <Link className="text-brand hover:underline" href={`/admin/client-requests/${r.id}`}>
                                    {r.name}
                                </Link>
                            </td>
                            <td>{r.email}</td>
                            <td>{r.company ?? "—"}</td>
                            <td>{r.status}</td>
                            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400">
                                No requests yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
