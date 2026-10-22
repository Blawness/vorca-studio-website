import Link from "next/link";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { deletePortfolioItemAction, syncVercelAction, toggleVisibleAction } from "./actions";

export default async function AdminPortfolioPage({
    searchParams,
}: {
    searchParams: Promise<{ synced?: string; error?: string; success?: string }>;
}) {
    const sp = await searchParams;
    const rows = await db
        .select()
        .from(portfolioItems)
        .orderBy(desc(portfolioItems.visible), asc(portfolioItems.sortOrder), asc(portfolioItems.title));

    let syncMsg: string | null = null;
    if (sp.synced) {
        const [added, linked, updated] = sp.synced.split("-");
        syncMsg = `Sync selesai: ${added} project baru, ${linked} terhubung ke entri lama, ${updated} URL diperbarui.`;
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Portfolio</h1>
                    <p className="text-sm text-gray-500">
                        Centang project Vercel yang mau tampil di /portfolio dan homepage (3 teratas).
                    </p>
                </div>
                <form action={syncVercelAction}>
                    <button className="rounded bg-navy px-4 py-2 text-sm font-medium text-white" type="submit">
                        Sync from Vercel
                    </button>
                </form>
            </div>

            {syncMsg && <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-800">{syncMsg}</p>}
            {sp.error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{sp.error}</p>}

            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="py-2">Thumbnail</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Order</th>
                        <th>Source</th>
                        <th>Tampil</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className="border-b align-middle">
                            <td className="py-2">
                                {r.thumbnailUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={r.thumbnailUrl} alt="" className="h-12 w-20 rounded object-cover object-top" />
                                ) : (
                                    <div className="h-12 w-20 rounded bg-gray-100" />
                                )}
                            </td>
                            <td>
                                <Link className="text-brand hover:underline" href={`/admin/portfolio/${r.id}`}>
                                    {r.title}
                                </Link>
                                <div className="text-xs text-gray-400">{r.url}</div>
                            </td>
                            <td>{r.category}</td>
                            <td>{r.sortOrder}</td>
                            <td>{r.vercelProjectId ? "Vercel" : "Manual"}</td>
                            <td>
                                <form action={toggleVisibleAction}>
                                    <input type="hidden" name="id" value={r.id} />
                                    <input type="hidden" name="visible" value={String(!r.visible)} />
                                    <button
                                        type="submit"
                                        className={`rounded px-3 py-1 text-xs font-medium ${
                                            r.visible ? "bg-green-600 text-white" : "bg-gray-200 text-gray-600"
                                        }`}
                                    >
                                        {r.visible ? "Tampil" : "Sembunyi"}
                                    </button>
                                </form>
                            </td>
                            <td className="text-right">
                                <form action={deletePortfolioItemAction}>
                                    <input type="hidden" name="id" value={r.id} />
                                    <button className="text-red-600 hover:underline" type="submit">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={7} className="py-6 text-center text-gray-400">
                                Belum ada entri. Klik “Sync from Vercel”.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
