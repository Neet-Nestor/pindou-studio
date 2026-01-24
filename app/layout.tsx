import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: '拼豆工坊 - Perler Beads Studio',
    template: '%s | 拼豆工坊'
  },
  description: '管理拼豆库存，发现创意图纸，分享精彩作品。专为拼豆爱好者打造的一站式创作平台。支持多品牌（MARD、COCO、Hama、Perler等），云端同步，在线图纸库。',
  keywords: ['拼豆', 'perler beads', '拼豆图纸', '库存管理', 'MARD', 'COCO', 'Hama', 'Perler', '拼拼豆豆', '手工', 'DIY', '拼豆工坊'],
  authors: [{ name: 'Neet-Nestor' }],
  creator: 'Neet-Nestor',
  publisher: '拼豆工坊',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '拼豆工坊 - Perler Beads Studio',
    description: '管理拼豆库存，发现创意图纸，分享精彩作品。专为拼豆爱好者打造的一站式创作平台。',
    url: '/',
    siteName: '拼豆工坊',
    locale: 'zh_CN',
    type: 'website',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: '拼豆工坊 Logo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '拼豆工坊 - Perler Beads Studio',
    description: '管理拼豆库存，发现创意图纸，分享精彩作品。专为拼豆爱好者打造的一站式创作平台。',
    images: ['/icon.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-17SHKD7DV6"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-17SHKD7DV6');
            `,
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
