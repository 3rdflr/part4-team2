'use client';

import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useDateInput from '@/hooks/useDateInput';
import { startOfToday, addMonths } from 'date-fns';
import { BasicCalendar } from '@/components/common/BasicCalendar';

interface DateInputProps {
  label?: string;
}

export function DateInput({ label }: DateInputProps) {
  const {
    value,
    date,
    error,
    month,
    handleChange,
    setMonth,
    setDateValid,
    setDate,
    setValue,
    setError,
    formatDate,
  } = useDateInput();
  const [open, setOpen] = useState(false);

  return (
    <div className='flex flex-col gap-1'>
      <Label htmlFor='date' className='px-1'>
        {label}
      </Label>
      <div className='relative flex gap-2'>
        <Input
          id='date'
          value={value}
          placeholder='yyyy/mm/dd'
          className='bg-background pr-10'
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id='date-picker'
              variant='ghost'
              className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
            >
              <CalendarIcon className='size-3.5' />
              <span className='sr-only'>Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className='w-auto overflow-hidden p-0'
            align='end'
            alignOffset={-8}
            sideOffset={10}
          >
            <BasicCalendar
              mode='single'
              selected={date}
              captionLayout='label'
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
                setDateValid(true);
                setError(null);
              }}
              disabled={{ before: startOfToday(), after: addMonths(new Date(), 12) }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {error && <span className='text-secondary-red-500 text-xs px-1'>{error}</span>}
    </div>
  );
}

export default DateInput;
