'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import 'react-day-picker/style.css';

function BasicCalendar({
  showOutsideDays = true,
  formatters,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className='p-4'
      showOutsideDays={showOutsideDays}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      modifiersClassNames={{
        selected: 'bg-primary-500 text-white font-bold rounded-full',
        today: 'bg-primary-100 text-primary-500 font-bold rounded-full',
      }}
      components={{
        Chevron: (props) =>
          props.orientation === 'left' ? (
            <ChevronLeftIcon className='w-5 h-5 text-gray-950' />
          ) : (
            <ChevronRightIcon className='w-5 h-5 text-gray-950' />
          ),
      }}
      {...props}
    />
  );
}

export { BasicCalendar };
