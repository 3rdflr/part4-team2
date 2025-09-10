'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useFavoritesStore } from '@/store/likeStore';
import Image from 'next/image';
import Link from 'next/link';
import Spinner from '@/components/common/Spinner';
import ActivityLike from '@/components/home/ActivityLike';

export default function WishList() {
  const [isLoading, setIsLoading] = useState(true);
  const { isMobile } = useScreenSize();

  const user = useUserStore((state) => state.user);
  const { favorites, initializeUser } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      initializeUser(user.id);
    }
    setIsLoading(false);
  }, [user, initializeUser]);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-80'>
        <Spinner />
      </div>
    );
  }

  if (!user || favorites.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center h-screen text-subtitle'>
        <p className='text-18-regular text-title'>아직 저장된 활동이 없어요.</p>
        <p className='mt-2 text-14-regular '>검색 중에 마음에 드는 활동을 찜해보세요!</p>
      </div>
    );
  }

  return (
    <>
      <div className='p-4'>
        <h1 className='text-24-bold text-title mb-6'>찜한 활동</h1>
        <div className='flex flex-col gap-6'>
          {/* favorites 배열을 순회하며 각 찜한 활동을 렌더링합니다. */}
          {favorites.map((activity) => (
            <div key={activity.id}>
              {isMobile ? (
                <div className='group relative flex flex-col w-[327px] h-auto rounded-2xl overflow-hidden shadow-lg bg-white transition-transform hover:scale-105'>
                  <Link href={`/activities/${activity.id}`}>
                    <div className='w-full h-[200px] relative'>
                      <Image
                        src={activity.bannerImageUrl}
                        alt={activity.title}
                        fill
                        className='object-cover'
                        loading='lazy'
                      />
                    </div>
                  </Link>
                  <div className='p-4 flex flex-col gap-2'>
                    <h3 className='text-16-semibold text-title'>{activity.title}</h3>
                    <p className='text-13-regular text-subtitle line-clamp-2'>
                      {activity.description}
                    </p>
                    <span className='text-14-bold text-title'>
                      {activity.price?.toLocaleString()}원
                    </span>
                  </div>

                  <div className='abolute top-0 right-0 z-[100] w-6 h-6 flex items-center justify-center rounded-full'>
                    <ActivityLike activity={activity} userId={user.id} size={32} />
                  </div>
                </div>
              ) : (
                <div className='group w-full h-[126px] rounded-2xl overflow-hidden shadow-lg bg-white flex'>
                  <Link href={`/activities/${activity.id}`}>
                    <div className='w-[126px] h-full relative flex-shrink-0'>
                      <Image
                        src={activity.bannerImageUrl}
                        alt={activity.title}
                        fill
                        className='object-cover rounded-l-2xl'
                        loading='lazy'
                      />
                    </div>
                  </Link>
                  <div className='flex-1 p-3 flex flex-col justify-between'>
                    <div>
                      <h3 className='text-14-semibold text-title line-clamp-2'>{activity.title}</h3>
                      <p className='text-12-regular text-subtitle line-clamp-2'>
                        {activity.description}
                      </p>
                    </div>
                    <span className='text-13-bold text-title'>
                      {activity.price?.toLocaleString()}원
                    </span>
                  </div>
                  {user && (
                    <div className='relative top-0 right-0 z-[100] w-6 h-6 flex items-center justify-center rounded-full transition'>
                      <ActivityLike activity={activity} userId={user.id} size={32} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
