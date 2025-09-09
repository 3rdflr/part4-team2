'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar as StarIcon } from 'react-icons/fa';
import { BASE_IMG_URL } from '@/components/home/Constants';
import { Activity } from '@/types/activities.type';
import Image from 'next/image';
import ActivityLike from './ActivityLike';

export default function ActivityCard({
  activity,
  userId,
}: {
  activity: Activity;
  userId?: number;
}) {
  const router = useRouter();
  const [isError, setIsError] = useState(false);

  const bannerImg = isError ? BASE_IMG_URL : activity.bannerImageUrl;

  // 접근성 고려를 위해 이미지 클릭시 링크이동 or article 자체를 클릭시 이동 가능하게 할지 고려
  return (
    <article>
      {/* 이미지 영역 */}
      <div className='relative'>
        {/* 배너 이미지 (에러 시 기본 이미지 fallback) */}
        <div className='w-full aspect-square rounded-[20px] overflow-hidden bg-grayscale-25'>
          <Image
            src={bannerImg}
            alt={activity.title}
            width={375}
            height={375}
            className='cursor-pointer hover:scale-105 transition-soft duration-500 w-full aspect-square object-cover'
            onClick={() => router.push(`/activities/${activity.id}`)}
            onError={() => {
              setIsError(true);
            }}
            blurDataURL={BASE_IMG_URL}
            loading='lazy'
          />
        </div>
        {/* 평점 배지 */}
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

        {/* 좋아요 버튼 (로그인 사용자만 표시) */}
        {userId && <ActivityLike activity={activity} userId={userId} />}
      </div>
      {/* 카드 텍스트 영역 */}
      <div className='p-[8px] gap-[6px] flex flex-col'>
        {/* 제목 */}
        <header>
          <h2 className='leading-[1.4] text-sm font-semibold text-gray-800 w-auto flex-nowrap line-clamp-1 scrollbar-hide'>
            {activity.title || '새로운 체험'}
          </h2>
        </header>

        {/* 주소 */}
        <section>
          <address className='text-xs leading-[1.4] text-gray-500 not-italic'>
            {activity.address || '대한민국'}
          </address>
        </section>
        {/* 가격 + 후기 수 */}
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
