'use client';
import { getMyActivitiesList } from '@/app/api/myActivities';
import Spinner from '@/components/common/Spinner';
import ActivitySelect from '@/components/pages/myPage/ActivitySelect';
import ReservationStatusCalendar from '@/components/pages/myPage/ReservationStatusCalendar';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useOverlay } from '@/hooks/useOverlay';
import { Event as RBCEvent } from 'react-big-calendar';
import ReservedScheduleModal from '@/components/pages/myPage/ReservedScheduleModal';
import Image from 'next/image';
import { useScheduleStore } from '@/store/reservedScheduleStore';
import { getReservationDashboard } from '@/app/api/myReservations';

const ReservationStatusPage = () => {
  const overlay = useOverlay();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const { setStatus } = useScheduleStore();

  const [activityId, setActivityId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: activityListData, isLoading: isActivityListLoading } = useQuery({
    queryKey: ['my-activities-list'],
    queryFn: () => getMyActivitiesList({}),
    refetchOnMount: 'always',
  });

  const { data: reservationListData, isLoading: isReservationListLoading } = useQuery({
    queryKey:
      activityId && currentDate
        ? ['reservation-list', activityId, format(currentDate, 'yyyy-MM-dd')]
        : ['reservation-list', 'empty'],
    queryFn: ({ queryKey }) => {
      const [_key, id, date] = queryKey as [string, string, string];

      if (id === 'empty') return Promise.resolve(null);

      const year = format(date, 'yyyy');
      const month = format(date, 'MM');

      return getReservationDashboard(Number(id), { year, month });
    },
    enabled: !!activityId && !!currentDate,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const events = reservationListData?.flatMap((item) => {
    const date = new Date(item.date);
    const result: RBCEvent[] = [];

    if (item.reservations.pending > 0) {
      result.push({
        title: `예약 ${item.reservations.pending}`,
        start: date,
        end: date,
        allDay: true,
      });
    }

    if (item.reservations.confirmed > 0) {
      result.push({
        title: `승인 ${item.reservations.confirmed}`,
        start: date,
        end: date,
        allDay: true,
      });
    }

    if (item.reservations.completed > 0) {
      result.push({
        title: `완료 ${item.reservations.completed}`,
        start: date,
        end: date,
        allDay: true,
      });
    }

    return result;
  });

  const onChangeActivitySelect = (id: string) => {
    setActivityId(id);
  };

  const onNavigateCalendar = (date: Date) => {
    setCurrentDate(date);
  };

  const onClickCalendarDay = (date: string) => {
    overlay.open(({ isOpen, close }) => (
      <ReservedScheduleModal
        activityId={activityId ?? ''}
        date={date}
        isOpen={isOpen}
        onClose={() => {
          close();
          setStatus('pending');
        }}
        onAction={close}
      />
    ));
  };

  const ReservationSection = () => {
    if (!activityListData?.activities || activityListData?.activities.length === 0) {
      return (
        <div className='flex flex-col mx-auto'>
          <Image
            src={'/images/icons/_empty.png'}
            width={182}
            height={182}
            alt='예약 현황 디폴트 이미지'
          />
          <span className='text-18-medium text-grayscale-600'>아직 등록한 체험이 없어요</span>
        </div>
      );
    }

    return (
      <div className='flex flex-col sm:gap-4'>
        <div className='px-4 sm:px-0'>
          <ActivitySelect
            value={activityId ?? undefined}
            activityList={activityListData?.activities ?? []}
            onChange={onChangeActivitySelect}
          />
        </div>
        <ReservationStatusCalendar
          date={currentDate}
          events={events ?? []}
          onNavigate={onNavigateCalendar}
          onClickDate={onClickCalendarDay}
        />
      </div>
    );
  };

  useEffect(() => {
    if (!isActivityListLoading && !isReservationListLoading) {
      setIsInitialLoading(false);
    }
  }, [isActivityListLoading, isReservationListLoading]);

  useEffect(() => {
    if (activityListData && activityListData.activities.length > 0) {
      setActivityId(String(activityListData?.activities[0].id));
    }
  }, [activityListData]);

  if (isInitialLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* 헤더 */}
      <div className='px-6 sm:px-0 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
          <div className='w-full flex flex-col gap-2.5'>
            <Label className='text-[18px] font-bold'>예약 현황</Label>
            <span className='text-14-medium text-grayscale-500'>
              내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
            </span>
          </div>
        </div>
      </div>
      <ReservationSection />
    </div>
  );
};

export default ReservationStatusPage;
