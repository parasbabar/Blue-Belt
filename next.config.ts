import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Sentry options
  silent: true,
  org: "scholarpay",
  project: "javascript-nextjs",
  sourcemaps: {
    disable: true, // replaces deprecated hideSourceMaps
  },
  disableLogger: false,
});
