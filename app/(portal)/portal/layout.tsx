// The header (logo, client name, language switch, logout) is rendered by the
// (protected)/layout.tsx in Task 9, since it needs the authenticated client.
// This root portal layout only sets the base theme so the login page is also
// on-brand.
export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            {children}
        </div>
    );
}
