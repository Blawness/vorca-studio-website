"use client";

import { useState, useTransition } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { approveDeliverable, requestRevision } from "./actions";
import type { ClientDeliverable } from "@/lib/projects";

export function DeliverableActions({ deliverable, slug }: { deliverable: ClientDeliverable; slug: string }) {
    const { t } = useLanguage();
    const [pending, startTransition] = useTransition();
    const [showRevision, setShowRevision] = useState(false);
    const [note, setNote] = useState("");

    if (deliverable.approvalStatus !== "pending") return null;

    return (
        <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
                disabled={pending}
                onClick={() =>
                    startTransition(() => {
                        const fd = new FormData();
                        fd.set("deliverableId", String(deliverable.id));
                        fd.set("slug", slug);
                        approveDeliverable(fd);
                    })
                }
                className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
            >
                {t("portal.approve")}
            </button>

            {!showRevision ? (
                <button
                    disabled={pending}
                    onClick={() => setShowRevision(true)}
                    className="rounded border border-slate-300 px-3 py-1.5 text-sm"
                >
                    {t("portal.requestRevision")}
                </button>
            ) : (
                <div className="flex w-full flex-col gap-2 sm:flex-row">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={t("portal.revisionNote")}
                        className="flex-1 rounded border border-slate-300 px-3 py-1.5 text-sm"
                    />
                    <button
                        disabled={pending || !note.trim()}
                        onClick={() =>
                            startTransition(() => {
                                const fd = new FormData();
                                fd.set("deliverableId", String(deliverable.id));
                                fd.set("slug", slug);
                                fd.set("note", note);
                                requestRevision(fd);
                            })
                        }
                        className="rounded bg-amber-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {t("portal.requestRevision")}
                    </button>
                </div>
            )}
        </div>
    );
}
