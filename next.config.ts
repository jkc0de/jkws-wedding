import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Add your photo storage host here once uploads are wired up,
    // e.g. { protocol: "https", hostname: "*.public.blob.vercel-storage.com" }
    remotePatterns: [],
  },
};

export default nextConfig;
