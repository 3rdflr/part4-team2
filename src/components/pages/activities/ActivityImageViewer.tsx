'use client';

import { SubImage } from '@/types/activities.type';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { Expand, ImageIcon } from 'lucide-react';
import ImageGalleryModal from '@/components/pages/activities/ImageGalleryModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useOverlay } from '@/hooks/useOverlay';
import { motion } from 'motion/react';
import { useImageWithFallback } from '@/hooks/useImageWithFallback';
import clsx from 'clsx';

/**
 * 이미지를 표시하는 컴포넌트
 * - 배너 이미지와 서브 이미지 2개를 그리드 형태로 배치
 * - 클릭 시 모달로 확대
 * - Motion을 사용해서, 이미지 전환 시 부드러운 애니메이션 효과를 추가
 * - 호버 시 확대 효과 추가
 * - 이미지 로드 실패 시 대체 이미지를 표시
 * - 로딩 시 Skeleton 표시
 */
interface ActivityImageViewerProps {
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
}

export default function ActivityImageViewer({
  bannerImageUrl,
  subImages,
  title,
}: ActivityImageViewerProps) {
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});

  const overlay = useOverlay();

  // 각 이미지에 대한 fallback 처리
  const bannerImage = useImageWithFallback(bannerImageUrl);
  const subImage1 = useImageWithFallback(subImages[0]?.imageUrl || '');
  const subImage2 = useImageWithFallback(subImages[1]?.imageUrl || '');

  // 배너 이미지를 첫 번째로, 서브 이미지들을 그 다음으로 배치
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  // 남은 이미지 개수 = 전체 - 표시된 3개
  const remainingCount = Math.max(0, allImages.length - 3);

  // 모든 이미지가 로드되었는지 확인
  const requiredImages = ['main', 'sub-0', 'sub-1'].filter((_, index) => {
    if (index === 0) return true; // 메인 이미지는 항상 필요
    return subImages[index - 1]; // 서브 이미지는 존재할 때만
  });
  const allImagesLoaded = requiredImages.every((key) => imageLoadStates[key]);

  const handleImageLoad = (key: string) => {
    setImageLoadStates((prev) => ({ ...prev, [key]: true }));
  };

  // 이미지 클릭 핸들러
  const handleImageClick = useCallback(
    (index: number) => {
      // 모달 열기
      overlay.open(({ isOpen, close }) => (
        <ImageGalleryModal
          isOpen={isOpen}
          close={close}
          bannerImageUrl={bannerImageUrl}
          subImages={subImages}
          title={title}
          initialIndex={index}
        />
      ));
    },
    [bannerImageUrl, subImages, title, overlay],
  );

  return (
    <div className='w-full relative'>
      {/* 배너 + 서브 2개만 표시 */}
      <div className='grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-61 md:h-100'>
        {/* 메인 배너 이미지 (좌측 2x2) */}
        <div className='col-span-2 row-span-2 relative rounded-s-3xl overflow-hidden bg-gray-100 group cursor-pointer'>
          <motion.div
            className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105 '
            layoutId='activity-image-0'
          >
            {!allImagesLoaded && !imageLoadStates['main'] && (
              <Skeleton className='absolute inset-0 z-10' />
            )}
            <Image
              src={bannerImage.src}
              alt={title}
              fill
              sizes='(max-width: 768px) 50vw, 25vw'
              className='object-cover cursor-pointer'
              onClick={() => handleImageClick(0)}
              onLoad={() => {
                handleImageLoad('main');
                bannerImage.onLoad();
              }}
              onError={bannerImage.onError}
              priority
            />
            {/* 호버 시 확대 아이콘 */}
            <div
              className={clsx(
                'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors ',
                'flex items-center justify-center pointer-events-none',
              )}
            >
              <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3'>
                <Expand className='w-6 h-6 text-white' />
              </div>
            </div>
          </motion.div>
        </div>

        {/* 첫 번째 서브 이미지 (상단) */}
        {subImages[0] && (
          <div className='col-span-2 relative rounded-tr-3xl overflow-hidden bg-gray-100 group cursor-pointer'>
            <motion.div
              className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105'
              layoutId='activity-image-1'
            >
              {!allImagesLoaded && !imageLoadStates['sub-0'] && (
                <Skeleton className='absolute inset-0 z-10' />
              )}
              <Image
                src={subImage1.src}
                alt={`${title} 서브 이미지 1`}
                fill
                sizes='(max-width: 768px) 50vw, 25vw'
                className='object-cover cursor-pointer'
                onClick={() => handleImageClick(1)}
                onLoad={() => {
                  handleImageLoad('sub-0');
                  subImage1.onLoad();
                }}
                onError={subImage1.onError}
              />
              {/* 호버 효과 */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none'>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2'>
                  <Expand className='w-5 h-5 text-white' />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 두 번째 서브 이미지 (하단) */}
        {subImages[1] && (
          <div className='col-span-2 relative rounded-br-3xl overflow-hidden bg-gray-100 group cursor-pointer'>
            <motion.div
              className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105'
              layoutId='activity-image-2'
            >
              {!allImagesLoaded && !imageLoadStates['sub-1'] && (
                <Skeleton className='absolute inset-0 z-10' />
              )}
              <Image
                src={subImage2.src}
                alt={`${title} 서브 이미지 2`}
                fill
                sizes='(max-width: 768px) 50vw, 25vw'
                className='object-cover cursor-pointer'
                onClick={() => handleImageClick(2)}
                onLoad={() => {
                  handleImageLoad('sub-1');
                  subImage2.onLoad();
                }}
                onError={subImage2.onError}
              />

              {/* 남은 개수 표시 */}
              {remainingCount > 0 && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none'>
                  <div className='text-white text-center flex items-center gap-1'>
                    <ImageIcon className='w-6 h-6 mx-auto' />
                    <span className='text-2xl font-semibold'>+{remainingCount}</span>
                  </div>
                </div>
              )}

              {/* 호버 효과 */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none'>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2'>
                  <Expand className='w-5 h-5 text-white' />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
