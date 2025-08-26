import { ActivityDetail } from '@/types/activities.type';
import { MapPin, Star } from 'lucide-react';

/**
 *
 * 체험 기본 정보 컴포넌트
 * ActivityClient에서 데이터를 받아와서 렌더링
 * 제목, 카테고리, 평점, 리뷰 수, 주소, 가격, 설명 등을 표시
 */
interface ActivityInfoProps {
  activity: ActivityDetail;
}

export default function ActivityInfo({ activity }: ActivityInfoProps) {
  return (
    <div className='space-y-6'>
      {/* 제목과 기본 정보 */}
      <div>
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-sm text-gray-500'>{activity.category}</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-3'>{activity.title}</h1>

        {/* 평점과 리뷰 */}
        <div className='flex items-center gap-4 mb-3'>
          <div className='flex items-center gap-1'>
            <Star className='w-5 h-5 text-yellow-400 fill-current' />
            <span className='text-lg font-semibold'>{activity.rating}</span>
            <span className='text-gray-500'>({activity.reviewCount})</span>
          </div>
        </div>

        {/* 주소 */}
        <div className='flex items-center gap-2 text-gray-600'>
          <MapPin className='w-4 h-4' />
          <span className='text-sm'>{activity.address}</span>
        </div>
      </div>

      {/* 가격 */}
      <div className='border-t pt-6'>
        <div className='text-2xl font-bold text-gray-900'>
          ₩{activity.price.toLocaleString()}
          <span className='text-base font-normal text-gray-500'>/인</span>
        </div>
      </div>

      {/* 체험 설명 */}
      <div className='border-t pt-6'>
        <h2 className='text-lg font-semibold mb-3'>체험 설명</h2>
        <p className='text-gray-700 leading-relaxed whitespace-pre-wrap'>{activity.description}</p>
      </div>
    </div>
  );
}
