import { RegisterForm } from "./RegisterForm";

export default async function PortalRegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ success?: string; error?: string }>;
}) {
    const { success, error } = await searchParams;
    const status = success === "1" ? "success" : error === "validation" ? "validation" : error === "exists" ? "exists" : undefined;

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
            <RegisterForm status={status} />
        </div>
    );
}
