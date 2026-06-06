import MediaLibraryScreen from "@blawness/admin-kit/screens/media";
import { handleDeleteMedia } from "@blawness/admin-kit/screens/media/lib";

async function deleteAction(formData: FormData) {
    "use server";

    await handleDeleteMedia(formData, async () => 0);
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
