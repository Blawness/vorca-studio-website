import { requireUser } from "@blawness/admin-kit/auth-helpers";
import { AdminLayout } from "@blawness/admin-kit/shell";
import type { NavItem } from "@blawness/admin-kit/shell/sidebar";
import { FileText, Image, LayoutDashboard, Users } from "./nav-icons";

const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Artikel", href: "/admin/articles", icon: FileText },
    { label: "Media", href: "/admin/media", icon: Image },
    { label: "Users", href: "/admin/users", icon: Users },
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
