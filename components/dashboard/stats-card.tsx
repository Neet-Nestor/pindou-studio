import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="relative overflow-hidden border-2 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-br from-card to-card/50 group">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />

      <div className="relative p-6">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 space-y-2">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}
