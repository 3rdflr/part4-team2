'use client';
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
import { reservationStatus } from '@/lib/constants/reservation';
import { toCardDate } from '@/lib/utils/dateUtils';
import { ReservationStatus } from '@/types/activities.type';
import { Reservation } from '@/types/myReservation.type';
import Image from 'next/image';
import { useState } from 'react';

interface MyExperienceCardProps {
  data: Reservation;
  onCancel: (id: number) => void;
  onReview: (id: number) => void;
}

const ReservationListCard = ({ data, onCancel, onReview }: MyExperienceCardProps) => {
  const { id, activity, status, totalPrice, headCount, date, startTime, endTime } = data;

  const { bannerImageUrl, title } = activity;
  const [isError, setIsError] = useState(false);
  const baseImageUrl = '/images/icons/_empty.png';
  const image = isError ? baseImageUrl : bannerImageUrl;

  const badgeStatusColor: Record<ReservationStatus, string> = {
    pending: 'bg-primary-100 text-primary-500',
    confirmed: 'bg-[var(--badge-green-light)] text-[var(--badge-green-dark)]',
    declined: 'bg-[var(--badge-coral-light)] text-[var(--badge-coral-dark)]',
    canceled: 'bg-gray-100 text-gray-600',
    completed: 'bg-[var(--badge-blue-light)] text-[var(--badge-blue-dark)]',
  };

  return (
    <section className='flex flex-col w-full gap-3'>
      <Card className='w-full shadow-xl'>
        <div className='flex items-start justify-between w-full'>
          {/* 예약 내역 내용 */}
          <div className='flex-1 flex flex-col'>
            <CardHeader>
              <Badge size='xs' className={badgeStatusColor[status]}>
                {reservationStatus[status]}
              </Badge>
              <CardTitle className='lg:pt-1.5 pt-1'>{title}</CardTitle>
              <CardDescription>
                <div className='flex items-center gap-0.5 pb-0 lg:pb-2'>
                  {toCardDate(date)} <span className='text-lg px-1'>∙</span>{' '}
                  {`${startTime} - ${endTime}`}
                </div>
              </CardDescription>
            </CardHeader>
            <div className='flex-1 flex items-end justify-between pb-7.5'>
              <CardContent className='pb-0 flex-1'>
                <p className='text-18-bold'>
                  ₩{totalPrice.toLocaleString()}
                  <span className='text-16-medium text-grayscale-400'> / {headCount}명</span>
                </p>
              </CardContent>
              <CardFooter className='gap-2 hidden lg:flex lg:px-0 pb-0'>
                {status === 'completed' && (
                  <Button size='xs' onClick={() => onReview(id)}>
                    후기 작성
                  </Button>
                )}

                {(status === 'pending' || status === 'confirmed') && (
                  <Button variant='secondary' size='xs' onClick={() => onCancel(id)}>
                    예약 취소
                  </Button>
                )}
              </CardFooter>
            </div>
          </div>

          {/* 체험 이미지 */}
          <div className='px-6 lg:px-7.5 pt-9'>
            <div className='relative lg:w-[142px] lg:h-[142px] w-[82px] h-[82px] box-border'>
              <Image
                src={image}
                alt='체험 관리 썸네일'
                layout='fill'
                className='lg:rounded-4xl rounded-2xl bg-grayscale-50 object-cover'
                onError={() => {
                  setIsError(true);
                }}
                blurDataURL={baseImageUrl}
              />
            </div>
          </div>
        </div>
      </Card>
      <div className='flex gap-3 lg:hidden'>
        {status === 'completed' && (
          <Button size='sm' className='w-full' onClick={() => onReview(id)}>
            후기 작성
          </Button>
        )}

        {(status === 'pending' || status === 'confirmed') && (
          <Button variant='secondary' size='sm' className='flex-1' onClick={() => onCancel(id)}>
            예약 취소
          </Button>
        )}
      </div>
    </section>
  );
};

export default ReservationListCard;
