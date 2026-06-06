import { db } from "@/db";
import { articles } from "@/db/schema";
import { uploadImageAction } from "@blawness/admin-kit/screens/media/actions";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArticleForm } from "../_components/ArticleForm";
import { updateArticleAction } from "../actions";

export default async function EditArticlePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [article] = await db
        .select()
        .from(articles)
        .where(eq(articles.id, Number(id)))
        .limit(1);

    if (!article) notFound();

    return (
        <div className="max-w-4xl p-8">
            <h1 className="mb-6 text-2xl font-bold">Edit Artikel</h1>
            <ArticleForm
                article={article}
                action={updateArticleAction.bind(null, article.id)}
                uploadAction={uploadImageAction}
            />
        </div>
    );
}
