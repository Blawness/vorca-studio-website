"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ClientProjectSummary } from "@/lib/projects";

export function ProjectListClient({ projects }: { projects: ClientProjectSummary[] }) {
    const { t } = useLanguage();
    return (
        <div>
            <h1 className="mb-4 text-2xl font-semibold">{t("portal.projects.title")}</h1>
            {projects.length === 0 && <p className="text-slate-500">{t("portal.projects.empty")}</p>}
            <ul className="grid gap-4 sm:grid-cols-2">
                {projects.map((p) => (
                    <li key={p.id}>
                        <Link href={`/portal/${p.slug}`} className="block rounded-xl bg-white p-5 shadow-sm hover:shadow">
                            <h2 className="font-semibold">{p.name}</h2>
                            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">{p.stage}</p>
                            <div className="mt-3 h-2 w-full rounded bg-slate-100">
                                <div className="h-2 rounded bg-slate-900" style={{ width: `${p.progress}%` }} />
                            </div>
                            <p className="mt-1 text-xs text-slate-500">{p.progress}%</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
