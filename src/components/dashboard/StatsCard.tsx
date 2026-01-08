import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'destructive' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const variantStyles = {
  primary: 'stats-gradient-primary',
  success: 'stats-gradient-success',
  warning: 'stats-gradient-warning',
  destructive: 'stats-gradient-destructive',
  info: 'stats-gradient-info',
};

export function StatsCard({ title, value, icon: Icon, variant = 'primary', trend }: StatsCardProps) {
  return (
    <Card className={cn(
      'overflow-hidden border-0 shadow-lg transition-transform duration-200 hover:scale-105',
      variantStyles[variant]
    )}>
      <CardContent className="p-4 text-primary-foreground">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          <div className="p-2 rounded-lg bg-primary-foreground/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className={cn(
            'mt-2 text-xs font-medium',
            trend.isPositive ? 'opacity-90' : 'opacity-90'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
