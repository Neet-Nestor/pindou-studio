'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Package, BookOpen, History, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
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
    activeColor: 'bg-secondary text-secondary-foreground',
  },
  {
    href: '/dashboard/history',
    label: '我的作品',
    icon: History,
    activeColor: 'bg-primary text-primary-foreground',
  },
];

export function DashboardHeader({ onSignOut }: HeaderProps) {
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
              <nav className="mt-8 space-y-2">
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
