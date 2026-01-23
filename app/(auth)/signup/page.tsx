'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '创建账户失败');
      }

      router.push('/login?registered=true');
    } catch (error) {
      setError(error instanceof Error ? error.message : '发生错误，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <Logo href="/" size="lg" className="mb-8" />
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">创建账户</CardTitle>
          <CardDescription className="text-base">开始你的拼豆创作之旅</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border-2 border-destructive/30 text-destructive px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">姓名</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="您的姓名"
                required
                disabled={isLoading}
                className="border-2 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isLoading}
                className="border-2 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                disabled={isLoading}
                minLength={8}
                className="border-2 h-11"
              />
              <p className="text-xs text-muted-foreground">至少8个字符</p>
            </div>

            <Button type="submit" className="w-full h-11 shadow-lg hover:shadow-xl transition-all text-base font-medium" disabled={isLoading}>
              {isLoading ? '注册中...' : '注册'}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            已有账户？{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              登录
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
