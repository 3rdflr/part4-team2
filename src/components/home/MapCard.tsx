'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Activity } from '@/types/activities.type';
import { useUserStore } from '@/store/userStore';
import { BASE_IMG_URL } from './Constants';
import { X } from 'lucide-react';
import ActivityLike from './ActivityLike';
import { useScreenSize } from '@/hooks/useScreenSize';

interface MapCardProps {
  activity: Activity;
  onClose: () => void; // 닫기 콜백
}

export default function MapCard({ activity, onClose }: MapCardProps) {
  const [isError, setIsError] = useState(false);
  const { isDesktop } = useScreenSize();

  const user = useUserStore((state) => state.user);

  const bannerImg = isError ? BASE_IMG_URL : activity.bannerImageUrl;

  return (
    <>
      {isDesktop ? (
        <div
          className={`group absolute left-10 block w-[327px] h-auto rounded-2xl overflow-hidden shadow-lg bg-white transition-transform hover:scale-105 ${isDesktop ? 'top-10 ' : 'top-30'}`}
        >
          {/* 닫기 버튼 */}
          {user && (
            <button
              type='button'
              onClick={onClose}
              className='absolute right-10 z-[200] w-8 h-8 flex items-center justify-center rounded-full transition'
            >
              <ActivityLike activity={activity} userId={user.id} size={20} isButton={true} />
            </button>
          )}
          <button
            type='button'
            onClick={onClose}
            className='absolute top-[12px] right-[12px] z-[200] w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition'
          >
            <X width={16} height={16} />
          </button>

          {/* 링크 + 이미지 */}
          <Link href={`/activities/${activity.id}`}>
            <div className='w-full h-[200px] relative'>
              <Image
                src={bannerImg}
                alt={activity.title}
                fill
                className='object-cover'
                onError={() => setIsError(true)}
                blurDataURL={BASE_IMG_URL}
                loading='lazy'
              />
            </div>
          </Link>

          {/* 설명 */}
          <div className='p-4 flex flex-col gap-2'>
            <h3 className='text-16-semibold text-title'>{activity.title}</h3>
            <p className='text-13-regular text-subtitle line-clamp-2'>{activity.description}</p>
            <span className='text-14-bold text-title'>{activity.price?.toLocaleString()}원</span>
          </div>
        </div>
      ) : (
        <div className='group absolute top-15 left-1/2 w-11/12 max-w-[470px] h-[126px] rounded-2xl overflow-hidden shadow-lg bg-white flex -translate-x-1/2'>
          {/* 이미지 영역 */}
          <Link href={`/activities/${activity.id}`}>
            <div className='w-[126px] h-full relative flex-shrink-0'>
              <Image
                src={bannerImg}
                alt={activity.title}
                fill
                className='object-cover rounded-l-2xl'
                onError={() => setIsError(true)}
                blurDataURL={BASE_IMG_URL}
                loading='lazy'
              />
            </div>
          </Link>

          {/* 설명 영역 */}
          <div className='flex-1 p-3 flex flex-col justify-between'>
            <div>
              <h3 className='text-14-semibold text-title line-clamp-2'>{activity.title}</h3>
              <p className='text-12-regular text-subtitle line-clamp-2'>{activity.description}</p>
            </div>
            <span className='text-13-bold text-title'>{activity.price?.toLocaleString()}원</span>
          </div>

          {/* 닫기 버튼 */}
          <button
            type='button'
            onClick={onClose}
            className='absolute top-2 right-2 z-[200] w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition'
          >
            <X width={14} height={14} />
          </button>

          {/* 좋아요 버튼 */}
          {user && (
            <button
              type='button'
              className='absolute top-2 right-10 z-[200] w-6 h-6 flex items-center justify-center rounded-full transition'
            >
              <ActivityLike activity={activity} userId={user.id} size={16} isButton />
            </button>
          )}
        </div>
      )}
    </>
  );
}
