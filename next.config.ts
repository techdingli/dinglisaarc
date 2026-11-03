import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // CMS uploads are served from the Supabase Storage bucket.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hehrynjgpmdpbfgdxnvn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
