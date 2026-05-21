import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors gap-1.5 whitespace-nowrap',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-white',
        secondary:
          'bg-neutral-100 text-neutral-700 border border-neutral-200/70',
        outline:
          'text-neutral-700 border border-neutral-200/70',
        success:
          'bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning:
          'bg-amber-50 text-amber-700 border border-amber-200',
        info: 'bg-blue-50 text-blue-700 border border-blue-200',
        danger:
          'bg-red-50 text-red-700 border border-red-200',
        neutral:
          'bg-neutral-100 text-neutral-600 border border-neutral-200/70',
        orange:
          'bg-orange-50 text-orange-700 border border-orange-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
