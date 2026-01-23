import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, BookImage, Map, Users, Cloud, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo href="/" size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
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

            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              拼豆创作者的
              <br />
              <span className="text-primary">
                完整工具平台
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              智能库存管理 · 作品记录保存 · 图纸社区探索
              <br className="hidden sm:block" />
              一站式解决拼豆创作中的所有需求
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

          {/* Features Section Header */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              核心功能
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              从库存管理到作品分享，为您的创作提供全方位支持
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">丰富的色库</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  多达 291 种颜色，可自选多种常用颜色搭配
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">智能库存管理</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  实时追踪色号库存，快速搜索和筛选，一键增减数量
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookImage className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">作品记录</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  保存创作历史，记录每件作品的照片、用料和创作时间
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-secondary/5 to-background">
              <CardHeader>
                <div className="h-14 w-14 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/30">
                  <Cloud className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">云端同步</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  数据实时云端保存，多设备无缝同步，永不丢失
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-secondary/5 to-background">
              <CardHeader>
                <div className="h-14 w-14 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/30">
                  <Map className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">图纸浏览</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  发现和收藏各种拼豆图纸，获取创作灵感
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 hover:border-secondary/50 hover:shadow-xl transition-all duration-300 group bg-gradient-to-br from-secondary/5 to-background">
              <CardHeader>
                <div className="h-14 w-14 bg-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-secondary/30">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl">分享交流</CardTitle>
                <CardDescription className="text-base leading-relaxed pt-2">
                  展示您的作品，与其他拼豆爱好者互动交流
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-32 text-center">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-accent/50 via-muted/30 to-background shadow-xl">
              <CardContent className="py-16 px-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-5 text-primary">
                  开启您的拼豆创作之旅
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  一站式拼豆工具平台，完全免费、无广告、注重隐私。
                  <br className="hidden sm:block" />
                  管理库存、记录作品、发现灵感，让创作更加轻松愉快。
                </p>
                <div className="flex flex-col items-center justify-center gap-5">
                  <Button size="lg" className="text-lg px-12 h-14 shadow-lg hover:shadow-xl transition-shadow" asChild>
                    <Link href="/signup">
                      立即免费注册
                    </Link>
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
                      <span className="text-secondary font-bold">✓</span>
                      <span className="text-foreground font-medium">永久免费</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
                      <span className="text-secondary font-bold">✓</span>
                      <span className="text-foreground font-medium">无广告</span>
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 rounded-full">
                      <span className="text-secondary font-bold">✓</span>
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
  );
}
