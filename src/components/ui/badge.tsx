import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils/shadCnUtils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border text-base font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-[var(--grayscale-100)] text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
      },
      selected: {
        true: 'bg-[var(--primary-500)] text-white border-none',
      },
      size: {
        xs: 'text-[13px] font-bold px-2 py-0.5',
        sm: 'text-base px-3.5 py-1.5 hover:bg-[var(--primary-100)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

function Badge({
  className,
  variant,
  size,
  selected = false,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant, size, selected }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
