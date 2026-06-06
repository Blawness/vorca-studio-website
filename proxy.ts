import NextAuth from "next-auth";
import { authConfig } from "@blawness/admin-kit/auth/config";

const { auth } = NextAuth(authConfig);

export const proxy = auth;

export const config = {
    matcher: ["/admin/:path*"],
};
