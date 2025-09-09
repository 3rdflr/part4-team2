'use client';

import { useState, useCallback } from 'react';

/**
 * Stars 컴포넌트 Props
 */
interface StarsProps {
  initRate: number; // 초기 평점 (0-5)
  edit?: boolean; // 편집 가능 여부 (기본값: false)
  onChange?: (rating: number) => void; // 평점 변경 시 호출되는 콜백 함수
  className?: string; // 추가 CSS 클래스
  size?: 'sm' | 'md' | 'lg'; // 별 크기 (기본값: 'md')
}

/**
 * Stars 컴포넌트
 * 별점을 표시하고 편집 가능한 기능을 제공하는 컴포넌트
 *
 * @param initRate - 초기 평점 (0-5)
 * @param edit - 편집 모드 활성화 여부
 * @param onChange - 평점 변경 콜백 함수
 * @param className - 추가 CSS 클래스
 * @param size - 별 크기 설정
 */
export function Stars({
  initRate,
  edit = false,
  onChange,
  className = '',
  size = 'md',
}: StarsProps) {
  // 편집 모드에서 호버 시 임시 평점 상태
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // 현재 표시할 평점 (호버 중이면 호버 평점, 아니면 초기 평점)
  const displayRating = hoverRating !== null ? hoverRating : initRate;

  // 별 크기별 CSS 클래스 정의
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-4xl',
  };

  // 별 클릭 핸들러
  const handleStarClick = useCallback(
    (rating: number) => {
      if (edit && onChange) {
        onChange(rating);
      }
    },
    [edit, onChange],
  );

  // 별 호버 진입 핸들러
  const handleStarHover = useCallback(
    (rating: number) => {
      if (edit) {
        setHoverRating(rating);
      }
    },
    [edit],
  );

  // 별 호버 종료 핸들러
  const handleStarsLeave = useCallback(() => {
    if (edit) {
      setHoverRating(null);
    }
  }, [edit]);

  return (
    <div className={`flex items-center gap-1 ${className}`} onMouseLeave={handleStarsLeave}>
      {Array.from({ length: 5 }, (_, i) => {
        const starIndex = i + 1;
        const isFilled = starIndex <= displayRating;
        const isHovered = edit && hoverRating !== null && starIndex <= hoverRating;

        return (
          <span
            key={i}
            className={`
              ${sizeClasses[size]} 
              ${isFilled ? 'text-yellow-400' : 'text-gray-300'}
              ${edit ? 'cursor-pointer hover:scale-110 transition-all duration-150' : ''}
              ${isHovered ? 'text-yellow-500' : ''}
            `}
            onClick={() => handleStarClick(starIndex)}
            onMouseEnter={() => handleStarHover(starIndex)}
            title={edit ? `${starIndex}점으로 평가` : `${initRate}점`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
