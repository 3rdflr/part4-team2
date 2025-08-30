'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CategoryList from '../home/CategoryList';
import SearchFilters from '../home/SearchFilters';
import { useState } from 'react';
import { useScreenSize } from '@/hooks/useScreenSize';
import LoginSection from '../home/LoginSection';
import NavMobileView from '../home/NavMobileView';
import { usePathname } from 'next/navigation';

const CATEGORY_H = 80;
const SEARCH_H = 96;
const GAP = 5;

export default function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { isMobile, isTablet } = useScreenSize();
  const [isSearching, setIsSearching] = useState(false);

  // transform
  const rawStackHeight = useTransform(
    scrollY,
    [0, 40, 80],
    [CATEGORY_H + GAP + SEARCH_H, SEARCH_H, SEARCH_H],
  );
  const rawCategoryY = useTransform(scrollY, [0, 40, 80], [0, -CATEGORY_H, -CATEGORY_H]);
  const rawCategoryOpacity = useTransform(scrollY, [0, 40, 80], [1, 0, 0]);
  const rawSearchY = useTransform(scrollY, [0, 30, 80], [90, 10, 25]);

  const springConfig = { stiffness: 300, damping: 35, mass: 0.5 };
  const stackHeight = useSpring(rawStackHeight, springConfig);
  const categoryY = useSpring(rawCategoryY, springConfig);
  const categoryOpacity = useSpring(rawCategoryOpacity, springConfig);
  const searchY = useSpring(rawSearchY, springConfig);

  // 검색 중 freeze
  const frozenStackHeight = CATEGORY_H + GAP + SEARCH_H;
  const frozenCategoryY = 0;
  const frozenCategoryOpacity = 1;
  const frozenSearchY = 87;

  if (isMobile) return <NavMobileView />;

  const isLanding = pathname === '/';

  return (
    <>
      <div
        className={`sticky top-0 left-0 w-full border-b z-50 
        ${isLanding ? 'bg-gradient-to-b from-white to-gray-50 shadow-md' : 'bg-white'}`}
      >
        {/* 상단 로고 + 로그인 */}
        <div
          className={`w-full flex items-center justify-between px-10
          ${isLanding ? 'absolute top-[15px] h-[64px]' : 'h-[80px] relative'}`}
        >
          <Link href='/'>
            {isTablet ? (
              <Image src='/images/icons/small_logo.svg' alt='Logo' width={40} height={40} />
            ) : (
              <Image src='/images/icons/logo.svg' alt='Logo' width={105} height={26} />
            )}
          </Link>
          <div className='flex items-center gap-2'>
            <LoginSection />
          </div>
        </div>

        {/* 랜딩 페이지에서만 스택 */}
        {isLanding && (
          <motion.div
            style={{ height: isSearching ? frozenStackHeight : stackHeight }}
            className='relative w-full flex justify-center px-6'
          >
            {/* 카테고리 */}
            <motion.div
              style={{
                y: isSearching ? frozenCategoryY : categoryY,
                opacity: isSearching ? frozenCategoryOpacity : categoryOpacity,
              }}
              className='absolute top-0 left-0 w-full flex justify-center cursor-pointer'
            >
              <CategoryList scrollY={scrollY} freeze={isSearching} />
            </motion.div>

            {/* 검색창 */}
            <motion.div
              style={{ y: isSearching ? frozenSearchY : searchY }}
              className='absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-50 px-10'
            >
              <SearchFilters
                scrollY={scrollY}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
              />
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* 검색 중일 때 뒷배경 */}
      {isSearching && (
        <div
          className='opacity-20 fixed top-0 left-0 w-screen h-screen bg-black z-40'
          onClick={() => {
            setIsSearching(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}
