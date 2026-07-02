import { db } from "@/db";
import { articles } from "@/db/schema";
import { ConfirmDelete, ToastOnParam } from "@blawness/admin-kit/components";
import { desc } from "drizzle-orm";
import Link from "next/link";
import {
    deleteArticleFormAction,
    publishArticleAction,
} from "./actions";

export default async function AdminArticlesPage() {
    const rows = await db
        .select({
            id: articles.id,
            title: articles.title,
            slug: articles.slug,
            status: articles.status,
            categoryId: articles.categoryId,
            publishedAt: articles.publishedAt,
        })
        .from(articles)
        .orderBy(desc(articles.createdAt));

    return (
        <div className="p-8">
            <ToastOnParam
                param="success"
                messages={{
                    created: "Artikel berhasil dibuat.",
                    updated: "Artikel berhasil diperbarui.",
                    deleted: "Artikel berhasil dihapus.",
                }}
            />
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Artikel</h1>
                <Link
                    href="/admin/articles/new"
                    className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white"
                >
                    + Artikel Baru
                </Link>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left">
                        <th className="pb-2">Judul</th>
                        <th className="pb-2">Kategori</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2">Tanggal</th>
                        <th className="pb-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-muted/30">
                            <td className="py-3 font-medium">{row.title}</td>
                            <td className="py-3">{row.categoryId}</td>
                            <td className="py-3">
                                <span
                                    className={
                                        row.status === "published"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                    }
                                >
                                    {row.status}
                                </span>
                            </td>
                            <td className="py-3">
                                {row.publishedAt
                                    ? row.publishedAt.toLocaleDateString("id-ID")
                                    : "-"}
                            </td>
                            <td className="flex gap-2 py-3">
                                <Link
                                    href={`/admin/articles/${row.id}`}
                                    className="text-brand underline"
                                >
                                    Edit
                                </Link>
                                {row.status === "draft" && (
                                    <form action={publishArticleAction.bind(null, row.id)}>
                                        <button
                                            type="submit"
                                            className="text-green-600 underline"
                                        >
                                            Publish
                                        </button>
                                    </form>
                                )}
                                <ConfirmDelete
                                    action={deleteArticleFormAction}
                                    id={row.id}
                                    title="Hapus artikel?"
                                    description={`Artikel "${row.title}" akan dihapus permanen.`}
                                    confirmLabel="Hapus"
                                    trigger={
                                        <button
                                            type="button"
                                            className="text-red-500 underline"
                                        >
                                            Hapus
                                        </button>
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td
                                colSpan={5}
                                className="py-8 text-center text-muted-foreground"
                            >
                                Belum ada artikel.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
