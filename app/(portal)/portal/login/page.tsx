import { LoginForm } from "./LoginForm";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

export default async function PortalLoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>;
}) {
    const { error } = await searchParams;
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <LoginForm hasError={error === "1"} />
        </div>
    );
}
