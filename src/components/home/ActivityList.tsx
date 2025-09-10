'use client';

import { useEffect } from 'react';
import { Activity } from '@/types/activities.type';
import { useUserStore } from '@/store/userStore';
import { useElementInView } from '@/hooks/useElemetInView';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { ChevronRight, MapPinCheckInside } from 'lucide-react';
import Spinner from '../common/Spinner';
import ActivityCard from './ActivityCard';
import Image from 'next/image';

export default function ActivityList({
  initialActivities,
  initalCursorId,
}: {
  initialActivities: Activity[];
  initalCursorId: number;
}) {
  // 유저 확인
  const user = useUserStore((state) => state.user);

  const [targetRef, isInView] = useElementInView();

  const { allActivities, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, searchParams } =
    useInfiniteList(initialActivities, initalCursorId);

  useEffect(() => {
    if (isInView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasFilters = (() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    return params.toString() !== '';
  })();

  if (allActivities.length === 0)
    return (
      <div className='flex flex-col items-center justify-center gap-7 mt-50'>
        <div className='flex flex-col items-center justify-center'>
          <Image
            src={'/images/icons/Logo_top.svg'}
            alt='빈 체험 로고'
            width={234}
            height={337}
            className='animate-bounce w-[234px] h-auto'
          />
          <Image
            src={'/images/icons/Logo_bottom.svg'}
            alt='빈 체험 로고'
            width={45}
            height={16}
            className='w-[45px] h-auto'
          />
        </div>
        <span className='text-18-regular text-grayscale-300'>존재하는 체험이 없어요!</span>
        <div ref={targetRef} className='h-[1px]' />
      </div>
    );

  return (
    <div className='p-[24px] xl:px-[86px] my-5'>
      {!hasFilters && (
        <h1 className='flex items-center justify-start text-16-medium text-title mb-2'>
          다양한 체험 둘러보기 <ChevronRight strokeWidth={2} width={20} height={20} />
        </h1>
      )}
      <div
        className={`${!hasFilters ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 lg:gap-x-[12px] lg:gap-y-[80px]' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 lg:gap-x-[12px] lg:gap-y-[80px]'} grid gap-[24px]`}
      >
        {allActivities.map((activity: Activity) => (
          <ActivityCard key={activity.id} userId={user?.id} activity={activity} />
        ))}
      </div>
      <div className='flex items-center justify-center w-full'>
        {isLoading && <Spinner />}
        {isFetchingNextPage && <Spinner />}
      </div>
      <div ref={targetRef} className='h-[1px]' />
      {!hasNextPage && (
        <div className='flex items-center justify-center w-full h-30'>
          <span className='flex items-center justify-center gap-2 text-13-regular text-subtitle'>
            <MapPinCheckInside strokeWidth={1.25} width={18} height={18} />
            모든 체험을 확인했어요
          </span>
        </div>
      )}
    </div>
  );
}
