import "server-only";

export type VercelProject = {
    id: string;
    name: string;
    framework: string | null;
    /** Best public URL: custom production domain, else `<name>.vercel.app`. */
    url: string;
    /** Every production hostname (used to match hand-added portfolio rows). */
    hosts: string[];
};

type ApiProject = {
    id: string;
    name: string;
    framework?: string | null;
    alias?: { domain: string; target?: string | null }[];
    targets?: { production?: { alias?: string[] } };
};

const FRAMEWORK_LABELS: Record<string, string> = {
    nextjs: "Next.js",
    vite: "Vite",
    astro: "Astro",
    remix: "Remix",
    nuxtjs: "Nuxt",
    sveltekit: "SvelteKit",
    gatsby: "Gatsby",
    create_react_app: "React",
};

export function frameworkLabel(framework: string | null): string | null {
    if (!framework) return null;
    return FRAMEWORK_LABELS[framework] ?? framework;
}

export function stripWww(host: string): string {
    return host.toLowerCase().replace(/^www\./, "");
}

function productionHosts(p: ApiProject): string[] {
    const fromTargets = p.targets?.production?.alias ?? [];
    const fromAlias = (p.alias ?? [])
        .filter((a) => a.target === "PRODUCTION")
        .map((a) => a.domain);
    return [...new Set([...fromTargets, ...fromAlias, `${p.name}.vercel.app`])];
}

function pickUrl(hosts: string[]): string {
    // Prefer a custom domain over *.vercel.app; among equals keep Vercel's order.
    const custom = hosts.find((h) => !h.endsWith(".vercel.app"));
    return `https://${custom ?? hosts[hosts.length - 1]}`;
}

/** Lists every project visible to the configured token/team (all pages). */
export async function fetchVercelProjects(): Promise<VercelProject[]> {
    const token = process.env.VERCEL_API_TOKEN;
    if (!token) throw new Error("VERCEL_API_TOKEN is not set");
    const teamId = process.env.VERCEL_TEAM_ID;

    const out: VercelProject[] = [];
    let until: number | null = null;

    for (;;) {
        const qs = new URLSearchParams({ limit: "100" });
        if (teamId) qs.set("teamId", teamId);
        if (until !== null) qs.set("until", String(until));

        const res = await fetch(`https://api.vercel.com/v10/projects?${qs}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
        });
        if (!res.ok) {
            throw new Error(`Vercel API ${res.status}: ${(await res.text()).slice(0, 200)}`);
        }
        const body = (await res.json()) as {
            projects: ApiProject[];
            pagination?: { next?: number | null };
        };

        for (const p of body.projects) {
            const hosts = productionHosts(p);
            out.push({
                id: p.id,
                name: p.name,
                framework: p.framework ?? null,
                url: pickUrl(hosts),
                hosts,
            });
        }

        const next = body.pagination?.next ?? null;
        if (next === null || body.projects.length === 0) break;
        until = next;
    }

    return out;
}
