'use client';

import BookingTimeSlot from './BookingTimeSlot';
import { ScheduleTime } from '@/types/activities.type';

interface BookingTimeListProps {
  selectedDate?: Date; // 선택된 날짜
  selectedScheduleId?: number; // 선택된 스케줄 ID
  selectedSchedule?: ScheduleTime[]; // 선택된 날짜의 스케줄들
  onTimeSlotSelect: (scheduleTime: ScheduleTime) => void; // 스케줄 선택 핸들러
  className?: string; // 추가적인 클래스 이름
}

export default function BookingTimeList({
  selectedDate,
  selectedScheduleId,
  selectedSchedule,
  onTimeSlotSelect,
  className,
}: BookingTimeListProps) {
  // 선택된 날짜의 스케줄들을 표시합니다.

  return (
    <div className={className}>
      <div data-booking-timelist className='flex flex-col gap-2'>
        {/* Time Slots */}
        <div className='font-bold flex items-center'>예약 가능한 시간</div>

        {!selectedDate || !selectedSchedule ? (
          <div className='p-4 text-center text-gray-500 '>
            {!selectedDate ? '날짜를 선택해주세요' : '예약 가능한 시간이 없습니다'}
          </div>
        ) : (
          <div className='flex flex-col gap-2 lg:gap-3 max-h-[150px] lg:max-h-[200px] overflow-y-auto'>
            {selectedSchedule.map((schedule) => (
              <BookingTimeSlot
                key={schedule.id}
                scheduleTime={schedule}
                selectedScheduleId={selectedScheduleId}
                onTimeSlotSelect={onTimeSlotSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
