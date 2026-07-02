const r2Host = process.env.R2_PUBLIC_URL
    ? new URL(process.env.R2_PUBLIC_URL).hostname
    : null;

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@blawness/admin-kit"],
    cacheComponents: true,
    images: {
        remotePatterns: [
            ...(r2Host
                ? [{ protocol: "https", hostname: r2Host }]
                : []),
        ],
    },
};

export default nextConfig;
