import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'destructive' | 'info' | 'muted';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const variantStyles = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  muted: 'bg-muted text-muted-foreground border-border',
};

const iconStyles = {
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  destructive: 'bg-destructive/10 text-destructive',
  info: 'bg-info/10 text-info',
  muted: 'bg-muted-foreground/10 text-muted-foreground',
};

export function StatsCard({ title, value, icon: Icon, variant = 'primary', trend, onClick }: StatsCardProps) {
  return (
    <Card 
      className={cn(
        'overflow-hidden border bg-card transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:border-primary/40'
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
          </div>
          <div className={cn('p-2.5 rounded-lg', iconStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {trend && (
          <div className={cn(
            'mt-2 text-xs font-medium',
            trend.isPositive ? 'text-success' : 'text-destructive'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </CardContent>
    </Card>
  );
}
