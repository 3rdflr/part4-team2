'use client';

import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Categories } from './Constants';
import MobileCategoryButton from './MobileCategoryButton';
import { useSearchParams } from 'next/navigation';

import { useState } from 'react';

export default function MobileCategoryList() {
  const { scrollY } = useScroll();
  const [currentMobileHeight, setCurrentMobileHeight] = useState('64px');

  const categoryHeight = useTransform(scrollY, [0, 80], ['64px', '35px']); // 아이콘 크기 0이 되는 시점이 39px
  const searchParams = useSearchParams();

  useMotionValueEvent(categoryHeight, 'change', (latest) => {
    setCurrentMobileHeight(latest);
  });

  return (
    <motion.div
      className={`flex justify-start pt-[8px] px-[24px] overflow-x-auto overflow-y-hidden scrollbar-hide`}
      animate={{
        height: currentMobileHeight,
      }}
      transition={{
        ease: [0, 0.9, 0.1, 1],
        duration: 0.5,
      }}
    >
      {Categories.map((category) => (
        <MobileCategoryButton
          key={category.category}
          category={category.category}
          icon={category.icon}
          value={category.value}
          isSelected={category.value === (searchParams.get('category') || '')}
        />
      ))}
    </motion.div>
  );
}
