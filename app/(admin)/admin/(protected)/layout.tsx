import { requireUser } from "@blawness/admin-kit/auth-helpers";
import { AdminLayout } from "@blawness/admin-kit/shell";
import type { NavItem } from "@blawness/admin-kit/shell/sidebar";
import { FileText, Image, LayoutDashboard, Users } from "./nav-icons";

// admin-kit 0.4.0 types NavItem.icon as ReactNode (an element). Icons come
// from ./nav-icons (a "use client" re-export) so they're client references and
// can cross from this server layout into admin-kit's client AdminSidebar.
const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: "Artikel", href: "/admin/articles", icon: <FileText className="h-4 w-4" /> },
    { label: "Media", href: "/admin/media", icon: <Image className="h-4 w-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
];

export default async function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireUser();

    return (
        <AdminLayout navItems={navItems} brandName="Vorca Studio" logoSrc="/favicon.svg">
            {children}
        </AdminLayout>
    );
}
