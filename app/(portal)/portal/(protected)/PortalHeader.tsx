"use client";

import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { portalSignOut } from "./actions";

export function PortalHeader({ clientName }: { clientName: string }) {
    const { t, language, setLanguage } = useLanguage();
    return (
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
                <Image src="/favicon.svg" alt="Vorca Studio" width={28} height={28} />
                <span className="font-semibold">Vorca Studio</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">{clientName}</span>
                <button
                    onClick={() => setLanguage(language === "id" ? "en" : "id")}
                    className="rounded border border-slate-300 px-2 py-1"
                >
                    {language.toUpperCase()}
                </button>
                <form action={portalSignOut}>
                    <button type="submit" className="text-slate-600 hover:underline">{t("portal.logout")}</button>
                </form>
            </div>
        </header>
    );
}
