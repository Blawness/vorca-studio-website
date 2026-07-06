"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { clientSignIn } from "./actions";

export function LoginForm({ hasError }: { hasError: boolean }) {
    const { t } = useLanguage();
    return (
        <form action={clientSignIn} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{t("portal.login.title")}</h1>
            {hasError && <p className="text-sm text-red-600">{t("portal.login.error")}</p>}
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.login.email")}</span>
                <input name="email" type="email" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.login.password")}</span>
                <input name="password" type="password" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {t("portal.login.submit")}
            </button>
        </form>
    );
}
