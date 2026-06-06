"use client";

import type { articles } from "@/db/schema";
import { Editor, ImageUpload } from "@blawness/admin-kit/components";
import type { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { useState } from "react";

type Article = InferSelectModel<typeof articles>;

const CATEGORIES = [
    "Technology",
    "Design",
    "Business",
    "Development",
    "Marketing",
    "Case Study",
];

export function ArticleForm({
    article,
    action,
    uploadAction,
}: {
    article?: Article;
    action: (formData: FormData) => Promise<void>;
    uploadAction: (formData: FormData) => Promise<{
        url?: string;
        error?: string;
    }>;
}) {
    const [content, setContent] = useState(article?.content ?? "");
    const [coverImageUrl, setCoverImageUrl] = useState(article?.coverImageUrl ?? "");

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="content" value={content} />
            <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

            <div>
                <label className="mb-1 block text-sm font-medium">Judul</label>
                <input
                    name="title"
                    defaultValue={article?.title}
                    required
                    className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={article?.excerpt}
                    required
                    rows={3}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Cover Image</label>
                <ImageUpload
                    value={coverImageUrl || undefined}
                    onChange={setCoverImageUrl}
                    label="Upload Cover"
                    uploadAction={uploadAction}
                />
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Konten</label>
                <Editor value={content} onChange={setContent} />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Kategori</label>
                    <select
                        name="category"
                        defaultValue={article?.category ?? ""}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="" disabled>
                            Pilih kategori
                        </option>
                        {CATEGORIES.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">Author</label>
                    <input
                        name="author"
                        defaultValue={article?.author ?? "Vorca Studio"}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Read Time (menit)
                    </label>
                    <input
                        name="readTime"
                        type="number"
                        min={1}
                        defaultValue={article?.readTime ?? 5}
                        required
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Tags (pisah koma)
                    </label>
                    <input
                        name="tags"
                        defaultValue={article?.tags?.join(", ")}
                        placeholder="nextjs, typescript, web"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select
                    name="status"
                    defaultValue={article?.status ?? "draft"}
                    className="w-full rounded-md border px-3 py-2 text-sm"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="rounded-md bg-brand px-6 py-2 text-sm font-medium text-white"
                >
                    Simpan
                </button>
                <Link
                    href="/admin/articles"
                    className="rounded-md border px-6 py-2 text-sm font-medium"
                >
                    Batal
                </Link>
            </div>
        </form>
    );
}
