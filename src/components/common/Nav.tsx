'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  const [isClient, setIsClient] = useState(false);

  const isLanding = pathname === '/';

  const withOutNav = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // Nav 전체 height motion: 181px -> 96px
  const cappedScrollY = useTransform(scrollY, (v) => Math.min(v, 1));
  const rawNavHeight = useTransform(cappedScrollY, [0, 1], [165, 79]);
  const navHeight = useSpring(rawNavHeight, { stiffness: 300, damping: 35 });

  // 카테고리 & 검색창 y-offset
  const rawCategoryY = useTransform(cappedScrollY, [0, 1], [0, -70]);
  const rawCategoryOpacity = useTransform(cappedScrollY, [0, 1], [1, 0]);
  const rawSearchY = useTransform(cappedScrollY, [0, 1], [0, -70]);

  const springConfig = { stiffness: 300, damping: 35, mass: 0.5 };

  const categoryY = useSpring(rawCategoryY, springConfig);
  const categoryOpacity = useSpring(rawCategoryOpacity, springConfig);
  const searchY = useSpring(rawSearchY, springConfig);

  useEffect(() => setIsClient(true), []);

  if (!isClient)
    return (
      <div className='w-full h-[79px] flex items-center justify-center bg-grayscale-25 shadow-md animate-pulse'></div>
    );

  if (withOutNav) return null;

  if (isMobile) return <NavMobileView />;

  return (
    <>
      <motion.div
        className='fixed top-0 left-0 w-full border-b z-[110] bg-gradient-to-b from-white to-gray-50 shadow-md'
        style={{
          height: isLanding
            ? isSearching
              ? 165 // 검색 중일 때 원래 최대 height 유지
              : navHeight
            : 79,
        }}
      >
        {/* 상단 로고 + 로그인 */}
        <div className='flex items-center justify-between px-10 h-[79px]'>
          <Link href='/' className={`${isSearching ? 'z-[100]' : 'z-[120]'}`}>
            {isTablet ? (
              <Image
                src='/images/icons/small_logo.svg'
                alt='Logo'
                width={40}
                height={40}
                className='w-[40px] h-auto'
              />
            ) : (
              <Image
                src='/images/icons/logo.svg'
                alt='Logo'
                width={105}
                height={26}
                className='w-[105px] h-auto'
              />
            )}
          </Link>

          <div className={`flex items-center gap-2 ${isSearching ? 'z-[100]' : 'z-[120]'}`}>
            <LoginSection />
          </div>
        </div>

        {/* 랜딩페이지에서만 카테고리 + 검색창 */}
        {isLanding && (
          <div className='flex flex-col items-center pointer-events-none relative top-[-79px]'>
            {/* 카테고리 */}
            <motion.div
              style={{
                y: isSearching ? 0 : categoryY,
                opacity: isSearching ? 1 : categoryOpacity,
              }}
              className='w-full flex justify-center pointer-events-auto'
            >
              <CategoryList scrollY={scrollY} freeze={isSearching} />
            </motion.div>

            {/* 검색창 */}
            <motion.div
              style={{ y: isSearching ? 0 : searchY }}
              className='w-full flex justify-center items-center pointer-events-auto px-10 mt-2 z-[110]'
            >
              <SearchFilters
                scrollY={scrollY}
                isSearching={isSearching}
                setIsSearching={setIsSearching}
              />
            </motion.div>

            {/* dim background */}
            {isSearching && (
              <div
                className='fixed top-0 left-0 w-screen h-screen bg-black opacity-20 z-[100]'
                onClick={() => setIsSearching(false)}
              />
            )}
          </div>
        )}
      </motion.div>

      {/* Spacer to prevent content overlap */}
      <div style={{ height: isLanding ? 165 : 64 }} />
    </>
  );
}
