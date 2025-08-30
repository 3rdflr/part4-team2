'use client';

import Image from 'next/image';
import { Activity } from '@/types/activities.types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActivityLike from './ActivityLike';
import { FaStar as StarIcon } from 'react-icons/fa';

export default function ActivityCard({
  activity,
  userId,
}: {
  activity: Activity;
  userId?: number;
}) {
  const router = useRouter();
  // 로그인 상태에 따라 변경 예정
  const [isError, setIsError] = useState(false);
  const [] = useState(false);
  const baseImageUrl = '/images/icons/_empty.png';
  const bannerImg = isError ? baseImageUrl : activity.bannerImageUrl;

  return (
    <article>
      <div className='relative'>
        <div className='w-full aspect-square rounded-[20px] overflow-hidden bg-grayscale-25'>
          <Image
            src={bannerImg}
            alt={activity.title}
            width={375}
            height={375}
            className='cursor-pointer hover:scale-105 transition-soft w-full aspect-square object-cover'
            onClick={() => router.push(`/activities/${activity.id}`)}
            onError={() => {
              setIsError(true);
            }}
            blurDataURL={baseImageUrl}
            priority
          />
        </div>
        <div className='absolute top-[16px] left-[16px] flex items-center text-grayscale-500'>
          <div className='flex items-center justify-center gap-[4px] bg-white rounded-full w-[58px] h-[24px]'>
            {activity.rating > 0 ? (
              <>
                <StarIcon size={14} className='text-yellow-300' />
                <span className='text-gray-900 text-11-bold'>{activity.rating.toFixed(1)}</span>
              </>
            ) : (
              <span className='text-grayscale-500 text-11-medium'>평점 없음</span>
            )}
          </div>
        </div>
        {userId && <ActivityLike activity={activity} userId={userId} />}
      </div>

      <div className='p-[8px] gap-[6px] flex flex-col'>
        <header>
          <h2 className='leading-[1.4] text-sm font-semibold text-gray-800 line-clamp-2'>
            {activity.title || '새로운 체험'}
          </h2>
        </header>

        <section>
          <address className='text-xs leading-[1.4] text-gray-500 not-italic'>
            {activity.address || '대한민국'}
          </address>
        </section>

        <footer className='leading-none flex justify-between items-center w-full text-11-regular text-gray-500'>
          <span>
            {activity.price ? `1인당 ${activity.price.toLocaleString()}원 부터` : '가격 문의'}
          </span>
          <span>{activity.reviewCount > 0 ? `${activity.reviewCount}개의 후기` : '후기 없음'}</span>
        </footer>
      </div>
    </article>
  );
}
