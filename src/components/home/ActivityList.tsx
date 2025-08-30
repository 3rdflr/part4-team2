'use client';

import { Activity } from '@/types/activities.types';
import ActivityCard from './ActivityCard';
import { useUserStore } from '@/store/userStore';

export default function ActivityList({ activities }: { activities: Activity[] }) {
  const user = useUserStore((state) => state.user);
  return (
    <div
      className={`${activities ? 'xl:grid-cols-5 2xl:grid-cols-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-[12px] lg:gap-y-[80px]' : 'lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 lg:gap-x-[12px] lg:gap-y-[80px]'} grid mt-6 p-[24px] lg:px-[86px] gap-[24px]`}
    >
      {activities.map((activity: Activity) => (
        <ActivityCard key={activity.id} userId={user?.id} activity={activity} />
      ))}
    </div>
  );
}
