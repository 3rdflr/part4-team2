'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CATEGORY_H, SEARCH_H, GAP } from '../home/Constants';
import { useScreenSize } from '@/hooks/useScreenSize';
import Link from 'next/link';
import Image from 'next/image';
import CategoryList from '../home/CategoryList';
import SearchFilters from '../home/SearchFilters';
import LoginSection from '../home/LoginSection';
import NavMobileView from '../home/NavMobileView';

export default function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { isMobile, isTablet } = useScreenSize();
  const [isSearching, setIsSearching] = useState(false);
  // **새로운 상태 추가**
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const cappedScrollY = useTransform(scrollY, (v) => Math.min(v, 1));

  // 스크롤 위치에 따른 애니메이션 원본 값 (raw values)
  const rawStackHeight = useTransform(
    cappedScrollY,
    [0, 0.5, 1],
    [CATEGORY_H + GAP + SEARCH_H, SEARCH_H, SEARCH_H],
  );
  const rawCategoryY = useTransform(cappedScrollY, [0, 0.5, 1], [0, -CATEGORY_H, -CATEGORY_H]);
  const rawCategoryOpacity = useTransform(cappedScrollY, [0, 0.5, 1], [1, 0, 0]);
  const rawSearchY = useTransform(cappedScrollY, [0, 0.5, 1], [90, 10, 25]);

  // spring easing 적용
  const springConfig = { stiffness: 300, damping: 35, mass: 0.5 };
  const stackHeight = useSpring(rawStackHeight, springConfig);
  const categoryY = useSpring(rawCategoryY, springConfig);
  const categoryOpacity = useSpring(rawCategoryOpacity, springConfig);
  const searchY = useSpring(rawSearchY, springConfig);

  // 검색창 focus 시 레이아웃 고정
  const frozenStackHeight = CATEGORY_H + GAP + SEARCH_H;
  const frozenCategoryY = 0;
  const frozenCategoryOpacity = 1;
  const frozenSearchY = 87;

  const isLanding = pathname === '/';

  // **isClient가 false일 때 null을 반환하여 서버 렌더링을 막음**
  if (!isClient) {
    return null;
  }

  if (isMobile) return <NavMobileView />;

  return (
    <>
      {/* 전체 네비게이션 wrapper */}
      <div
        className={`sticky top-0 left-0 w-full border-b z-[110] bg-gradient-to-b from-white to-gray-50 shadow-md`}
      >
        {/* 상단 로고 + 로그인 */}
        <div
          className={`w-full flex items-center justify-between px-10 cursor-pointer ${
            isLanding ? 'absolute top-[15px] h-[64px]' : 'h-[80px] relative'
          }`}
        >
          <Link href='/' className='z-[120]'>
            {isTablet ? (
              <Image src='/images/icons/small_logo.svg' alt='Logo' width={40} height={40} />
            ) : (
              <Image src='/images/icons/logo.svg' alt='Logo' width={105} height={26} />
            )}
          </Link>
          <div className='flex items-center gap-2 z-[120]'>
            <LoginSection />
          </div>
        </div>

        {/* 랜딩 페이지에서만 카테고리 + 검색창 + 배경 */}
        {isLanding && (
          <>
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
                className='absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-[110] px-10'
              >
                <SearchFilters
                  scrollY={scrollY}
                  isSearching={isSearching}
                  setIsSearching={setIsSearching}
                />
              </motion.div>
            </motion.div>

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
        )}
      </div>
    </>
  );
}
