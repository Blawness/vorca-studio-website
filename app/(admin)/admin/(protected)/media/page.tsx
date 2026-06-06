import MediaLibraryScreen from "@blawness/admin-kit/screens/media";
import { handleDeleteMedia } from "@blawness/admin-kit/screens/media/lib";
import { eq } from "drizzle-orm";

async function deleteAction(formData: FormData) {
    "use server";
    const { db } = await import("@/db");
    const { articles } = await import("@/db/schema");

    await handleDeleteMedia(formData, async (url) => {
        const result = await db
            .select({ id: articles.id })
            .from(articles)
            .where(eq(articles.coverImageUrl, url))
            .limit(1);

        return result.length;
    });
}

export default function AdminMediaPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    return (
        <MediaLibraryScreen
            deleteAction={deleteAction}
            searchParams={searchParams}
        />
    );
}
