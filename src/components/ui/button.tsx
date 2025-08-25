import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/shadCnUtils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-[12px] text-sm font-medium transition-all disabled:pointer-events-none disabled:bg-[var(--grayscale-200)] disabled:text-[var(--grayscale-25)] [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--primary-500)] text-primary-foreground hover:bg-[var(--primary-400)] font-[600]',
        secondary:
          'bg-white text-[var(--grayscale-600)] border border-[var(--grayscale-200)] font-[600]',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      size: {
        xs: 'h-[34px] rounded-[12px] text-[14px] px-3',
        sm: 'h-[41px] rounded-[12px] text-[14px] px-3 has-[>svg]:px-2.5',
        md: 'h-[48px] rounded-[14px] text-[16px] px-5 has-[>svg]:px-4',
        lg: 'h-[54px] rounded-[16px] text-[16px] px-5 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'sm',
    },
  },
);

/**
 * 공통 Button 컴포넌트
 *
 * - `variant`, `size`를 통해 스타일 지정
 * - `asChild` 옵션을 통해 다른 태그 / 컴포넌트로 교체 가능
 * - 기본 스타일 `variant='primary'` `size='sm'`
 *
 * @param {'primary'|'secondary'|'ghost'} [variant='primary'] - 버튼 스타일
 * @param {'xs'|'sm'|'md'|'lg'} [size='sm'] - 버튼 크기
 * @param {boolean} [asChild=false] - Slot을 통해 래핑할지 여부
 *
 * @example
 * <Button variant="default" size="sm" onClick={() => alert('클릭!')}>
 *   버튼 테스트
 * </Button>
 * 
 * <Button variant='secondary'>
    <Image
      src='/icon/icon_kakao.svg'
      alt='아이콘'
      width={24}
      height={24}
      className='w-6 h-6 object-contain'
    />
    아이콘
  </Button>
 */

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
