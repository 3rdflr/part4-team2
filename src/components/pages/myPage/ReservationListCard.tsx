'use client';
import { LoadErrorFallback } from '@/components/common/LoadErrorFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { badgeStatusColor, reservationStatus } from '@/lib/constants/reservation';
import { toFullDot } from '@/lib/utils/dateUtils';
import { Reservation } from '@/types/myReservation.type';
import Image from 'next/image';
import { useOverlay } from '@/hooks/useOverlay';
import PaymentsModal from '../activities/payments/Payments.Modal';

interface ReservationListCardProps {
  reservation: Reservation;
  onCancel: (id: number) => void;
  onReview: (reservation: Reservation) => void;
  onGoReview: (id: number) => void;
}

const ReservationListCard = ({
  reservation,
  onCancel,
  onReview,
  onGoReview,
}: ReservationListCardProps) => {
  const { id, activity, status, totalPrice, headCount, date, startTime, endTime, reviewSubmitted } =
    reservation;
  const overlay = useOverlay();

  const { bannerImageUrl, title } = activity;
  const baseImageUrl = '/images/icons/_empty.png';

  const handlePayment = () => {
    overlay.open(({ isOpen, close }) => (
      <PaymentsModal isOpen={isOpen} onClose={close} title={title} totalPrice={totalPrice} />
    ));
  };

  return (
    <section className='flex flex-col w-full gap-3'>
      <div className='text-16-bold lg:hidden'>{toFullDot(date)}</div>
      <Card className='w-full min-w-[300px] shadow-xl'>
        <div className='flex items-start justify-between w-full gap-7.5'>
          {/* 예약 내역 내용 */}
          <div className='flex-1 flex flex-col'>
            <CardHeader>
              <Badge size='xs' className={badgeStatusColor[status]}>
                {reservationStatus[status]}
              </Badge>
              <CardTitle className='lg:pt-1.5 pt-1'>{title}</CardTitle>
              <CardDescription>
                <div className='flex items-center pb-0 lg:pb-2'>
                  <div className='lg:block hidden'>
                    {toFullDot(date)}
                    <span className='text-lg px-1'>∙</span>
                  </div>
                  <div className='flex items-center'>{`${startTime} - ${endTime}`}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <div className='flex-1 flex items-end justify-between pb-7.5'>
              <CardContent className='pb-0 flex-1'>
                <p className='text-16-bold md:text-18-bold'>
                  ₩{(totalPrice / headCount).toLocaleString()}
                  <span className='text-14-medium md:text-16-medium text-grayscale-400'>
                    {' '}
                    / {headCount}명
                  </span>
                </p>
              </CardContent>
              <CardFooter className='gap-2 hidden lg:flex lg:px-0 pb-0'>
                {status === 'completed' &&
                  (!reviewSubmitted ? (
                    <Button size='xs' onClick={() => onReview(reservation)}>
                      후기 작성
                    </Button>
                  ) : (
                    <Button size='xs' onClick={() => onGoReview(activity.id)}>
                      후기 보기
                    </Button>
                  ))}

                {(status === 'pending' || status === 'confirmed') && (
                  <div className='flex gap-2'>
                    <Button variant='secondary' size='xs' onClick={() => onCancel(id)}>
                      예약 취소
                    </Button>
                    <Button onClick={handlePayment} size='xs'>
                      결제하기
                    </Button>
                  </div>
                )}
              </CardFooter>
            </div>
          </div>

          {/* 예약내역 이미지 */}
          <div className='pt-9 pr-6 lg:pr-7.5 flex-shrink-0'>
            <div className='relative lg:w-[142px] lg:h-[142px] w-[82px] h-[82px] box-border'>
              <LoadErrorFallback
                fallback={
                  <Image
                    src={baseImageUrl}
                    alt='이미지를 불러올 수 없습니다'
                    fill
                    className='lg:rounded-4xl rounded-2xl bg-grayscale-50 object-cover'
                  />
                }
              >
                <Image
                  src={bannerImageUrl}
                  alt='예약내역 썸네일'
                  fill
                  className='lg:rounded-4xl rounded-2xl bg-grayscale-50 object-cover'
                  blurDataURL={baseImageUrl}
                />
              </LoadErrorFallback>
            </div>
          </div>
        </div>
      </Card>
      <div className='flex gap-3 lg:hidden'>
        {status === 'completed' &&
          (!reviewSubmitted ? (
            <Button
              size='sm'
              className='w-full min-w-[300px] '
              onClick={() => onReview(reservation)}
            >
              후기 작성
            </Button>
          ) : (
            <Button
              size='sm'
              className='w-full min-w-[300px] '
              onClick={() => onGoReview(activity.id)}
            >
              후기 보기
            </Button>
          ))}

        {(status === 'pending' || status === 'confirmed') && (
          <div className='flex-1 flex gap-3 min-w-[300px]'>
            <Button variant='secondary' size='sm' className='flex-1 ' onClick={() => onCancel(id)}>
              예약 취소
            </Button>
            <Button onClick={handlePayment} size='sm' className='flex-1'>
              결제하기
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservationListCard;
