'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { Activity } from '@/types/activities.type';
import { useFavoritesStore } from '@/store/likeStore';

interface FavoriteButtonProps {
  activity: Activity;
  userId: number;
  size?: number;
  isButton?: boolean;
}

export default function ActivityLike({
  activity,
  userId,
  size = 28,
  isButton = false,
}: FavoriteButtonProps) {
  const { initializeUser, isFavorite, toggleFavorite } = useFavoritesStore();

  // 사용자 초기화 (userId가 바뀔 때마다 실행)
  React.useEffect(() => {
    initializeUser(userId);
  }, [userId, initializeUser]);

  const isLiked = isFavorite(activity.id);

  return (
    <button
      onClick={() => toggleFavorite(activity)}
      aria-label={isLiked ? '찜 해제하기' : '찜하기'}
      className={`absolute top-[12px] right-[16px] flex justify-center items-center text-white cursor-pointer ${isButton ? 'bg-gray-200 rounded-full w-full h-full' : 'w-[32px] h-[32px]'}`}
    >
      <Heart
        size={size}
        fill={
          isLiked ? 'var(--primary-400)' : isButton ? 'var(--color-gray-200)' : 'rgba(0, 0, 0, 0.8)'
        }
        stroke={isButton ? 'black' : 'white'}
        strokeWidth={1.5}
        strokeLinejoin='round'
        strokeLinecap='round'
        style={{
          vectorEffect: 'non-scaling-stroke',
        }}
      />
    </button>
  );
}
