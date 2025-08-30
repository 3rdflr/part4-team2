'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesStore } from '@/store/likeStore';
import { Activity } from '@/types/activities.types';

interface FavoriteButtonProps {
  activity: Activity;
  userId: number;
  size?: number;
}

export default function ActivityLike({ activity, userId, size = 28 }: FavoriteButtonProps) {
  const { initializeUser, isFavorite, toggleFavorite } = useFavoritesStore();

  // 사용자 초기화 (userId가 바뀔 때마다 실행)
  React.useEffect(() => {
    initializeUser(userId);
  }, [userId, initializeUser]);

  const isLiked = isFavorite(userId);

  return (
    <button
      onClick={() => toggleFavorite(activity)}
      aria-label={isLiked ? '찜 해제하기' : '찜하기'}
      className='absolute top-[12px] right-[16px] w-[32px] h-[32px] text-white cursor-pointer'
    >
      <Heart
        size={size}
        fill={isLiked ? 'var(--primary-400)' : 'rgba(0, 0, 0, 0.8)'}
        stroke='white' // ✅ 외곽선 색상
        strokeWidth={1.5}
        strokeLinejoin='round'
        strokeLinecap='round'
        style={{
          vectorEffect: 'non-scaling-stroke',
        }} // ✅ 외곽선 두께 유지
      />
    </button>
  );
}
