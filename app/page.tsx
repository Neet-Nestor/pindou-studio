import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Search, Download, Palette, Cloud, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="拼豆Studio" width={32} height={32} className="h-8 w-8" />
            <h1 className="text-xl font-bold">拼豆Studio</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">登录</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">立即开始</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8 mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              专为拼豆爱好者设计
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              让拼豆库存管理
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                变得简单高效
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              告别繁琐的手工记录，用智能化的方式管理您的拼豆颜色库存。
              <br className="hidden sm:block" />
              实时同步，随时随地掌握您的创作资源。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button size="lg" className="text-lg px-10 h-12 shadow-lg hover:shadow-xl transition-shadow" asChild>
                <Link href="/signup">
                  免费开始使用
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 h-12" asChild>
                <Link href="/login">
                  已有账号？登录
                </Link>
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">丰富的色库</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  内置最常用的 221 种拼豆颜色，覆盖主流品牌色号，开箱即用
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Search className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">智能搜索</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  通过颜色代码、片号或名称快速查找，支持多维度筛选排序
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cloud className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">云端同步</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  数据实时云端保存，多设备无缝同步，永不丢失
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Palette className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">个性化管理</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  自定义片号、颜色名称和备注，打造专属于您的管理方式
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">极速操作</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  一键增减库存数量，快捷按钮让记录变得轻松愉快
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="h-14 w-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Download className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">数据备份</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  支持一键导出导入，数据完全掌握在您手中
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="mt-24 text-center">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-background shadow-xl">
              <CardContent className="py-16 px-8">
                <h3 className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  开启您的智能库存管理之旅
                </h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  这是一款纯粹的实用工具，完全免费、无广告、注重隐私。
                  <br className="hidden sm:block" />
                  无需繁琐设置，注册即可开始使用，专注于创作本身。
                </p>
                <div className="flex flex-col items-center justify-center gap-5">
                  <Button size="lg" className="text-lg px-10 h-12 shadow-lg hover:shadow-xl transition-shadow" asChild>
                    <Link href="/signup">
                      立即免费注册
                    </Link>
                  </Button>
                  <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="text-green-500">✓</span> 永久免费
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-green-500">✓</span> 无广告
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-green-500">✓</span> 隐私安全
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
