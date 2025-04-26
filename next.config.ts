import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.futabus.vn"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
