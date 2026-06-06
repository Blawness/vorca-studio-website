import UsersScreen from "@blawness/admin-kit/screens/users";

export default function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    return <UsersScreen searchParams={searchParams} />;
}
