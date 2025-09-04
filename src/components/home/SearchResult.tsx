'use client';

import { Activity } from '@/types/activities.type';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import NaverMap from '../common/naverMaps/NaverMap';
import Marker from '../common/naverMaps/Marker';
import ActivitySheet from './ActivitySheet';
import ActivityList from './ActivityList';
import { useState } from 'react';
import MapCard from './MapCard';

export default function SearchResult({
  initialActivities,
  initalCursorId,
  totalCount,
}: {
  initialActivities: Activity[];
  initalCursorId: number;
  totalCount: number;
}) {
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  const { isDesktop } = useScreenSize();

  const { allActivities } = useInfiniteList(initialActivities, initalCursorId);

  const initAddress = '서울특별시 종로구 세종대로 172';

  return (
    <>
      <div className='grid grid-cols-1 xl:grid-cols-[4fr_3fr] h-auto text-white'>
        {isDesktop ? (
          <>
            <div className=''>
              <ActivityList initialActivities={initialActivities} initalCursorId={initalCursorId} />
            </div>

            {/* 우측: 스크롤 고정 */}
            <div className='h-screen sticky top-0'>
              <NaverMap address={initAddress} height='100%' zoom={11}>
                {allActivities.map((activity, index) => (
                  <Marker
                    key={activity.id}
                    address={activity.address!}
                    id={`price-marker-${index}`}
                    onClick={() => {
                      setActiveMarkerId(activity.id);
                    }}
                  >
                    <div
                      className='px-3 py-1 max-w-[100px] bg-gray-100 text-gray-600 text-[13px] font-semibold rounded-2xl
             transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg'
                    >
                      {activity.price.toLocaleString()}원
                    </div>
                  </Marker>
                ))}
              </NaverMap>
              {activeMarkerId !== null && (
                <MapCard
                  activity={allActivities.find((a) => a.id === activeMarkerId)!}
                  onClose={() => setActiveMarkerId(null)}
                />
              )}
            </div>
          </>
        ) : (
          <>
            <div className='h-screen sticky top-0'>
              <NaverMap address={initAddress} height='100%' zoom={11}>
                {allActivities.map((activity, index) => (
                  <Marker
                    key={activity.id}
                    address={activity.address!}
                    id={`price-marker-${index}`}
                    onClick={() => {
                      setActiveMarkerId(activity.id);
                    }}
                  >
                    <div
                      className='px-3 py-1 bg-gray-100 text-gray-600 text-[13px] font-semibold rounded-2xl
             transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg'
                    >
                      {activity.price.toLocaleString()}원
                    </div>
                  </Marker>
                ))}
              </NaverMap>
              {activeMarkerId !== null && (
                <MapCard
                  activity={allActivities.find((a) => a.id === activeMarkerId)!}
                  onClose={() => setActiveMarkerId(null)}
                />
              )}
            </div>
            <ActivitySheet totalCount={totalCount}>
              <ActivityList initialActivities={initialActivities} initalCursorId={initalCursorId} />
            </ActivitySheet>
          </>
        )}
      </div>
    </>
  );
}
