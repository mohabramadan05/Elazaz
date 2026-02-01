import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "supabase.elazaz.site",
      },
    ],
  },
};

export default nextConfig;
