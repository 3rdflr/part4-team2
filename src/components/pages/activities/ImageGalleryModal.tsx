'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SubImage } from '@/types/activities.type';
import { cn } from '@/lib/utils/shadCnUtils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 이미지 갤러리 모달 컴포넌트
 * - 이미지들을 모달로 확대하여 표시
 * - ActivityImageViewer 컴포넌트와 애니메이션 연동
 * - 이미지 로드 실패 시 대체 이미지 표시
 * - 모바일용 UI 제공
 */
interface ImageGalleryModalProps {
  isOpen: boolean; // 모달 열림 상태
  close: () => void;
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
  initialIndex?: number;
}

export default function ImageGalleryModal({
  isOpen,
  close,
  bannerImageUrl,
  subImages,
  title,
  initialIndex = 0,
}: ImageGalleryModalProps) {
  /** 상태 관리 */
  // 현재 이미지 인덱스
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // 이미지 로드 상태
  const [imageLoadStates, setImageLoadStates] = useState<Record<string | number, boolean>>({});
  // 이미지 에러 상태 (fallback 사용 여부)
  const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});

  // 전체 이미지 배열 (배너 + 서브 이미지들)
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  // 현재 이미지 src (에러 시 placeholder 사용)
  const getCurrentImageSrc = (index: number) => {
    return imageErrors[index] ? '/images/placeholder.svg' : allImages[index]?.imageUrl;
  };

  // 이전 이미지로 이동
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);
  // 다음 이미지로 이동
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // 이미지 로드 완료 핸들러
  const handleImageLoad = useCallback((index: string | number) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: true }));
  }, []);

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    close();
  }, [close]);

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        document.body.style.overflow = 'hidden';
      }

      const preventScroll = (e: TouchEvent) => {
        if (isMobile && e.target === document.body) {
          e.preventDefault();
        }
      };

      if (isMobile) {
        document.addEventListener('touchmove', preventScroll, { passive: false });
      }

      return () => {
        document.body.style.overflow = 'unset';
        if (isMobile) {
          document.removeEventListener('touchmove', preventScroll);
        }
      };
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, handleClose, handlePrevious, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[150] flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/*배경 오버레이 */}
          <motion.div
            className='absolute inset-0 bg-white'
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className='relative w-full h-full flex flex-col max-w-7xl mx-auto max-h-screen md:max-h-full'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <motion.div
              className='w-full flex justify-between items-center p-4 md:p-10'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/*이미지 카운터 - 데스크톱에서만 표시 */}
              {allImages.length > 1 && (
                <div
                  className={cn(
                    'hidden md:block px-3 py-1.5 rounded-full',
                    'bg-gray-100 text-gray-600 text-sm font-medium',
                    'border border-gray-200',
                  )}
                >
                  {currentIndex + 1} / {allImages.length}
                </div>
              )}

              <div className='md:hidden' />
              <h1 className='text-base md:text-lg font-semibold text-gray-800 text-center flex-1 md:flex-none'>
                {title}
              </h1>
              {/*닫기 버튼 */}
              <button
                onClick={handleClose}
                className={cn(
                  'text-gray-600',
                  'hover:bg-gray-200 transition-all duration-300',
                  'rounded-full p-2',
                )}
              >
                <X className='w-5 h-5' />
              </button>
            </motion.div>

            {/*메인 이미지 영역 */}
            <div className='flex-1 px-4 py-6 md:py-12 min-h-0'>
              {/* 모바일 - 수직 스크롤 갤러리 */}
              <div
                className='md:hidden h-full overflow-y-auto overscroll-contain'
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <motion.div
                  className='space-y-4'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {allImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className='relative w-full'
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileInView={{ scale: [0.95, 1] }}
                      viewport={{ once: true, margin: '-50px' }}
                    >
                      <div className='aspect-[4/3] relative rounded-2xl overflow-hidden bg-gray-100'>
                        {!imageLoadStates[index] && (
                          <div className='absolute inset-0 flex items-center justify-center z-10'>
                            <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
                          </div>
                        )}
                        <Image
                          src={getCurrentImageSrc(index)}
                          alt={`${title} - ${index + 1} 이미지`}
                          fill
                          className='object-cover'
                          onLoad={() => handleImageLoad(index)}
                          onError={() => {
                            console.log('🖼️ Mobile image failed to load:', image.imageUrl);
                            setImageErrors((prev) => ({ ...prev, [index]: true }));
                          }}
                          priority={index === 0}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* 데스크톱 */}
              <div className='hidden md:flex items-center justify-center h-full relative'>
                <motion.div
                  key={currentIndex}
                  layoutId={`activity-image-${currentIndex}`}
                  className='flex items-center justify-center w-full max-w-4xl max-h-[70vh]'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/*이미지 로딩 상태 */}
                  {!imageLoadStates[currentIndex] && (
                    <div className='absolute flex items-center justify-center'>
                      <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
                    </div>
                  )}
                  <Image
                    src={getCurrentImageSrc(currentIndex)}
                    alt={`${title} - ${currentIndex + 1}`}
                    width={600}
                    height={400}
                    className='object-contain rounded-2xl shadow-lg'
                    onLoad={() => {
                      handleImageLoad(currentIndex);
                    }}
                    onError={() => {
                      console.log(
                        '🖼️ Modal image failed to load:',
                        allImages[currentIndex]?.imageUrl,
                      );
                      setImageErrors((prev) => ({ ...prev, [currentIndex]: true }));
                    }}
                    priority={currentIndex === 0}
                  />
                </motion.div>

                {/*네비게이션 - 데스크톱에서만 표시 */}
                {allImages.length > 1 && (
                  <>
                    <motion.button
                      onClick={handlePrevious}
                      className={cn(
                        'absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
                        'bg-gray-100 text-gray-600',
                        'hover:bg-gray-200 transition-all duration-300',
                        'border border-gray-200',
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 0.8, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronLeft className='w-6 h-6' />
                    </motion.button>
                    <motion.button
                      onClick={handleNext}
                      className={cn(
                        'absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
                        'bg-gray-100 text-gray-600',
                        'hover:bg-gray-200 transition-all duration-300',
                        'border border-gray-200',
                      )}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 0.8, x: 0 }}
                      transition={{ delay: 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ChevronRight className='w-6 h-6' />
                    </motion.button>
                  </>
                )}
              </div>
            </div>

            {/*썸네일 네비게이션 - 데스크톱에서만 표시 */}
            {allImages.length > 1 && (
              <motion.div
                className='hidden md:flex justify-center pb-8 px-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex gap-3 p-3 bg-gray-100 rounded-2xl border border-gray-200 overflow-x-auto max-w-full'>
                  {allImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0',
                        currentIndex === index
                          ? 'ring-2 ring-gray-200 scale-110'
                          : 'hover:scale-105 opacity-70 hover:opacity-100',
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={getCurrentImageSrc(index)}
                        alt={`${title} thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                        onError={() => {
                          console.log('🖼️ Thumbnail failed to load:', image.imageUrl);
                          setImageErrors((prev) => ({ ...prev, [index]: true }));
                        }}
                      />
                      {currentIndex === index && (
                        <motion.div
                          className='absolute inset-0 bg-white/20 rounded-xl'
                          layoutId='thumbnail-active'
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
