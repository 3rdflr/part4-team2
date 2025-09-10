'use client';
import { getMyReservationsList, updateReservation } from '@/app/api/myReservations';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { ReviewModal } from '@/components/pages/myActivities/ReviewModal';
import MyExperienceCardSkeleton from '@/components/pages/myPage/MyExperienceSkeleton';
import ReservationListCard from '@/components/pages/myPage/ReservationListCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { useOverlay } from '@/hooks/useOverlay';
import { reservationStatusAll, ReservationStatusWithAll } from '@/lib/constants/reservation';
import {
  MyReservationListResponse,
  MyReservationUpdateRequest,
  MyReservationUpdateResponse,
  Reservation,
} from '@/types/myReservation.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReservationEmptyProps {
  text: string;
}

const ReservationListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatusWithAll>('all');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { data, isLoading } = useQuery<MyReservationListResponse>({
    queryKey: ['reservation-list', selectedStatus],
    queryFn: () =>
      getMyReservationsList({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
      }),
    refetchOnMount: 'always',
  });

  const updateReservationMutation = useMutation<
    MyReservationUpdateResponse,
    AxiosError<{ message: string }>,
    { reservationId: number; data: MyReservationUpdateRequest }
  >({
    mutationFn: ({ reservationId, data }) => updateReservation(reservationId, data),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation-list', selectedStatus] });
      queryClient.invalidateQueries({ queryKey: ['reservation-list', 'all'] });
    },
    onError: (error) => {
      overlay.open(({ isOpen, close }) => (
        <ConfirmModal
          title={error.response?.data?.message}
          isOpen={isOpen}
          onClose={close}
          onAction={close}
        />
      ));
    },
  });

  const { mutate: updateReservationState } = updateReservationMutation;

  const onClickCancel = (id: number) => {
    updateReservationState({ reservationId: id, data: { status: 'canceled' } });
  };

  const onClickShowCancelModal = (id: number) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='예약을 취소하시겠어요?'
        actionText='취소하기'
        isOpen={isOpen}
        onClose={close}
        onAction={() => {
          close();
          onClickCancel(id);
        }}
      />
    ));
  };

  const onClickReview = (reservation: Reservation) => {
    console.log(`id:${reservation.id},` + '후기 작성 버튼 클릭 시 리뷰 모달 호출');
    overlay.open(({ isOpen, close }) => (
      <ReviewModal data={reservation} isOpen={isOpen} onClose={close} />
    ));
  };

  const ReservationEmpty = ({ text }: ReservationEmptyProps) => {
    return (
      <div className='flex flex-col mx-auto items-center'>
        <Image
          src={'/images/icons/_empty.png'}
          width={182}
          height={182}
          priority
          alt='체험 관리 디폴트 이미지'
        />
        <span className='text-18-medium text-grayscale-600'>{text}</span>
      </div>
    );
  };

  const MyReservationList = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col gap-6'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <MyExperienceCardSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (isFirstLoad && !data?.reservations?.length) {
      return (
        <div className='flex flex-col gap-7.5'>
          <ReservationEmpty text='아직 예약한 체험이 없어요' />
          <Button size='lg' onClick={() => router.push('/')}>
            둘러보기
          </Button>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-6 items-center'>
        {data?.reservations?.length ? (
          data?.reservations.map((reservation) => (
            <ReservationListCard
              key={reservation.id}
              data={reservation}
              onCancel={onClickShowCancelModal}
              onReview={onClickReview}
            />
          ))
        ) : (
          <ReservationEmpty text='예약내역이 없어요' />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!isLoading && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [isLoading, isFirstLoad]);

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>예약내역</Label>
          <span className='text-14-medium text-grayscale-500'>
            예약내역을 변경 및 취소할 수 있습니다.
          </span>
          <div className='flex pt-3.5 gap-2'>
            {!(isFirstLoad && !data?.reservations?.length) &&
              (Object.entries(reservationStatusAll) as [ReservationStatusWithAll, string][])
                .filter(([value]) => value !== 'declined')
                .map(([value, label]) => (
                  <Badge
                    key={value}
                    variant='outline'
                    selected={selectedStatus === value}
                    onClick={() => setSelectedStatus(value)}
                  >
                    {label}
                  </Badge>
                ))}
          </div>
        </div>
      </div>

      {/* 예약 내역 카드 목록 */}
      <MyReservationList />
    </div>
  );
};

export default ReservationListPage;
