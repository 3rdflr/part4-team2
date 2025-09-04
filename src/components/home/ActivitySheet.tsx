'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { FaMapMarkedAlt as MapIcon } from 'react-icons/fa';
import { useScreenSize } from '@/hooks/useScreenSize';

export default function ActivitySheet({
  totalCount,
  children,
}: {
  totalCount: number;
  children?: React.ReactNode;
}) {
  const { isMobile } = useScreenSize();
  const [fullHeight, setFullHeight] = useState(0);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);

  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const CLOSED_HEIGHT = !isMobile ? 44 : 120;

  const y = useMotionValue(0);
  useEffect(() => {
    let sheet: HTMLElement | null = contentRef.current;
    let lastScrollTop = 0;

    const handleScroll = () => {
      if (!sheet) return;
      const scrollTop = sheet.scrollTop;
      setScrollingDown(scrollTop > lastScrollTop);
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    const attachScroll = () => {
      sheet = contentRef.current;
      if (sheet) {
        sheet.removeEventListener('scroll', handleScroll);
        sheet.addEventListener('scroll', handleScroll);
      }
    };

    attachScroll();

    // DOM이 생기면 이벤트 다시 연결
    const observer = new MutationObserver(() => {
      attachScroll();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      sheet?.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight * 0.9;
      setFullHeight(height);
      // 시트가 닫힌 상태를 유지하도록 y 값만 업데이트
      if (!isFullyOpen) {
        y.set(height - CLOSED_HEIGHT);
      } else {
        y.set(0);
      }
    };

    // 초기값 설정
    handleResize();

    // 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [y, isFullyOpen, isMobile]);

  const handleDragEnd = (_: Event, info: { velocity: { y: number } }) => {
    if (!fullHeight) return;

    const currentY = y.get();
    if (info.velocity.y > 500 || currentY > fullHeight - 200) {
      // CLOSED_HEIGHT + 100 대신 fullHeight - 200으로 수정
      animate(y, fullHeight - CLOSED_HEIGHT, { type: 'spring', stiffness: 200, damping: 35 });
      setIsFullyOpen(false);
    } else {
      animate(y, 0, { type: 'spring', stiffness: 200, damping: 35 });
      setIsFullyOpen(true);
    }
  };

  if (!fullHeight) return null;

  return (
    <div className='flex items-center justify-center z-[110]'>
      <motion.div
        ref={sheetRef}
        className='fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-lg'
        style={{ height: fullHeight, y }}
        drag='y'
        dragConstraints={{ top: 0, bottom: fullHeight - CLOSED_HEIGHT }}
        onDragEnd={handleDragEnd}
        dragElastic={0.2}
      >
        <div className='p-5 flex justify-center cursor-grab'>
          <div className='w-12 h-1 bg-gray-300 rounded' />
        </div>

        <article
          className='activity-sheet-content px-4 pt-2 pb-8 h-[calc(100%-40px)] overflow-y-auto overscroll-contain'
          ref={contentRef}
          style={{
            pointerEvents: 'auto',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
          }}
        >
          <h2 className='text-14-regular text-title text-center mt-5'>
            지도 표시 지역의 체험 {totalCount}개
          </h2>
          {children}
        </article>
      </motion.div>
      <AnimatePresence>
        {isFullyOpen && (
          <motion.button
            key='map-button'
            className='fixed bg-title text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg bottom-24'
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              bottom: isMobile ? (scrollingDown ? 48 : 96) : 48, // bottom 값도 motion으로 제어
            }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }} // 이동도 부드럽게
            onClick={() => {
              animate(y, fullHeight - CLOSED_HEIGHT, {
                type: 'spring',
                stiffness: 200,
                damping: 35,
              });
              contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              setIsFullyOpen(false);
            }}
          >
            지도 <MapIcon className='w-4 h-4' />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
