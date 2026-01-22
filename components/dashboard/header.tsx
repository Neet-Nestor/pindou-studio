'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Package, BookOpen, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
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
  },
  {
    href: '/dashboard/blueprints',
    label: '图纸库',
    icon: BookOpen,
  },
  {
    href: '/dashboard/history',
    label: '作品历史',
    icon: History,
  },
];

export function DashboardHeader({ onSignOut }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Image src="/icon.png" alt="拼豆Studio" width={28} height={28} />
                  <span>拼豆工作室</span>
                </SheetTitle>
              </SheetHeader>
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
                        'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Logo */}
        <Link href="/dashboard/inventory" className="hidden md:flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/icon.png" alt="拼豆Studio" width={28} height={28} className="h-7 w-7" />
          <h1 className="text-lg font-bold">拼豆Studio</h1>
        </Link>

        {/* Mobile Logo (Centered) */}
        <Link href="/dashboard/inventory" className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/icon.png" alt="拼豆Studio" width={24} height={24} />
          <h1 className="text-base font-bold">拼豆Studio</h1>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={onSignOut}
          >
            退出
          </Button>
        </div>
      </div>
    </header>
  );
}
