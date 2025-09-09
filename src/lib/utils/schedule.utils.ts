import { isToday, isAfter, parse } from 'date-fns';
import { ScheduleTime } from '@/types/activities.type';

/**
 * 선택된 날짜의 시간 슬롯에서 과거 시간을 필터링합니다.
 * 오늘 날짜인 경우에만 현재 시간 이후의 시간만 반환하고,
 * 다른 날짜는 모든 시간을 그대로 반환합니다.
 */
export function filterAvailableScheduleTimes(
  schedules: ScheduleTime[] | undefined,
  selectedDate: Date,
): ScheduleTime[] | undefined {
  if (!schedules) return undefined;

  // 오늘 날짜가 아니면 모든 시간 반환
  if (!isToday(selectedDate)) {
    return schedules;
  }

  // 오늘 날짜면 현재 시간 이후의 시간만 필터링
  const now = new Date();
  return schedules.filter((schedule) => {
    const scheduleTime = parse(schedule.startTime, 'HH:mm', now);
    return isAfter(scheduleTime, now);
  });
}
