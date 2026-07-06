"use server";

import { signOut } from "@blawness/admin-kit/auth";

export async function portalSignOut() {
    await signOut({ redirectTo: "/portal/login" });
}
