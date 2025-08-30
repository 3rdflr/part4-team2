'use client';

import { motion, useTransform, MotionValue } from 'framer-motion';
import { Categories } from './Constants';
import { useSearchParams } from 'next/navigation';
import CategoryButton from './CategoryButton';

export default function CategoryList({
  scrollY,
  freeze = false,
}: {
  scrollY: MotionValue<number>;
  freeze?: boolean;
}) {
  const searchParams = useSearchParams();

  // 점점 사라지는 애니메이션
  const listOpacity = useTransform(scrollY, [0, 120], [1, 0]); // ← 0~120px 스크롤 동안 투명
  const listY = useTransform(scrollY, [0, 120], [0, -60]); // ← 위로 이동
  const listScale = useTransform(scrollY, [0, 120], [1, 0]); // ← 크기도 점점 줄어듦

  // freeze 상태면 고정
  const styleOpacity = freeze ? 1 : listOpacity;
  const styleY = freeze ? 0 : listY;
  const styleScale = freeze ? 1 : listScale;

  return (
    <motion.div
      style={{
        opacity: styleOpacity,
        y: styleY,
        scale: styleScale, // 크기 줄어듦
      }}
      className='px-10 flex justify-center overflow-x-auto overflow-y-hidden scrollbar-hide w-full'
    >
      <div className='flex gap-5 px-2'>
        {Categories.map((category) => (
          <CategoryButton
            key={category.category}
            category={category.category}
            icon={category.icon}
            value={category.value}
            isSelected={category.value === (searchParams.get('category') || '')}
          />
        ))}
      </div>
    </motion.div>
  );
}
