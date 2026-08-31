import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/merchants",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
