import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.futabus.vn", "localhost", "lh3.googleusercontent.com"],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
