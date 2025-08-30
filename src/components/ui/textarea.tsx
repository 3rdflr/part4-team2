import * as React from 'react';
import { cn } from '@/lib/utils/shadCnUtils';

interface TextareaProps extends React.ComponentProps<'textarea'> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className='flex flex-col w-full'>
        <textarea
          ref={ref}
          className={cn(
            'resize-none border placeholder:text-muted-foreground focus-visible:border-[var(--primary-200)] focus-visible:ring-[var(--primary-200)]/30 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex min-h-16 w-full rounded-xl bg-transparent px-5 py-4 text-base outline-none disabled:cursor-not-allowed disabled:opacity-50',
            error &&
              'border-destructive/20 bg-destructive/10 dark:bg-destructive/20 placeholder:text-destructive/50',
            className,
          )}
          {...props}
        />
        {error && (
          <small className='text-12-medium ml-2 mt-1 text-[var(--secondary-red-500)] leading-[12px]'>
            {error}
          </small>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
