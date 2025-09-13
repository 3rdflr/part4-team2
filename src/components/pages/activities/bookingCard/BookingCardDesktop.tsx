'use client';

import { Button } from '@/components/ui/button';
import BookingTimeList from './BookingTimeList';
import BookingMember from './BookingMember';
import clsx from 'clsx';
import { format } from 'date-fns';
import { filterAvailableScheduleTimes } from '@/lib/utils/schedule.utils';
import { BookingCardProps } from './BookingContainer';
import { BookingDateInput } from './BookingDateInput';

export default function BookingCardDesktop({
  price,
  totalPrice,
  schedulesByDate,
  selectedDate,
  selectedScheduleId,
  memberCount,
  onDateSelect,
  onTimeSlotSelect,
  onMemberCountChange,
  onBooking,
}: BookingCardProps) {
  const selectedSchedule = selectedDate
    ? filterAvailableScheduleTimes(
        schedulesByDate[format(selectedDate, 'yyyy-MM-dd')],
        selectedDate,
      )
    : undefined;

  return (
    <div
      className={clsx(
        'bg-white border border-card-border rounded-3xl p-4 shadow-sm',
        'flex flex-col gap-6',
      )}
    >
      {/* 가격 */}
      <div className='flex items-center gap-1'>
        <span className='text-xl font-bold'>₩{price.toLocaleString()}</span>
        <span className='text-lg text-gray-500'> / 인</span>
      </div>
      <BookingDateInput
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        schedulesByDate={schedulesByDate}
      />

      <BookingTimeList
        selectedDate={selectedDate}
        selectedScheduleId={selectedScheduleId}
        selectedSchedule={selectedSchedule}
        onTimeSlotSelect={onTimeSlotSelect}
      />
      <BookingMember memberCount={memberCount} onMemberCountChange={onMemberCountChange} />

      {/* Total Price & Booking Button */}
      <hr className='border-t border-gray-100' />
      <div className='flex flex-col gap-3'>
        <div className='flex items-center gap-2'>
          <span className='text-md font-bold'>총 금액</span>
          <span className='text-md font-bold'>₩{totalPrice.toLocaleString()}</span>
        </div>
        <Button
          variant='primary'
          className='w-full'
          onClick={onBooking}
          disabled={!selectedScheduleId}
        >
          예약하기
        </Button>
      </div>
    </div>
  );
}
