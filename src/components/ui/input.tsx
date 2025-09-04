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
            // 기본 스타일
            'file:text-foreground placeholder:text-muted-foreground selection:bg-[var(--primary-500)] selection:text-primary-foreground dark:bg-input/30 border-[var(--grayscale-100)] flex w-full min-w-0 rounded-[16px] border bg-transparent px-[20px] py-[17px] text-base transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',

            // 배경색과 테두리
            'bg-[var(--input-bg)] border-[var(--border)]',

            // 브라우저 기본 스타일 제거
            'outline-none',
            'valid:outline-none valid:shadow-none',
            'invalid:outline-none invalid:shadow-none',

            // 포커스 스타일
            'focus:outline-none focus:border-[var(--primary-500)] focus:ring-[3px] focus:ring-[var(--primary-300)]/30',
            'focus-visible:outline-none focus-visible:border-[var(--primary-500)] focus-visible:ring-[3px] focus-visible:ring-[var(--primary-300)]/30',

            // 에러 스타일
            'aria-invalid:bg-destructive/10 dark:aria-invalid:bg-destructive/20 aria-invalid:placeholder:text-destructive/50',

            // 패스워드 필드 여백
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
                width={26}
                height={26}
                alt='비밀번호 숨김'
                src='/images/icons/active_off.svg'
                className='relative left-[1px] bottom-[1px]'
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
