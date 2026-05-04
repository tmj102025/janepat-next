import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "db.aiceo.im" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.ggpht.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/choopak-janeprakon",
        destination: "https://choopak.aiceo.im",
        permanent: true,
      },
      {
        source: "/choopak-janeprakon/:path*",
        destination: "https://choopak.aiceo.im/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
