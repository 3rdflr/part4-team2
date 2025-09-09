'use client';

import { Button } from '@/components/ui/button';
import { twMerge } from 'tailwind-merge';
import { Plus, Minus } from 'lucide-react';

interface BookingMemberProps {
  className?: string;
  memberCount: number;
  onMemberCountChange: (count: number) => void;
}

export default function BookingMember({
  memberCount,
  onMemberCountChange,
  className,
}: BookingMemberProps) {
  return (
    <div
      className={twMerge(
        'w-full flex justify-between items-center gap-5',
        'flex-row md:flex-col lg:flex-row',
        'md:gap-5 md:items-start lg:items-center',
        className,
      )}
    >
      <h3 className='font-bold'>참여 인원 수</h3>

      <div className='max-w-[140px] md:max-w-none lg:max-w-[140px] w-full flex items-center justify-between border border-gray-100 rounded-3xl'>
        <Button
          variant='ghost'
          size='sm'
          className='disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 rounded-full size-10'
          onClick={() => onMemberCountChange(Math.max(1, memberCount - 1))}
          disabled={memberCount <= 1}
        >
          <Minus className='w-5 h-5' />
        </Button>
        <span className='font-bold'>{memberCount}</span>
        <Button
          className='rounded-full size-10'
          variant='ghost'
          size='sm'
          onClick={() => onMemberCountChange(memberCount + 1)}
        >
          <Plus className='w-5 h-5' />
        </Button>
      </div>
    </div>
  );
}
