"use server";

import { signIn } from "@blawness/admin-kit/auth";
import { redirect } from "next/navigation";

export async function clientSignIn(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    try {
        await signIn("credentials", { email, password, redirect: false });
    } catch {
        redirect("/portal/login?error=1");
    }
    redirect("/portal");
}
