'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import 'react-day-picker/style.css';
function BasicCalendar({
  showOutsideDays = true,
  formatters,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();
  return (
    <DayPicker
      className='p-1'
      showOutsideDays={showOutsideDays}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: `${defaultClassNames.root} w-full flex items-center justify-center`,
        day: `w-10 h-10 lg:w-8 lg:h-8 xl:w-10 xl:h-10`,
        day_button: 'w-full h-full',
      }}
      modifiersClassNames={{
        selected: 'bg-primary-500 text-white font-bold rounded-full',
        today: 'bg-primary-100 text-primary-500 font-bold rounded-full cursor-pointer',
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
