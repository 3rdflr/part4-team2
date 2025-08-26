import { useState } from 'react';
import * as React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils/shadCnUtils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    return (
      <div className='relative'>
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          data-slot='input'
          onInvalid={(e) => e.preventDefault()}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-[var(--primary-300)] selection:text-primary-foreground dark:bg-input/30 border-[var(--grayscale-100)] flex w-full min-w-0 rounded-[16px] border bg-transparent px-[20px] py-[17px] text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

            'focus-visible:border-[var(--primary-200)] focus-visible:ring-[var(--primary-200)]/30 focus-visible:ring-[3px]',

            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',

            isPassword && 'pr-[50px]',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type='button'
            className='absolute top-1/2 right-[24px] -translate-y-1/2'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Image width={24} height={24} alt='비밀번호 표시' src='/images/icons/active_on.svg' />
            ) : (
              <Image
                width={24}
                height={24}
                alt='비밀번호 숨김'
                src='/images/icons/active_off.svg'
              />
            )}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input };
