import { requireClient } from "@/lib/portal-auth";
import { PortalHeader } from "./PortalHeader";

// No `export const dynamic` — this app has cacheComponents:true (force-dynamic is
// disallowed). requireClient()/requireUser() read auth cookies, making the route
// dynamic (fresh per request) automatically.

export default async function PortalProtectedLayout({ children }: { children: React.ReactNode }) {
    const client = await requireClient();
    return (
        <div className="mx-auto min-h-screen max-w-4xl px-4 py-6">
            <PortalHeader clientName={client.name || client.email} />
            <main className="mt-6">{children}</main>
        </div>
    );
}
