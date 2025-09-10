'use client';

import { useInfiniteReviews } from '@/hooks/useInfiniteReviews';
import { InfinityScroll } from '@/components/common/InfinityScroll';
import { ReviewCard } from './ReviewCard';
import { Review } from '@/types/reviews.type';
import { ReviewHero } from './ReviewHero';

interface ReviewListProps {
  activityId: string;
  rating: number;
}

export default function ReviewList({ activityId }: ReviewListProps) {
  const reviewData = useInfiniteReviews(activityId, 10);

  return (
    <div className='flex flex-col items-center gap-[30px]'>
      {/* ReviewHero 영역 */}
      <ReviewHero reviewCount={reviewData.totalCount} rating={reviewData.averageRating} />
      {/* 댓글 스크롤 영역 */}
      <InfinityScroll
        items={reviewData.allReviews}
        hasNextPage={reviewData.hasNextPage}
        fetchNextPage={reviewData.fetchNextPage}
        isLoading={reviewData.isLoading}
        isFetchingNextPage={reviewData.isFetchingNextPage}
        height={600}
        itemHeightEstimate={140}
        scrollKey={`reviews-${activityId}`}
        className='rounded-3xl p-1'
      >
        {/* 초기 로딩 스켈레톤 */}
        <InfinityScroll.Skeleton count={3}>
          <div className='animate-pulse bg-white rounded-3xl p-4 shadow-sm mx-4'>
            <div className='flex items-center space-x-4 mb-3'>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-3 bg-gray-200 rounded w-20'></div>
              </div>
              <div className='h-3 bg-gray-200 rounded w-16'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
            </div>
          </div>
        </InfinityScroll.Skeleton>
        <InfinityScroll.Contents loadingText='더 많은 후기를 불러오는 중입니다...'>
          {(review: Review, _index: number) => <ReviewCard key={review.id} review={review} />}
        </InfinityScroll.Contents>

        <InfinityScroll.Empty className='flex flex-col items-center justify-center gap-3 text-gray-500'>
          <p className='text-xl'>아직 후기가 없어요..</p>

          <p className='text-sm text-gray-400'>새로운 경험들을 공유해주세요!</p>
        </InfinityScroll.Empty>
      </InfinityScroll>
    </div>
  );
}
