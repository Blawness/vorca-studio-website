import { notFound } from "next/navigation";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { regenerateThumbnailAction, updatePortfolioItemAction } from "../actions";

const CATEGORIES = ["Company Profile", "Web App", "Website", "Landing Page"];

export default async function EditPortfolioItemPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ success?: string; error?: string }>;
}) {
    const { id: rawId } = await params;
    const sp = await searchParams;
    const id = Number(rawId);
    if (!Number.isInteger(id)) notFound();

    const [item] = await db.select().from(portfolioItems).where(eq(portfolioItems.id, id));
    if (!item) notFound();

    const input = "mt-1 w-full rounded border px-3 py-2";

    return (
        <div className="p-6">
            <h1 className="mb-1 text-2xl font-semibold">{item.title}</h1>
            <p className="mb-6 text-sm text-gray-500">
                slug: {item.slug}
                {item.vercelProjectName ? ` · Vercel: ${item.vercelProjectName}` : " · manual"}
            </p>

            {sp.success && <p className="mb-4 rounded bg-green-50 px-3 py-2 text-sm text-green-800">Tersimpan ({sp.success}).</p>}
            {sp.error && <p className="mb-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">{sp.error}</p>}

            <div className="mb-8 flex items-start gap-4">
                {item.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt="" className="h-32 w-52 rounded border object-cover object-top" />
                ) : (
                    <div className="h-32 w-52 rounded bg-gray-100" />
                )}
                <form action={regenerateThumbnailAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button type="submit" className="rounded border px-3 py-2 text-sm">
                        Ambil screenshot ulang dari URL live
                    </button>
                </form>
            </div>

            <form action={updatePortfolioItemAction.bind(null, item.id)} className="max-w-2xl space-y-4">
                <label className="block">
                    <span className="text-sm font-medium">Title</span>
                    <input name="title" defaultValue={item.title} required className={input} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-sm font-medium">Category</span>
                        <input name="category" list="portfolio-categories" defaultValue={item.category} required className={input} />
                        <datalist id="portfolio-categories">
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c} />
                            ))}
                        </datalist>
                    </label>
                    <label className="block">
                        <span className="text-sm font-medium">Urutan (kecil = duluan)</span>
                        <input name="sortOrder" type="number" defaultValue={item.sortOrder} required className={input} />
                    </label>
                </div>
                <label className="block">
                    <span className="text-sm font-medium">URL</span>
                    <input name="url" type="url" defaultValue={item.url} required className={input} />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Deskripsi (ID)</span>
                    <textarea name="descriptionId" defaultValue={item.descriptionId ?? ""} rows={3} className={input} />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Description (EN)</span>
                    <textarea name="descriptionEn" defaultValue={item.descriptionEn ?? ""} rows={3} className={input} />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Tags (pisah koma)</span>
                    <input name="tags" defaultValue={item.tags.join(", ")} className={input} />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Thumbnail URL (kosongkan untuk auto-screenshot saat ditampilkan)</span>
                    <input name="thumbnailUrl" defaultValue={item.thumbnailUrl ?? ""} className={input} />
                </label>
                <button type="submit" className="rounded bg-navy px-4 py-2 text-sm font-medium text-white">
                    Save
                </button>
            </form>
        </div>
    );
}
