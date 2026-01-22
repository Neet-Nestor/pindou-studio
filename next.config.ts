import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  basePath: '/projects/pindou',
  assetPrefix: '/projects/pindou',
};

export default withNextIntl(nextConfig);
