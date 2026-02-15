import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.demokrati.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.sds.si", pathname: "/app/uploads/**" },
      { protocol: "https", hostname: "gibanjesvoboda.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "www.levica.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "stranka-resnica.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "prerod.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "socialnidemokrati.si", pathname: "/wp-content/uploads/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/**" },
      { protocol: "https", hostname: "piratskastranka.si", pathname: "/content/images/**" },
    ],
  },
};

export default nextConfig;
