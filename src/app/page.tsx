import { Activity, Category } from '../types/activities.types';
import Spinner from '@/components/common/Spinner';
import ActivityList from '@/components/home/ActivityList';
import ActivitySheet from '@/components/home/ActivitySheet';

export default async function Home({
  searchParams: searchParams,
}: {
  searchParams: {
    category: Category;
    keyword: string;
    'min-price': string;
    'max-price': string;
    place: string;
  };
}) {
  const category = searchParams.category || '';
  const keyword = searchParams.keyword || '';

  const params = new URLSearchParams({
    method: 'cursor',
    size: '28',
    ...(category && { category }),
    ...(keyword && { keyword }),
  });

  console.log('Fetching activities with params:', params.toString());
  const activitiesResponse = await fetch(
    `https://sp-globalnomad-api.vercel.app/14-1/activities?${params.toString()}`,
    {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    },
  );

  if (!activitiesResponse.ok) {
    throw new Error('데이터 불러오기 실패');
  }

  const activitiesData = await activitiesResponse.json();

  const minPrice = Number(searchParams['min-price'] || 0);
  const maxPrice = Number(searchParams['max-price'] || Infinity);
  const address = searchParams.place || '';

  const activities = activitiesData.activities.filter(
    (item: Activity) =>
      item.price >= minPrice && item.price <= maxPrice && item.address.includes(address),
  );

  const totalCount = activitiesData.totalCount;

  const hasParams = Object.entries(searchParams).some(
    ([key, value]) => key !== 'category' && value !== null && value.trim() !== '',
  );

  return (
    <div className='h-auto'>
      <div>
        {hasParams && <Spinner />}
        <ActivityList activities={activities} />
      </div>
      <ActivitySheet totalCount={totalCount}>
        <ActivityList activities={activities} />
      </ActivitySheet>
    </div>
  );
}
