import { uploadImageAction } from "@blawness/admin-kit/screens/media/actions";
import { ArticleForm } from "../_components/ArticleForm";
import { createArticleAction } from "../actions";

export default function NewArticlePage() {
    return (
        <div className="max-w-4xl p-8">
            <h1 className="mb-6 text-2xl font-bold">Artikel Baru</h1>
            <ArticleForm
                action={createArticleAction}
                uploadAction={uploadImageAction}
            />
        </div>
    );
}
