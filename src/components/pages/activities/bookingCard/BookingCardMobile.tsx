'use client';
import { useState } from 'react';
import BookingCalendar from './BookingCalendar';
import BookingTimeList from './BookingTimeList';
import BookingMember from './BookingMember';
import clsx from 'clsx';
import { format } from 'date-fns';
import { filterAvailableScheduleTimes } from '@/lib/utils/schedule.utils';
import { BookingCardProps } from './BookingContainer';
import { Button } from '@/components/ui/button';
import { useScreenSize } from '@/hooks/useScreenSize';
import { ArrowLeft } from 'lucide-react';

export default function BookingCardMobile({
  schedulesByDate,
  selectedDate,
  selectedScheduleId,
  memberCount,
  onDateSelect,
  onTimeSlotSelect,
  onMemberCountChange,
  onClose,
}: BookingCardProps) {
  const selectedSchedule = selectedDate
    ? filterAvailableScheduleTimes(
        schedulesByDate[format(selectedDate, 'yyyy-MM-dd')],
        selectedDate,
      )
    : undefined;

  const { isMobile, isTablet } = useScreenSize();
  const [checkSchedule, setCheckSchedule] = useState<boolean>(false);
  const buttonText = () => {
    if (!selectedDate) return '날짜 선택';
    else if (!selectedScheduleId) return '시간 선택';
    else if (isMobile && !checkSchedule) return '인원 선택';
    else return '확인';
  };
  const handleSubmit = () => {
    if (isMobile && !checkSchedule) {
      setCheckSchedule(true);
    } else {
      // 드롭다운 닫기
      onClose?.();
    }
  };

  return (
    <div className={clsx('bg-white  rounded-3xl p-6 md:p-[30px]', 'flex flex-col gap-6 z-[400]')}>
      {(isTablet || !checkSchedule) && (
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 w-full'>
          <BookingCalendar
            schedulesByDate={schedulesByDate}
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />

          <div className='w-full md:h-[350px]'>
            <div className='w-full h-full flex flex-col items-center justify-start gap-4 shadow-none md:shadow-sm md:px-6 md:py-7 rounded-3xl'>
              <BookingTimeList
                selectedDate={selectedDate}
                selectedScheduleId={selectedScheduleId}
                selectedSchedule={selectedSchedule}
                onTimeSlotSelect={onTimeSlotSelect}
                className='flex-1 w-full h-full'
              />
              <BookingMember
                memberCount={memberCount}
                onMemberCountChange={onMemberCountChange}
                className='hidden md:flex'
              />
            </div>
          </div>
        </div>
      )}
      {isMobile && checkSchedule && (
        <div className='w-full flex flex-col items-start gap-2'>
          <div className='flex items-center gap-2'>
            <ArrowLeft
              size={20}
              className='cursor-pointer'
              onClick={() => setCheckSchedule(false)}
            />
            <span className='text-lg font-bold'>인원</span>
          </div>
          <p className='text-sm text-gray-500 '>예약할 인원을 선택해주세요.</p>
          <BookingMember
            memberCount={memberCount}
            onMemberCountChange={onMemberCountChange}
            className='md:hidden'
          />
        </div>
      )}
      <Button
        className='w-full'
        variant='primary'
        disabled={!selectedScheduleId}
        onClick={handleSubmit}
      >
        {buttonText()}
      </Button>
    </div>
  );
}
