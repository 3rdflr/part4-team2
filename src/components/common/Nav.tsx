'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CategoryList from '../home/CategoryList';
import SearchFilters from '../home/SearchFilters';
import { useState } from 'react';
import { useScreenSize } from '@/hooks/useScreenSize';
import LoginSection from '../home/LoginSection';
import NavMobileView from '@/components/home/NavMobileView';
import { usePathname } from 'next/navigation';

const CATEGORY_H = 80; // 카테고리 영역 높이
const SEARCH_H = 96; // 검색창 높이
const GAP = 5; // 카테고리와 검색창 사이 간격

export default function Nav() {
  const pathname = usePathname();
  const { isTablet, isMobile } = useScreenSize();
  const { scrollY } = useScroll();
  const [isSearching, setIsSearching] = useState(false);

  const rawStackHeight = useTransform(
    scrollY,
    [0, 1, 2], // 스크롤 범위 [0, 1, 2]으로 변경 (1px, 2)
    [CATEGORY_H + GAP + SEARCH_H, CATEGORY_H + SEARCH_H + GAP / 2, SEARCH_H],
  );

  const rawCategoryY = useTransform(
    scrollY,
    [0, 1, 2], // 스크롤 범위 [0, 1, 2]으로 변경
    [0, -CATEGORY_H / 6, -CATEGORY_H],
  );

  const rawCategoryOpacity = useTransform(
    scrollY,
    [0, 1, 2], // 스크롤 범위 [0, 1, 2]으로 변경
    [1, 0.85, 0],
  );

  const rawSearchY = useTransform(
    scrollY,
    [0, 1, 2], // 스크롤 범위 [0, 1, 2]으로 변경
    [90, 75, 25],
  );

  // 각 요소별 스프링 적용 (속도/튀는 정도 조절)
  const stackHeight = useSpring(rawStackHeight, { stiffness: 250, damping: 20, mass: 0.3 });
  const categoryY = useSpring(rawCategoryY, { stiffness: 300, damping: 20, mass: 0.3 });
  const categoryOpacity = useSpring(rawCategoryOpacity, { stiffness: 300, damping: 20, mass: 0.3 });
  const searchY = useSpring(rawSearchY, { stiffness: 300, damping: 15, mass: 0.25 });

  // 검색 중 기본 상태
  const frozenStackHeight = CATEGORY_H + GAP + SEARCH_H;
  const frozenCategoryY = 0;
  const frozenCategoryOpacity = 1;
  const frozenSearchY = 87;

  if (isMobile) return <NavMobileView />;

  return (
    <>
      <div className='sticky top-0 left-0 w-full bg-gradient-to-b from-white to-gray-50 items-center border-b z-50 shadow-md'>
        {/* 상단 로고 + 로그인 */}
        <div
          className={`top-[15px] w-full flex items-center justify-between h-[64px] px-10 pointer-events-auto ${pathname === '/' ? 'absolute' : 'h-[97px]'}`}
        >
          <Link href='/' className='z-60'>
            {isTablet ? (
              <Image src={'/images/icons/small_logo.svg'} alt='Logo' width={40} height={40} />
            ) : (
              <Image src={'/images/icons/logo.svg'} alt='Logo' width={105} height={26} />
            )}
          </Link>
          <div className='flex items-center gap-2 z-60 cursor-pointer'>
            <LoginSection />
          </div>
        </div>

        {pathname === '/' && (
          <>
            {/* 2단 스택: CategoryList 위 / SearchFilters 아래 */}
            <motion.div
              style={{ height: isSearching ? frozenStackHeight : stackHeight }}
              className='relative w-full flex justify-center px-6 pointer-events-none z-50'
            >
              {/* 카테고리 (위) */}
              <motion.div
                style={{
                  y: isSearching ? frozenCategoryY : categoryY,
                  opacity: isSearching ? frozenCategoryOpacity : categoryOpacity,
                }}
                className='absolute top-0 left-0 w-full flex justify-center cursor-pointer pointer-events-auto'
              >
                <CategoryList scrollY={scrollY} freeze={isSearching} />
              </motion.div>

              {/* 검색창 (아래 → 위로 슬라이드) */}
              <motion.div
                style={{ y: isSearching ? frozenSearchY : searchY }}
                className='absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-50 px-10 pointer-events-auto'
              >
                <SearchFilters
                  scrollY={scrollY}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </div>

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
