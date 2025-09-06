'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import BookingCardDesktop from './BookingCardDesktop';
import BookingCardMobile from './BookingCardMobile';
import BookingError from '@/components/pages/activities/bookingCard/BookingError';
import { ErrorBoundary } from 'react-error-boundary';
import { getAvailableSchedule } from '@/app/api/activities';
import { Schedule } from '@/types/activities.type';
import { useScheduleGrouping } from '@/hooks/useScheduleGrouping';

interface BookingCardProps {
  activityId: string;
  activityTitle: string;
  price: number;
  baseSchedules: Schedule[];
}

function BookingCardContent({ activityId, activityTitle, price, baseSchedules }: BookingCardProps) {
  //선택한 날짜
  const [selectedDate, setSelectedDate] = useState<Date>();
  //선택한 스케줄ID
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>();
  //선택한 인원 수
  const [headCount, setHeadCount] = useState(1);

  // 기본 스케줄을 날짜별로 그룹화
  const baseAvailableSchedules = useScheduleGrouping(baseSchedules);

  // 선택된 날짜의 상세 스케줄 조회 (실제 예약 가능한 시간)
  const { data: detailedSchedules, isLoading: isLoadingDetailed } = useQuery({
    queryKey: ['availableSchedule', activityId, selectedDate?.toISOString().split('T')[0]],
    queryFn: () => {
      const dateStr = selectedDate!.toISOString().split('T')[0];
      const [year, month] = dateStr.split('-');
      return getAvailableSchedule(Number(activityId), { year, month: month.padStart(2, '0') });
    },
    enabled: !!selectedDate,
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });

  // 표시할 스케줄: 날짜 선택 전에는 기본 스케줄, 선택 후에는 상세 스케줄
  const displaySchedules =
    selectedDate && detailedSchedules ? detailedSchedules : baseAvailableSchedules;

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedScheduleId(undefined); // 날짜 변경 시 시간 선택 초기화

    // 선택한 날짜에 대한 상세 스케줄 API 호출이 자동으로 실행됨
    console.log('📅 [BookingCard] 날짜 선택:', date?.toISOString().split('T')[0]);
  };

  // 시간 슬롯 선택 핸들러
  const handleTimeSlotSelect = (scheduleId: number) => {
    setSelectedScheduleId(scheduleId);
  };

  // 인원 수 변경 핸들러
  const handleHeadCountChange = (count: number) => {
    setHeadCount(count);
  };

  const handleBooking = () => {
    if (!selectedScheduleId) return;

    console.log('🎫 [BookingCard] 예약 요청:', {
      activityId,
      scheduleId: selectedScheduleId,
      headCount,
      totalPrice: price * headCount,
    });

    // TODO: 실제 예약 API 호출
    alert(`예약이 완료되었습니다!\n총 ${headCount}명, ${(price * headCount).toLocaleString()}원`);
  };

  // Shared props for both desktop and mobile components
  const sharedProps = {
    price,
    availableSchedules: displaySchedules,
    isLoading: isLoadingDetailed,
    selectedDate,
    selectedScheduleId,
    headCount,
    onDateSelect: handleDateSelect,
    onTimeSlotSelect: handleTimeSlotSelect,
    onHeadCountChange: handleHeadCountChange,
    onBooking: handleBooking,
  };

  return (
    <>
      {/* Desktop version */}
      <div className='hidden lg:block'>
        <BookingCardDesktop {...sharedProps} />
      </div>

      {/* Mobile/Tablet version */}
      <div className='lg:hidden'>
        <BookingCardMobile
          activityTitle={activityTitle}
          price={price}
          availableSchedules={displaySchedules}
          selectedDate={selectedDate}
          selectedScheduleId={selectedScheduleId}
          headCount={headCount}
          onDateSelect={handleDateSelect}
          onTimeSlotSelect={handleTimeSlotSelect}
          onHeadCountChange={handleHeadCountChange}
          onBooking={handleBooking}
        />
      </div>
    </>
  );
}

// Error boundary로 래핑된 메인 컴포넌트
export default function BookingCard(props: BookingCardProps) {
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => <BookingError resetError={resetErrorBoundary} />}
    >
      <BookingCardContent {...props} />
    </ErrorBoundary>
  );
}
