import { Modal } from 'react-simplified-package';
import { Button } from '@/components/ui/button';
import { ScheduleTime } from '@/types/activities.type';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { createReservation, ReservationRequest } from '@/app/api/activities';
import { useOverlay } from '@/hooks/useOverlay';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import { successToast } from '@/lib/utils/toastUtils';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

interface BookingConfirmModalProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  activityId: number;
  selectedDate: Date;
  selectedScheduleTime: ScheduleTime;
  memberCount: number;
  totalPrice: number;
}

const BookingConfirmModal = ({
  className,
  isOpen,
  onClose,
  title,
  activityId,
  selectedDate,
  selectedScheduleTime,
  memberCount,
  totalPrice,
}: BookingConfirmModalProps) => {
  const overlay = useOverlay();
  const router = useRouter();

  const { mutate: makeReservation } = useMutation({
    mutationFn: async ({
      activityId,
      reservationData,
    }: {
      activityId: number;
      reservationData: ReservationRequest;
    }) => createReservation(activityId, reservationData),

    onSuccess: async (data) => {
      console.log('🎫 [BookingConfirmModal] 예약 성공:', data);
      onClose();
      successToast.run('예약이 완료되었습니다!');
      router.push('/mypage/reservation-list');
    },
    onError: (error: unknown) => {
      console.error('❗ [BookingConfirmModal] 예약 실패:', error);
      const axiosError = error as AxiosError<{ message: string }>;
      console.log('🔍 에러 정보:', {
        isAxiosError: axiosError?.isAxiosError,
        status: axiosError?.response?.status,
        message: axiosError?.message,
      });

      // 401 Unauthorized 에러인 경우 로그인 페이지로 리다이렉트
      if (axiosError?.response?.status === 401) {
        console.log('🚨 예약 실패: 로그인 필요');
        overlay.open(({ isOpen, close }) => (
          <ConfirmActionModal
            isOpen={isOpen}
            onClose={close}
            title='로그인이 필요합니다.'
            actionText='로그인하기'
            exitText='취소'
            onAction={() => {
              close();
              onClose(); // 예약 모달 닫기
              router.push('/login');
            }}
          />
        ));
        return;
      }

      overlay.open(({ isOpen, close }) => (
        <ConfirmActionModal
          isOpen={isOpen}
          onClose={close}
          title={axiosError?.response?.data?.message ?? '예약에 실패했습니다.'}
          actionText='다시 시도'
          exitText='취소'
          onAction={() => {
            close();
            makeReservation({
              activityId,
              reservationData: {
                scheduleId: selectedScheduleTime.id,
                headCount: memberCount,
              },
            });
          }}
        />
      ));
    },
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName={clsx('bg-white !p-7.5 !rounded-3xl', className)}
      buttonClassName='!hidden'
    >
      <div className='flex flex-col items-center gap-6 w-65 sm:w-85'>
        <span className='text-18-bold'>{title}</span>
        <div className='w-full flex flex-col gap-4 p-6 bg-grayscale-25 rounded-2xl border border-grayscale-100'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-grayscale-600 font-medium'>예약 날짜</span>
            <span className='text-base font-bold text-grayscale-900'>
              {format(selectedDate, 'yyyy년 MM월 dd일')}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm text-grayscale-600 font-medium'>예약 시간</span>
            <span className='text-base font-bold text-grayscale-900'>
              {selectedScheduleTime.startTime} - {selectedScheduleTime.endTime}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-sm text-grayscale-600 font-medium'>참여 인원</span>
            <span className='text-base font-bold text-grayscale-900'>{memberCount}명</span>
          </div>

          <hr className='border-grayscale-200' />

          <div className='flex items-center justify-between'>
            <span className='text-base font-bold text-grayscale-900'>총 금액</span>
            <span className='text-lg font-bold text-primary-500'>
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className='flex justify-between items-center w-full'>
          <Button size='md' variant='ghost' onClick={onClose}>
            취소
          </Button>
          <Button
            size='md'
            onClick={() => {
              console.log('🔘 예약 확정 버튼 클릭됨');
              makeReservation({
                activityId,
                reservationData: {
                  scheduleId: selectedScheduleTime.id,
                  headCount: memberCount,
                },
              });
            }}
          >
            예약 확정
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingConfirmModal;
