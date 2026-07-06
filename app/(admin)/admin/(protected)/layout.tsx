import { requireUser } from "@blawness/admin-kit/auth-helpers";
import { AdminLayout } from "@blawness/admin-kit/shell";
import type { NavItem } from "@blawness/admin-kit/shell/sidebar";
import { redirect } from "next/navigation";
import "@/rbac";
import { FileText, FolderKanban, Image, LayoutDashboard, UserPlus, Users } from "./nav-icons";

// admin-kit 0.4.0 types NavItem.icon as ReactNode (an element). Icons come
// from ./nav-icons (a "use client" re-export) so they're client references and
// can cross from this server layout into admin-kit's client AdminSidebar.
const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Artikel", href: "/admin/articles", icon: <FileText className="h-4 w-4" /> },
    { label: "Projects", href: "/admin/projects", icon: <FolderKanban className="h-4 w-4" />, requires: "projects.read" },
    { label: "Client Requests", href: "/admin/client-requests", icon: <UserPlus className="h-4 w-4" />, requires: "clientRequests.review" },
    { label: "Media", href: "/admin/media", icon: <Image className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
];

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await requireUser();
    // Clients authenticate through the same NextAuth as staff, but must never
    // reach the admin CMS — send them to their portal. (admin-kit's middleware
    // only checks authentication, not role.)
    const user = session.user as { role?: string } | undefined;
    if (user?.role === "client") redirect("/portal");

    return (
        <AdminLayout navItems={navItems} brandName="Vorca Studio" logoSrc="/favicon.svg">
            {children}
        </AdminLayout>
    );
}
