import NextAuth from "next-auth";
import { rbac } from "./rbac";

const { auth } = NextAuth(rbac.authConfig);

export const proxy = auth;

export const config = {
    matcher: ["/admin/:path*"],
};
