"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { submitSignupRequest } from "./actions";

export function RegisterForm({ status }: { status?: "success" | "validation" | "exists" }) {
    const { t, language } = useLanguage();

    if (status === "success") {
        return (
            <div className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-sm">
                <h1 className="text-xl font-semibold text-slate-900">{t("portal.register.title")}</h1>
                <p className="mt-4 text-sm text-green-700">{t("portal.register.success")}</p>
                <Link href="/portal/login" className="mt-4 inline-block text-sm text-slate-600 hover:underline">
                    {t("portal.register.haveAccount")}
                </Link>
            </div>
        );
    }

    return (
        <form action={submitSignupRequest} className="w-full max-w-sm space-y-3 rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">{t("portal.register.title")}</h1>
            {status === "validation" && <p className="text-sm text-red-600">{t("portal.register.errorValidation")}</p>}
            {status === "exists" && <p className="text-sm text-red-600">{t("portal.register.errorExists")}</p>}

            <input type="hidden" name="locale" value={language} />
            {/* Honeypot: hidden from users, tempting to bots */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.name")}</span>
                <input name="name" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.email")}</span>
                <input name="email" type="email" required className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.password")}</span>
                <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.confirm")}</span>
                <input name="confirmPassword" type="password" required minLength={8} className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.company")}</span>
                <input name="company" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.phone")}</span>
                <input name="phone" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>
            <label className="block">
                <span className="text-sm text-slate-600">{t("portal.register.note")}</span>
                <textarea name="note" className="mt-1 w-full rounded border border-slate-300 px-3 py-2" />
            </label>

            <button type="submit" className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                {t("portal.register.submit")}
            </button>
            <Link href="/portal/login" className="block text-center text-sm text-slate-600 hover:underline">
                {t("portal.register.haveAccount")}
            </Link>
        </form>
    );
}
