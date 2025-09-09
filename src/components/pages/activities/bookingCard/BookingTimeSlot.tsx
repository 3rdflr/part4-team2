'use client';

import { Button } from '@/components/ui/button';
import { ScheduleTime } from '@/types/activities.type';
import clsx from 'clsx';

interface BookingTimeSlotProps {
  scheduleTime: ScheduleTime;
  selectedScheduleId?: number;
  onTimeSlotSelect: (scheduleTime: ScheduleTime) => void;
}

export default function BookingTimeSlot({
  scheduleTime,
  selectedScheduleId,
  onTimeSlotSelect,
}: BookingTimeSlotProps) {
  return (
    <Button
      variant={selectedScheduleId === scheduleTime.id ? 'primary' : 'secondary'}
      onClick={() => onTimeSlotSelect(scheduleTime)}
      className={clsx(
        'w-full text-sm',
        selectedScheduleId === scheduleTime.id ? ' bg-primary-300 hover:bg-primary-200' : '',
      )}
    >
      {scheduleTime.startTime} - {scheduleTime.endTime}
    </Button>
  );
}
