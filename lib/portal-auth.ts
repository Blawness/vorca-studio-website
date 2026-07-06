import { redirect } from "next/navigation";
import { auth } from "@blawness/admin-kit/auth";

export type PortalClient = { userId: number; name: string; email: string };

/**
 * Guards the client portal. Unlike admin-kit's requireUser() (which redirects
 * to /admin/login), this sends non-clients to the portal login. Role must be
 * exactly "client" — staff roles are rejected so the portal never leaks a
 * staff session into a client surface.
 */
export async function requireClient(): Promise<PortalClient> {
    const session = await auth();
    const user = session?.user as
        | { id?: string | number; role?: string; name?: string; email?: string }
        | undefined;

    if (!user || user.role !== "client") {
        redirect("/portal/login");
    }

    const userId = Number(user.id);
    if (!Number.isInteger(userId)) {
        redirect("/portal/login");
    }

    return { userId, name: user.name ?? "", email: user.email ?? "" };
}
