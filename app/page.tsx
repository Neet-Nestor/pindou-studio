import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">拼豆库存管理</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight">
              拼豆库存管理
            </h2>
            <p className="text-lg text-muted-foreground">
              选择您拥有的拼豆颜色套装，我们会为您初始化库存
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>我的库存</CardTitle>
              <CardDescription>
                选择您拥有的拼豆颜色套装，我们会为您初始化库存
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button className="w-full" size="lg" asChild>
                <Link href="/inventory">
                  我的库存
                </Link>
              </Button>
              <Button className="w-full" size="lg" variant="outline" asChild>
                <Link href="/onboarding">
                  选择颜色套装
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
