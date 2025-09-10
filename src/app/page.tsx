import { Activity, ActivitiesCategoryType } from '../types/activities.type';
import { getActivitiesList } from '@/app/api/activities';
import ActivityList from '@/components/home/ActivityList';
import BestActivity from '@/components/home/BestActityList';
import RecentViewPage from '@/components/home/RecnetViewPage';
import SearchResult from '@/components/home/SearchResult';

export default async function Home({
  searchParams,
}: {
  searchParams: {
    category?: ActivitiesCategoryType;
    keyword?: string;
    'min-price'?: string;
    'max-price'?: string;
    place?: string;
  };
}) {
  // 쿼리 문자열 정리
  const category = searchParams.category || undefined;
  const keyword = searchParams.keyword || undefined;
  const minPrice = Number(searchParams['min-price'] ?? 0);
  const MAX_SLIDER = 300_000;
  const rawMaxPrice =
    searchParams['max-price'] !== undefined ? Number(searchParams['max-price']) : MAX_SLIDER;

  // 슬라이더 최대값이면 Infinity 처리
  const maxPrice = rawMaxPrice >= MAX_SLIDER ? Infinity : rawMaxPrice;
  const place = searchParams.place || '';

  // SSR 초기 데이터 로딩
  const activitiesData = await getActivitiesList({
    method: 'cursor',
    size: 21,
    ...(category && { category }),
    ...(keyword && { keyword }),
  });

  // 필터링 (가격, 장소)
  const normalizedPlace = place?.toLowerCase().trim();

  const activities = activitiesData.activities.filter((item: Activity) => {
    const priceOk = item.price >= minPrice && item.price <= maxPrice;
    const placeOk = normalizedPlace ? item.address.toLowerCase().includes(normalizedPlace) : true;
    return priceOk && placeOk;
  });

  // 필터링된 개수 반영
  const totalCount = activities.length;

  // 카테고리 외에 검색 파라미터가 있는지 체크
  const hasParams = Object.entries(searchParams).some(
    ([key, value]) => key !== 'category' && typeof value === 'string' && value.trim() !== '',
  );

  return (
    <div className='h-auto min-h-screen'>
      {!hasParams && <RecentViewPage />}
      {!hasParams && <BestActivity />}
      {!hasParams ? (
        <ActivityList initialActivities={activities} initalCursorId={activitiesData.cursorId} />
      ) : (
        <SearchResult
          initialActivities={activities}
          initalCursorId={activitiesData.cursorId}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
