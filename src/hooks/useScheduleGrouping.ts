import { useMemo } from 'react';
import { AvailableSchedule, Schedule } from '@/types/activities.type';

/**
 * 기본 스케줄을 날짜별로 그룹화하는 훅
 * @param baseSchedules 원본 스케줄 배열
 * @returns 날짜별로 그룹화된 AvailableSchedule 배열
 */
export function useScheduleGrouping(baseSchedules: Schedule[]): AvailableSchedule[] {
  return useMemo(() => {
    // 날짜별 스케줄 맵
    const groupByDate = Object.groupBy(baseSchedules, (schedule) => schedule.date);
    return Object.entries(groupByDate).map(([date, schedules]) => ({
      date,
      times: (schedules ?? []).map((schedule) => ({
        id: schedule.id,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      })),
    }));
  }, [baseSchedules]);
}
