import Link from "next/link";
import { db } from "@/db";
import { projects, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { deleteProjectFormAction } from "./actions";

export default async function AdminProjectsPage() {
    const rows = await db
        .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            stage: projects.stage,
            progress: projects.progress,
            client: users.name,
        })
        .from(projects)
        .leftJoin(users, eq(projects.clientUserId, users.id))
        .orderBy(projects.createdAt);

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Projects</h1>
                <Link
                    href="/admin/projects/new"
                    className="rounded bg-navy px-4 py-2 text-sm font-medium text-white"
                >
                    New project
                </Link>
            </div>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="py-2">Name</th>
                        <th>Client</th>
                        <th>Stage</th>
                        <th>Progress</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((p) => (
                        <tr key={p.id} className="border-b">
                            <td className="py-2">
                                <Link className="text-brand hover:underline" href={`/admin/projects/${p.id}`}>
                                    {p.name}
                                </Link>
                            </td>
                            <td>{p.client ?? "—"}</td>
                            <td>{p.stage}</td>
                            <td>{p.progress}%</td>
                            <td className="text-right">
                                <form action={deleteProjectFormAction}>
                                    <input type="hidden" name="id" value={p.id} />
                                    <button className="text-red-600 hover:underline" type="submit">
                                        Delete
                                    </button>
                                </form>
                            </td>
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={5} className="py-6 text-center text-gray-400">
                                No projects yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
