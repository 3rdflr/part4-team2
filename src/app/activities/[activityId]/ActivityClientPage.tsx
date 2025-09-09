'use client';
import { useState, useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';
import ActivityInfo from '@/components/pages/activities/ActivityInfo';

import BookingCardContainer from '@/components/pages/activities/bookingCard/BookingContainer';

import ReviewList from '@/components/pages/activities/ReviewList';

import { activityQueryKeys } from './queryClients';
import NaverMap from '@/components/common/naverMaps/NaverMap';
import Marker from '@/components/common/naverMaps/Marker';
import ImageMarker from '@/components/common/naverMaps/ImageMarker';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
/**
 * ActivityClient 컴포넌트
 * - CSR로 동작하며, 실시간 가격 및 스케줄 정보를 주기적으로 갱신
 * - Suspense와 ErrorBoundary를 통한 선언적 UI 상태 관리
 */
interface ActivityClientProps {
  activityId: number;
}

export default function ActivityClient({ activityId }: ActivityClientProps) {
  const router = useRouter();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const user = useUserStore((state) => state.user);

  // 기본 체험 정보 조회 (서버에서 prefetch된 데이터 사용)
  const { data: activity } = useSuspenseQuery({
    queryKey: activityQueryKeys.detail(activityId),
    queryFn: () => getActivityDetail(Number(activityId)),
    staleTime: 5 * 60 * 1000, // 5분 캐시 (기본 정보)
    gcTime: 30 * 60 * 1000, // 30분 메모리 보관
  });

  // // 실시간 가격 정보 (30초마다 자동 갱신)
  // const { data: realtimePrice } = useQuery({
  //   queryKey: activityQueryKeys.price(activityId),
  //   queryFn: async () => {
  //     console.log('💰 [CSR] 실시간 가격 정보 조회', { activityId });
  //   },
  //   staleTime: 0, // 항상 최신 데이터
  //   gcTime: 0, // 캐시 안함
  //   refetchInterval: 30000, // 30초마다 자동 갱신
  //   refetchOnWindowFocus: true, // 창 포커스시 갱신
  //   enabled: !!activity, // activity 로드 후 실행
  // });

  const handleDelete = () => {
    //삭제 모달 추가
    console.log('삭제 시도: ', { activityId });
    router.push('/my-activities');
  };

  const handleEdit = () => {
    console.log('수정 시도: ', { activityId });
    router.push(`/my-activities/activity/${activityId}`);
  };

  useEffect(() => {
    if (user?.id === activity.userId) {
      // 활동의 소유자인 경우
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [user, activity]);

  return (
    <div className='container mx-auto px-4 py-8 xl:pb-8'>
      <div className='max-w-[1200px] mx-auto'>
        {/* 그리드 레이아웃 컨테이너 */}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 메인 콘텐츠 */}
          <div className='lg:col-span-2'>
            <div className='flex flex-col gap-5 md:gap-6 lg:gap-10'>
              <ActivityImageViewer
                bannerImageUrl={activity.bannerImageUrl}
                subImages={activity.subImages}
                title={activity.title}
              />
              <ActivityInfo
                className='block lg:hidden'
                activity={activity}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isOwner={isOwner}
              />
              <hr className='border-gray-100 block lg:hidden' />
              <section className='flex flex-col gap-3'>
                <h2 className='text-lg font-semibold'>체험 설명</h2>
                <p>{activity.description}</p>
              </section>
              <hr className='border-gray-100' />
              {/* 주소 섹션 */}
              <section className='flex flex-col gap-2'>
                <h2 className='text-lg font-semibold'>오시는 길</h2>
                <p className='text-sm text-gray-600'>{activity.address}</p>
                <NaverMap address={activity.address} height='256px' zoom={12}>
                  <Marker address={activity.address} id='image-marker'>
                    <ImageMarker src={activity.bannerImageUrl} alt='주소 마커' size={40} />
                  </Marker>
                </NaverMap>
              </section>
              <hr className='border-gray-100' />
              {/* 후기 섹션 */}
              <section className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-semibold'>체험 후기</h2>
                  <p>{activity.reviewCount}개</p>
                </div>
                <ReviewList activityId={activity.id.toString()} rating={activity.rating} />
              </section>
            </div>
          </div>

          {/* SideBar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-30 flex flex-col gap-10 z-105'>
              <ActivityInfo
                className='hidden lg:block'
                activity={activity}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
              <BookingCardContainer
                activityId={activityId}
                price={activity.price}
                baseSchedules={activity.schedules}
                title={activity.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
