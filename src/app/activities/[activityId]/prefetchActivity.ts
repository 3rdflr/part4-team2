import { QueryClient, dehydrate, type DehydratedState } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import { getBlurDataURL } from '@/lib/utils/blur';

/**
 * SSR prefetch용 통합 함수
 * Activity 기본 정보를 서버에서 미리 로드 + 상단 3장 LQIP(blur) 생성
 */

// NEW: 반환 타입 정의
export interface PrefetchActivityResult {
  dehydratedState: DehydratedState;
  blur?: { banner?: string; sub?: (string | undefined)[] };
}

export async function prefetchActivityData(activityId: string): Promise<PrefetchActivityResult> {
  // CHANGED
  console.log('📡 [SSR] Activity 데이터 prefetch 시작', { activityId });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분 캐싱
        gcTime: 30 * 60 * 1000, // 30분 메모리 보관
        retry: 1, // SSR에서는 1회만 재시도
        retryDelay: 1000,
      },
    },
  });

  try {
    // Activity ID 검증
    const numericId = Number(activityId);
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error(`Invalid activity ID: ${activityId}`);
    }

    // 기본 정보 prefetch
    await queryClient.prefetchQuery({
      queryKey: ['activity-detail', activityId],
      queryFn: () => getActivityDetail(numericId),
      // 필요시 staleTime/gcTime 부여 가능
    });

    // 캐시된 activity를 꺼내서 상단 3장의 blur 생성
    const activity = queryClient.getQueryData<{
      bannerImageUrl: string;
      subImages: { id: number | string; imageUrl: string }[];
    }>(['activity-detail', activityId]);

    let blur: PrefetchActivityResult['blur'];

    if (activity) {
      const banner = activity.bannerImageUrl;
      const sub0 = activity.subImages?.[0]?.imageUrl;
      const sub1 = activity.subImages?.[1]?.imageUrl;

      const [b, s0, s1] = await Promise.all([
        banner ? getBlurDataURL(banner) : undefined,
        sub0 ? getBlurDataURL(sub0) : undefined,
        sub1 ? getBlurDataURL(sub1) : undefined,
      ]);

      blur = { banner: b, sub: [s0, s1] };
    }

    console.log('✅ [SSR] Activity prefetch 성공', { activityId });

    // CHANGED: dehydratedState + blur 함께 반환
    return { dehydratedState: dehydrate(queryClient), blur };
  } catch (error) {
    console.log('⚠️ [SSR] Activity prefetch 실패, 클라이언트에서 로드', { activityId, error });
    // 에러여도 최소한 dehydratedState는 반환
    return { dehydratedState: dehydrate(queryClient) }; // CHANGED
  }
}
