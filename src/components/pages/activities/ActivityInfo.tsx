'use client';

import { ActivityDetail } from '@/types/activities.type';
import { MapPin, Star } from 'lucide-react';

import { twMerge } from 'tailwind-merge';
import { EditDropDown } from './EditDropDown';

/**
 *
 * 체험 기본 정보 컴포넌트
 * ActivityClient에서 데이터를 받아와서 렌더링
 * 제목, 카테고리, 평점, 리뷰 수, 주소, 가격, 설명 등을 표시
 */
interface ActivityInfoProps {
  activity: ActivityDetail;
  className?: string;
  isOwner: boolean;
}

export default function ActivityInfo({ activity, className, isOwner }: ActivityInfoProps) {
  return (
    <div className={twMerge('flex flex-col gap-2 justify-self-start', className)}>
      {/* 카테고리 및 드롭다운 */}
      <div className='flex items-center justify-between'>
        <span className='text-sm text-gray-950'>{activity.category}</span>
        <EditDropDown isOwner={isOwner} activityId={activity.id} />
      </div>
      {/* 제목과 기본 정보 */}
      <div className='flex flex-col gap-4'>
        <h1 className='text-2xl font-bold text-gray-950'>{activity.title}</h1>
        <div className='flex flex-col gap-[10px]'>
          {/* 평점 */}
          <div className='flex items-center gap-[6px]'>
            <Star className='w-4 h-4 text-yellow-400 fill-current' />
            <span className='text-sm text-gray-700'>
              {activity.rating.toFixed(1)} ({activity.reviewCount})
            </span>
          </div>
          {/* 주소 */}
          <div className='flex items-center gap-2 text-gray-600'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm'>{activity.address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
