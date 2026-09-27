import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // The site currently also lives on its raw Vercel deployment host —
        // keep that copy out of search results so only the real domain (once
        // connected) gets indexed.
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/catalog/:category",
        destination: "/:category",
        permanent: true,
      },
      {
        source: "/brands/:slug",
        destination: "/brand/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
