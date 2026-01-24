import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, BookOpen, Palette, History, BarChart3, Sparkles, Cloud } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { StructuredData } from '@/components/seo/structured-data';

export const metadata: Metadata = {
  title: '首页',
  description: '拼豆工坊 - 专为拼豆爱好者打造的一站式创作平台。管理库存、发现图纸、记录作品，支持MARD、COCO、Hama、Perler等多品牌。',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '拼豆工坊',
  alternateName: 'Perler Beads Studio',
  url: process.env.NEXTAUTH_URL || 'https://pindou.neet.coffee',
  description: '管理拼豆库存，发现创意图纸，分享精彩作品。专为拼豆爱好者打造的一站式创作平台。',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  featureList: [
    '多品牌库存管理',
    '在线图纸库',
    '作品分享',
    '云端同步',
    '数据导入导出',
  ],
  inLanguage: 'zh-CN',
  author: {
    '@type': 'Person',
    name: 'Neet-Nestor',
  },
};

export default function Home() {
  return (
    <>
      <StructuredData data={structuredData} />
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo href="/" size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
              <Link href="/gallery">作品展示</Link>
            </Button>
            <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button size="sm" className="h-9 px-3" asChild>
              <Link href="/signup">开始</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex-1 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          {/* Hero Content - Centered */}
          <div className="text-center space-y-8 mb-24">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              专为拼豆爱好者设计
            </div>

            <h2 className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-tight">
              你的拼豆创作
              <br />
              <span className="text-primary font-handwritten">
                工作台
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              管理库存 · 发现图纸 · 分享作品
              <br className="hidden sm:block" />
              专为拼豆爱好者打造的一站式创作平台
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button
                size="lg"
                className="text-lg px-12 h-14 shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/signup">
                  免费开始使用
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-12 h-14"
                asChild
              >
                <Link href="/login">
                  已有账号？登录
                </Link>
              </Button>
            </div>
          </div>

          {/* Three-Pillar Feature Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Pillar 1: Inventory Management */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-background hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Package className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-primary font-handwritten">库存管理</CardTitle>
                <CardDescription className="text-base pt-3">
                  轻松管理你的拼豆材料库存
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">657+ 丰富色库</div>
                    <div className="text-sm text-muted-foreground">支持13个品牌，多种规格</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">智能搜索</div>
                    <div className="text-sm text-muted-foreground">快速查找颜色和编号</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">云端同步</div>
                    <div className="text-sm text-muted-foreground">多设备实时同步，永不丢失</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Blueprint Library */}
            <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-background hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-secondary to-secondary/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-secondary font-handwritten">图纸库</CardTitle>
                <CardDescription className="text-base pt-3">
                  发现创意，找到你的下一个项目
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">浏览图纸</div>
                    <div className="text-sm text-muted-foreground">探索社区创作的精彩图纸</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">创建设计</div>
                    <div className="text-sm text-muted-foreground">记录和分享你自己的图纸</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">颗粒计算</div>
                    <div className="text-sm text-muted-foreground">自动计算所需材料数量</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: Work Sharing */}
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-background hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <History className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-accent font-handwritten">作品分享</CardTitle>
                <CardDescription className="text-base pt-3">
                  记录创作历程，展示你的作品
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">记录作品</div>
                    <div className="text-sm text-muted-foreground">保存每件作品的创作细节</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">照片相册</div>
                    <div className="text-sm text-muted-foreground">每个作品最多5张照片</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">创作统计</div>
                    <div className="text-sm text-muted-foreground">追踪你的创作历程和成就</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Features Grid */}
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 font-handwritten">
              完整功能一览
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              从材料管理到作品展示，全方位支持你的创作
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Row 1: Inventory Features */}
            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">多品牌支持</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  支持MARD、COCO等13个品牌，657种独特颜色
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">快速搜索</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  按颜色、编号或系列快速查找所需材料
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Cloud className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">实时同步</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  云端存储，手机和电脑无缝切换使用
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Row 2: Blueprint Features */}
            <Card className="border-2 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">图纸浏览</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  发现社区分享的各种创意图纸和设计
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Palette className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">设计记录</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  保存你的原创设计，建立个人图纸库
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-secondary/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">材料计算</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  自动计算图纸所需的拼豆数量和颜色
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Row 3: Sharing Features */}
            <Card className="border-2 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <History className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">作品档案</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  记录完成时间、使用材料和创作心得
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">多图展示</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  每个作品支持上传最多5张不同角度照片
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-accent/50 hover:shadow-lg transition-all duration-300 group">
              <CardHeader>
                <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">创作统计</CardTitle>
                <CardDescription className="text-sm leading-relaxed pt-2">
                  追踪完成数量、使用颜色和创作趋势
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-secondary/5 shadow-2xl">
              <CardContent className="py-16 px-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-5 font-handwritten">
                  开启你的拼豆创作之旅
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  完全免费的一站式拼豆工具平台，无广告干扰，注重隐私保护。
                  <br className="hidden sm:block" />
                  管理库存、发现图纸、分享作品，让创作更加轻松愉快。
                </p>
                <div className="flex flex-col items-center justify-center gap-5">
                  <Button size="lg" className="text-lg px-12 h-14 shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link href="/signup">
                      免费开始使用
                    </Link>
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                      <span className="text-primary font-bold text-base">✓</span>
                      <span className="text-foreground font-medium">永久免费</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full border border-secondary/20">
                      <span className="text-secondary font-bold text-base">✓</span>
                      <span className="text-foreground font-medium">无广告</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20">
                      <span className="text-accent-foreground font-bold text-base">✓</span>
                      <span className="text-foreground font-medium">隐私安全</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
