import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve the files in /public as-is. They are already compressed WebP, and
    // Vercel's optimizer refuses new transformations once the plan's image
    // quota is used up (HTTP 402), which left new images blank on the site.
    // CMS uploads come with their own resized copies (see cms/collections/Media).
    unoptimized: true,
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
