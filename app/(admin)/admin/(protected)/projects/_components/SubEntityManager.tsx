import {
    addUpdateAction,
    deleteUpdateFormAction,
    addTaskAction,
    updateTaskAction,
    deleteTaskFormAction,
    addDeliverableAction,
    deleteDeliverableFormAction,
} from "../actions";

type Update = { id: number; title: string; createdAt: Date };
type Task = { id: number; title: string; status: string };
type Deliverable = { id: number; title: string; approvalStatus: string };

export function SubEntityManager({
    projectId,
    updates,
    tasks,
    deliverables,
}: {
    projectId: number;
    updates: Update[];
    tasks: Task[];
    deliverables: Deliverable[];
}) {
    return (
        <div className="mt-10 space-y-10">
            {/* Updates */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Timeline updates</h2>
                <ul className="mb-4 space-y-2">
                    {updates.map((u) => (
                        <li key={u.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{u.title}</span>
                            <form action={deleteUpdateFormAction}>
                                <input type="hidden" name="id" value={u.id} />
                                <input type="hidden" name="projectId" value={projectId} />
                                <button className="text-red-600" type="submit">Delete</button>
                            </form>
                        </li>
                    ))}
                </ul>
                <form action={addUpdateAction} className="space-y-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Update title" required className="w-full rounded border px-3 py-2 text-sm" />
                    <textarea name="body" placeholder="Update body" required className="w-full rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add update</button>
                </form>
            </section>

            {/* Tasks */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Tasks</h2>
                <ul className="mb-4 space-y-2">
                    {tasks.map((t) => (
                        <li key={t.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{t.title}</span>
                            <div className="flex items-center gap-2">
                                <form action={updateTaskAction} className="flex items-center gap-1">
                                    <input type="hidden" name="id" value={t.id} />
                                    <input type="hidden" name="projectId" value={projectId} />
                                    <select name="status" defaultValue={t.status} className="rounded border px-2 py-1">
                                        {["todo", "in_progress", "done"].map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <button className="text-brand" type="submit">Save</button>
                                </form>
                                <form action={deleteTaskFormAction}>
                                    <input type="hidden" name="id" value={t.id} />
                                    <input type="hidden" name="projectId" value={projectId} />
                                    <button className="text-red-600" type="submit">Delete</button>
                                </form>
                            </div>
                        </li>
                    ))}
                </ul>
                <form action={addTaskAction} className="flex gap-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Task title" required className="flex-1 rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add task</button>
                </form>
            </section>

            {/* Deliverables */}
            <section>
                <h2 className="mb-3 text-lg font-semibold">Deliverables</h2>
                <ul className="mb-4 space-y-2">
                    {deliverables.map((d) => (
                        <li key={d.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                            <span>{d.title} — <em>{d.approvalStatus}</em></span>
                            <form action={deleteDeliverableFormAction}>
                                <input type="hidden" name="id" value={d.id} />
                                <input type="hidden" name="projectId" value={projectId} />
                                <button className="text-red-600" type="submit">Delete</button>
                            </form>
                        </li>
                    ))}
                </ul>
                <form action={addDeliverableAction} className="space-y-2">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input name="title" placeholder="Deliverable title" required className="w-full rounded border px-3 py-2 text-sm" />
                    <input name="fileUrl" placeholder="File URL (optional — from Media library)" className="w-full rounded border px-3 py-2 text-sm" />
                    <input name="previewUrl" placeholder="Live/preview URL (optional)" className="w-full rounded border px-3 py-2 text-sm" />
                    <button className="rounded bg-navy px-3 py-1.5 text-sm text-white" type="submit">Add deliverable</button>
                </form>
            </section>
        </div>
    );
}
