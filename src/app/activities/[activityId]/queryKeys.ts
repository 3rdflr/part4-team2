/**
 * 클라이언트에서 실시간 데이터 쿼리 키 생성
 */
export const activityQueryKeys = {
  // 기본 정보 (캐시됨)
  detail: (activityId: number) => ['activity-detail', activityId] as const,
} as const;
