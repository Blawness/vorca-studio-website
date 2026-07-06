import { customAlphabet } from "nanoid";

// URL-safe, unambiguous alphabet (no look-alike chars). 12 chars ≈ 71 bits —
// non-guessable, defense-in-depth above auth.
const nano = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", 12);

export function generateProjectSlug(): string {
    return nano();
}
