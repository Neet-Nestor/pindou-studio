'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, BookOpen, Wand2, History, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    href: '/dashboard/inventory',
    label: '库存管理',
    icon: Package,
    color: 'hover:bg-primary/5',
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/blueprints',
    label: '图纸库',
    icon: BookOpen,
    color: 'hover:bg-primary/5',
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/builder',
    label: '图纸生成器',
    icon: Wand2,
    color: 'hover:bg-primary/5',
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/history',
    label: '我的作品',
    icon: History,
    color: 'hover:bg-primary/5',
    activeColor: 'bg-primary text-primary-foreground',
  },
  {
    href: '/dashboard/settings',
    label: '个人设置',
    icon: Settings,
    color: 'hover:bg-primary/5',
    activeColor: 'bg-primary text-primary-foreground',
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r bg-card backdrop-blur-xl transition-all duration-500 ease-out relative',
          collapsed ? 'w-[72px]' : 'w-72',
        )}
      >
        {/* Collapse Toggle */}
        <div className="flex h-16 items-center justify-end px-5 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-10 w-10 rounded-full hover:bg-accent transition-all hover:scale-110"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className={cn(
          'flex-1 space-y-3',
          collapsed ? 'p-3' : 'p-5'
        )}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                data-animate={index + 1}
                className={cn(
                  'group flex items-center gap-4 rounded-xl transition-all duration-300',
                  'hover:shadow-md',
                  isActive
                    ? `${item.activeColor} shadow-md`
                    : `${item.color}`,
                  collapsed ? 'justify-center p-3 w-12 mx-auto' : 'px-4 py-3.5'
                )}
                title={collapsed ? item.label : undefined}
              >
                {collapsed ? (
                  <Icon className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <>
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg transition-all',
                      isActive
                        ? 'bg-white/20'
                        : 'bg-muted/50 group-hover:bg-muted'
                    )}>
                      <Icon className="h-5 w-5 flex-shrink-0" />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom decoration */}
        {!collapsed && (
          <div className="p-5 border-t">
            <div className="p-4 rounded-xl bg-accent border">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 <span className="font-medium">小提示：</span>使用图纸库规划作品，完成后在我的作品中记录
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-xl z-50 shadow-lg">
        <div className="flex items-center justify-around px-3 py-3 safe-area-inset-bottom">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl transition-all duration-300 min-w-[90px]',
                  'active:scale-95',
                  isActive
                    ? `${item.activeColor} shadow-md`
                    : 'text-muted-foreground active:bg-accent/50'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-9 h-9 rounded-lg transition-all',
                  isActive && 'bg-white/20'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
