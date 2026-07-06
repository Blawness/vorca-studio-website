"use client";

import { useState } from "react";
import { Editor } from "@blawness/admin-kit/components";

type ClientOption = { id: number; name: string | null; email: string };

export type ProjectFormValues = {
    id?: number;
    name: string;
    description: string;
    prd: string;
    clientUserId: number | "";
    stage: string;
    progress: number;
    liveUrl: string;
    startDate: string;
    targetDate: string;
};

export function ProjectForm({
    initial,
    clients,
    action,
}: {
    initial: ProjectFormValues;
    clients: ClientOption[];
    action: (formData: FormData) => void;
}) {
    const [prd, setPrd] = useState(initial.prd);

    return (
        <form action={action} className="max-w-2xl space-y-4">
            <input type="hidden" name="prd" value={prd} />

            <label className="block">
                <span className="text-sm font-medium">Name</span>
                <input name="name" defaultValue={initial.name} required className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <label className="block">
                <span className="text-sm font-medium">Description</span>
                <textarea name="description" defaultValue={initial.description} className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <label className="block">
                <span className="text-sm font-medium">Client</span>
                <select name="clientUserId" defaultValue={initial.clientUserId} required className="mt-1 w-full rounded border px-3 py-2">
                    <option value="" disabled>Select a client…</option>
                    {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.name ?? c.email}</option>
                    ))}
                </select>
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Stage</span>
                    <select name="stage" defaultValue={initial.stage} className="mt-1 w-full rounded border px-3 py-2">
                        {["planning", "design", "development", "review", "completed"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Progress: {initial.progress}%</span>
                    <input type="range" name="progress" min={0} max={100} defaultValue={initial.progress} className="mt-3 w-full" />
                </label>
            </div>

            <label className="block">
                <span className="text-sm font-medium">Live URL</span>
                <input name="liveUrl" type="url" defaultValue={initial.liveUrl} placeholder="https://…" className="mt-1 w-full rounded border px-3 py-2" />
            </label>

            <div className="grid grid-cols-2 gap-4">
                <label className="block">
                    <span className="text-sm font-medium">Start date</span>
                    <input name="startDate" type="date" defaultValue={initial.startDate} className="mt-1 w-full rounded border px-3 py-2" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Target date</span>
                    <input name="targetDate" type="date" defaultValue={initial.targetDate} className="mt-1 w-full rounded border px-3 py-2" />
                </label>
            </div>

            <div>
                <span className="text-sm font-medium">PRD / Brief</span>
                <div className="mt-1 rounded border">
                    <Editor value={prd} onChange={setPrd} />
                </div>
            </div>

            <button type="submit" className="rounded bg-navy px-4 py-2 text-sm font-medium text-white">
                Save project
            </button>
        </form>
    );
}
