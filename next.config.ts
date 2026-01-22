import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  assetPrefix: process.env.NODE_ENV === 'production'
    ? 'https://pindou-studio.vercel.app'
    : undefined,
};

export default withNextIntl(nextConfig);
