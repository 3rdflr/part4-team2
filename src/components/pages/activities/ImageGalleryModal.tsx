'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SubImage } from '@/types/activities.type';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryModalProps {
  isOpen: boolean;
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
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string | number, boolean>>({});

  // 전체 이미지 배열 (배너 + 서브 이미지들)
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const handleImageLoad = (index: string | number) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: true }));
  };

  // 모달 열릴 때 초기 인덱스 설정
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // 바디 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 바디 스크롤 복구
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, close, handlePrevious, handleNext]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div className='absolute inset-0 bg-black bg-opacity-90' onClick={close} />

      {/* 모달 컨텐츠 */}
      <div className='relative w-full h-full max-w-6xl mx-4 flex flex-col'>
        {/* 헤더 */}
        <div className='flex items-center justify-between p-4 text-white'>
          <div>
            <h2 className='text-lg font-semibold truncate'>{title}</h2>
            <p className='text-sm text-gray-300'>
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>
          <button onClick={close} className='p-2 hover:bg-white/20 rounded-full transition-colors'>
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* 메인 이미지 */}
        <div className='flex-1 flex items-center justify-center relative'>
          <div className='relative w-full h-full max-h-[70vh]'>
            {!imageLoadStates[currentIndex] && <Skeleton className='absolute inset-0 z-10' />}
            <Image
              src={allImages[currentIndex].imageUrl}
              alt={`${title} - ${currentIndex + 1}`}
              fill
              className='object-contain'
              onLoad={() => handleImageLoad(currentIndex)}
              priority={currentIndex === 0}
            />
          </div>

          {/* 이전/다음 버튼 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={handleNext}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </>
          )}
        </div>

        {/* 썸네일 목록 */}
        {allImages.length > 1 && (
          <div className='p-4 bg-black/30'>
            <div className='flex gap-2 justify-center overflow-x-auto max-w-full'>
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                    ${
                      currentIndex === index
                        ? 'border-blue-500 scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }
                  `}
                >
                  {!imageLoadStates[`thumb-${index}`] && (
                    <Skeleton className='absolute inset-0 z-10 rounded-lg' />
                  )}
                  <Image
                    src={image.imageUrl}
                    alt={`썸네일 ${index + 1}`}
                    fill
                    className='object-cover'
                    onLoad={() => handleImageLoad(`thumb-${index}`)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
