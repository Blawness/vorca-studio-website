import { connection } from "next/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    await connection();
    return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
