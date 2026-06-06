/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,

    // admin-kit ships source that must be transpiled by the consumer.
    transpilePackages: ["@blawness/admin-kit"],

    // Image optimization for external domains (if needed)
    images: {
        remotePatterns: [],
    },
};

export default nextConfig;
