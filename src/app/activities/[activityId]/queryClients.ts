import { QueryClient, dehydrate, type DehydratedState } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';

/**
 * Activity 페이지 전용 QueryClient 설정들
 * 요청별로 최적화된 설정 제공
 */

/**
 * Activity 기본 정보 조회용 QueryClient (SSR/SSG 최적화)
 * - 길게 캐싱 (5분)
 * - SSR에서 prefetch 가능
 */
export function createActivityDetailQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분 캐싱
        gcTime: 30 * 60 * 1000, // 30분 메모리 보관
        retry: 1, // SSR에서는 1회만 재시도
        retryDelay: 1000,
      },
    },
  });
}

/**
 * Activity 실시간 가격용 QueryClient
 * - 캐시 없음
 * - 자동 갱신
 */
export function createActivityPriceQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // 즉시 stale
        gcTime: 0, // 캐시 안함
        refetchInterval: 30000, // 30초마다 갱신
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 3,
      },
    },
  });
}

/**
 * Activity 실시간 스케줄용 QueryClient
 * - 짧은 캐시 (1분)
 * - 중간 빈도 갱신
 */
export function createActivityScheduleQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // 즉시 stale
        gcTime: 60 * 1000, // 1분 메모리 보관
        refetchInterval: 60000, // 1분마다 갱신
        refetchOnWindowFocus: true,
        retry: 2,
      },
    },
  });
}

/**
 * SSR prefetch용 통합 함수
 * Activity 기본 정보를 서버에서 미리 로드
 */
export async function prefetchActivityData(activityId: string): Promise<DehydratedState> {
  console.log('📡 [SSR] Activity 데이터 prefetch 시작', { activityId });

  const queryClient = createActivityDetailQueryClient();

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
    });

    console.log('✅ [SSR] Activity prefetch 성공', { activityId });
  } catch (error) {
    console.log('⚠️ [SSR] Activity prefetch 실패, 클라이언트에서 로드', { activityId, error });
    // 에러가 발생해도 빈 상태로 반환하여 클라이언트에서 처리
  }

  return dehydrate(queryClient);
}

/**
 * 클라이언트에서 실시간 데이터 쿼리 키 생성
 */
export const activityQueryKeys = {
  // 기본 정보 (캐시됨)
  detail: (activityId: string) => ['activity-detail', activityId] as const,

  // 실시간 가격 (캐시 안됨)
  price: (activityId: string) => ['activity-price', activityId] as const,

  // 실시간 스케줄 (짧은 캐시)
  schedule: (activityId: string) => ['activity-schedule', activityId] as const,

  // 실시간 통계
  stats: (activityId: string) => ['activity-stats', activityId] as const,
} as const;
