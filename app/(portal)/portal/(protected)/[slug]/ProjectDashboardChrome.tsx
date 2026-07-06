"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { ClientProjectDetail } from "@/lib/projects";
import { DeliverableActions } from "./DeliverableActions";

const STATUS_KEY: Record<string, string> = {
    pending: "portal.status.pending",
    approved: "portal.status.approved",
    revision_requested: "portal.status.revision_requested",
};

export function ProjectDashboardChrome({
    project,
    prdHtml,
    slug,
}: {
    project: ClientProjectDetail;
    prdHtml: string | null;
    slug: string;
}) {
    const { t } = useLanguage();
    const doneCount = project.tasks.filter((x) => x.status === "done").length;

    return (
        <div className="space-y-10">
            {/* Header */}
            <section className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">{project.name}</h1>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide">{project.stage}</span>
                </div>
                <div className="mt-4 h-3 w-full rounded bg-slate-100">
                    <div className="h-3 rounded bg-slate-900" style={{ width: `${project.progress}%` }} />
                </div>
                <p className="mt-1 text-xs text-slate-500">{project.progress}%</p>
                {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 text-sm text-white">
                        {t("portal.viewLive")}
                    </a>
                )}
            </section>

            {/* PRD */}
            {prdHtml && (
                <section className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-3 text-lg font-semibold">{t("portal.section.prd")}</h2>
                    {/* Plain `prose` (not `article-prose`) — the blog editorial styles
                        (drop-cap, serif, decorative rules) look wrong in a dashboard card. */}
                    <div className="prose prose-slate max-w-none prose-sm" dangerouslySetInnerHTML={{ __html: prdHtml }} />
                </section>
            )}

            {/* Updates */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">{t("portal.section.updates")}</h2>
                <ol className="space-y-3">
                    {project.updates.map((u) => (
                        <li key={u.id} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{u.title}</h3>
                                <time className="text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</time>
                            </div>
                            <div className="mt-1 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: u.body }} />
                        </li>
                    ))}
                </ol>
            </section>

            {/* Tasks */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">
                    {t("portal.section.tasks")}{" "}
                    <span className="text-sm font-normal text-slate-500">
                        {doneCount}/{project.tasks.length} {t("portal.tasksDone")}
                    </span>
                </h2>
                <ul className="space-y-2">
                    {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm shadow-sm">
                            <span className={task.status === "done" ? "text-green-600" : "text-slate-300"}>✓</span>
                            <span className={task.status === "done" ? "line-through text-slate-400" : ""}>{task.title}</span>
                            <span className="ml-auto text-xs uppercase text-slate-400">{task.status}</span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Deliverables */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">{t("portal.section.deliverables")}</h2>
                <ul className="space-y-3">
                    {project.deliverables.map((d) => (
                        <li key={d.id} className="rounded-xl bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="font-medium">{d.title}</h3>
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{t(STATUS_KEY[d.approvalStatus])}</span>
                            </div>
                            <div className="mt-1 flex gap-4 text-sm">
                                {d.fileUrl && <a className="text-brand hover:underline" href={d.fileUrl} target="_blank" rel="noreferrer">File</a>}
                                {d.previewUrl && <a className="text-brand hover:underline" href={d.previewUrl} target="_blank" rel="noreferrer">Preview</a>}
                            </div>
                            <DeliverableActions deliverable={d} slug={slug} />
                            {d.events.length > 0 && (
                                <ul className="mt-3 space-y-1 border-t border-slate-100 pt-2 text-xs text-slate-500">
                                    {d.events.map((e) => (
                                        <li key={e.id}>
                                            {t(STATUS_KEY[e.action === "approved" ? "approved" : "revision_requested"])}
                                            {" · "}
                                            {new Date(e.createdAt).toLocaleDateString()}
                                            {e.note ? ` — "${e.note}"` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
