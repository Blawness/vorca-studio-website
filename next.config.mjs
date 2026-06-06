/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode
    reactStrictMode: true,

    // Image optimization for external domains (if needed)
    images: {
        remotePatterns: [],
    },
};

export default nextConfig;
