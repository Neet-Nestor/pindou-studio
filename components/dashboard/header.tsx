'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Package, BookOpen, History, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSignOut: () => void;
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

const navItems = [
  {
    href: '/dashboard/inventory',
    label: '库存管理',
    icon: Package,
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/blueprints',
    label: '图纸库',
    icon: BookOpen,
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/history',
    label: '我的作品',
    icon: History,
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/settings',
    label: '个人设置',
    icon: Settings,
    activeColor: 'bg-primary text-primary-foreground',
  },
];

export function DashboardHeader({ onSignOut, user }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b bg-card/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="flex h-16 items-center justify-between px-5">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle asChild>
                  <Logo href="/dashboard/inventory" size="md" />
                </SheetTitle>
              </SheetHeader>

              {/* User Profile Section */}
              {user && (
                <Link
                  href="/dashboard/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-4 mt-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                    <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name || '未命名用户'}</p>
                    <p className="text-xs text-muted-foreground">查看个人设置</p>
                  </div>
                </Link>
              )}

              <nav className="mt-6 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all',
                        isActive
                          ? `${item.activeColor} shadow-md`
                          : 'hover:bg-accent'
                      )}
                    >
                      <div className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg',
                        isActive ? 'bg-white/20' : 'bg-muted/50'
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <Logo href="/dashboard/inventory" size="md" className="hidden md:flex" />

        {/* Mobile Logo (Centered) */}
        <Logo
          href="/dashboard/inventory"
          size="sm"
          className="md:hidden absolute left-1/2 -translate-x-1/2 gap-2.5"
        />

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {user && (
            <Link
              href="/dashboard/settings"
              className="hidden md:flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full hover:bg-accent transition-colors"
            >
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
            </Link>
          )}
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-3 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">退出</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
