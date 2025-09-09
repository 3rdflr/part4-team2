'use client';

import { ko } from 'date-fns/locale';
import { format } from 'date-fns';
import { SchedulesByDate } from '@/types/activities.type';
import { BasicCalendar } from '@/components/common/BasicCalendar';

import 'react-day-picker/style.css';

interface BookingCalendarProps {
  schedulesByDate: SchedulesByDate;
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export default function BookingCalendar({
  schedulesByDate,
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) {
  // 사용 가능한 날짜를 문자열 Set으로 관리
  const availableDates = new Set(Object.keys(schedulesByDate));

  // 비활성화할 날짜 판단 로직
  const disabledDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 과거 날짜 체크
    if (date < today) {
      return true;
    }
    // 스케줄이 없는 날짜 체크
    const dateString = format(date, 'yyyy-MM-dd');
    const hasSchedule = availableDates.has(dateString);

    return !hasSchedule;
  };

  return (
    <div className='w-full  flex flex-col items-center gap-2'>
      <div className='w-full flex items-start font-bold'>날짜</div>
      <BasicCalendar
        mode='single'
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDates}
        locale={ko}
      />
    </div>
  );
}
