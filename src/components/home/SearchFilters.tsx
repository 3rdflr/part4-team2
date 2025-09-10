'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { X, SearchIcon } from 'lucide-react';
import PriceFilter from './PriceFilter';
import { PLACES } from './Constants';
import Image from 'next/image';
import { useScreenSize } from '@/hooks/useScreenSize';

type Props = {
  scrollY: MotionValue<number>;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

type Place = { src: string; name: string; description: string };
type Section = 'place' | 'price' | 'keyword';

export default function SearchFilters({ scrollY, isSearching, setIsSearching }: Props) {
  const router = useRouter();
  const { isTablet } = useScreenSize();

  // --------------------
  // State
  // --------------------
  const [openedSection, setOpenedSection] = useState<Section | ''>('');
  const [hoverSection, setHoverSection] = useState<Section | null>(null);
  const [place, setPlace] = useState('');
  const [placeInput, setPlaceInput] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(PLACES);
  const [price, setPrice] = useState<[number, number]>([0, 300_000]);
  const [keyword, setKeyword] = useState('');
  const [isShrunk, setIsShrunk] = useState(false);

  // 검색어 접미사 제거
  const normalize = (s: string) => {
    if (!s) return '';
    return s
      .replace(/(특별자치도|특별자치시|광역시|특별|도|시)$/g, '')
      .trim()
      .toLowerCase();
  };

  // --------------------
  // Refs
  // --------------------
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs: Record<Section, React.MutableRefObject<HTMLDivElement | null>> = {
    place: useRef(null),
    price: useRef(null),
    keyword: useRef(null),
  };

  // --------------------
  // Motion Values
  // --------------------
  const highlightX = useMotionValue(0);
  const highlightW = useMotionValue(0);
  const rawWidth = useTransform(scrollY, [0, 1], [814, 340]);
  const rawHeight = useTransform(scrollY, [0, 1], [64, 46]);
  const width = useMotionValue(814);
  const height = useMotionValue(64);

  // --------------------
  // Section Labels
  // --------------------
  const sectionLabels = { place: '지역', price: '가격', keyword: '검색어' } as const;
  const sections: Array<keyof typeof sectionLabels> = ['place', 'price', 'keyword'];

  // --------------------
  // Functions
  // --------------------

  // highlight 위치/너비 갱신
  const updateHighlight = () => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const openedEl = openedSection ? sectionRefs[openedSection].current : null;
    const hoverEl = hoverSection ? sectionRefs[hoverSection].current : null;

    if (!openedEl && !hoverEl) {
      animate(highlightW, 0, { type: 'spring', stiffness: 450, damping: 40 });
      return;
    }

    let left = openedEl
      ? openedEl.getBoundingClientRect().left - containerRect.left
      : hoverEl!.getBoundingClientRect().left - containerRect.left;
    let right = openedEl
      ? openedEl.getBoundingClientRect().right - containerRect.left
      : hoverEl!.getBoundingClientRect().right - containerRect.left;

    // hover가 열려있을 경우 좌우 합산
    if (openedEl && hoverEl) {
      const oRect = openedEl.getBoundingClientRect();
      const hRect = hoverEl.getBoundingClientRect();
      left = Math.min(oRect.left, hRect.left) - containerRect.left;
      right = Math.max(oRect.right, hRect.right) - containerRect.left;
    }

    animate(highlightX, left, { type: 'spring', stiffness: 450, damping: 40 });
    animate(highlightW, right - left, { type: 'spring', stiffness: 450, damping: 40 });
  };

  // 검색 실행
  const handleSearch = () => {
    const params = new URLSearchParams();

    const normalizedPlace = normalize(place);
    if (normalizedPlace) params.append('place', normalizedPlace);
    if (price[0] !== 0) params.append('min-price', price[0].toString());
    if (price[1] !== 300_000) params.append('max-price', price[1].toString());
    if (keyword) params.append('keyword', keyword);

    router.push(`/?${params.toString()}`);

    setIsSearching(false);
    setOpenedSection('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    animate(height, rawHeight.get(), { type: 'spring', stiffness: 300, damping: 35 });
  };

  // 검색 초기화
  const handleReset = () => {
    setIsSearching(false);
    setPlace('');
    setPlaceInput('');
    setPrice([0, 300_000]);
    setKeyword('');
    setOpenedSection('');
    animate(height, rawHeight.get(), { type: 'spring', stiffness: 300, damping: 35 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dimmed = openedSection !== '' || isSearching;

  // --------------------
  // Effects
  // --------------------

  // highlight 업데이트
  useEffect(() => {
    updateHighlight();
    const t = setTimeout(updateHighlight, 300);
    return () => clearTimeout(t);
  }, [openedSection, hoverSection, width]);

  useEffect(() => {
    const unsubWidth = rawWidth.on('change', (v) => {
      // 검색 중이면 width, hight 고정, 그 외엔 scrollY 따라감
      animate(width, isSearching ? 814 : v, { type: 'spring', stiffness: 300, damping: 35 });
    });

    const unsubHeight = rawHeight.on('change', (v) => {
      animate(height, isSearching ? 64 : v, { type: 'spring', stiffness: 300, damping: 35 });
    });

    return () => {
      unsubWidth();
      unsubHeight();
    };
  }, [isSearching]);

  // width / height animate
  useEffect(() => {
    animate(width, isSearching ? 814 : rawWidth.get(), {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    });
    animate(height, isSearching ? 64 : rawHeight.get(), {
      type: 'spring',
      stiffness: 300,
      damping: 35,
    });
  }, [isTablet, isSearching]);

  // shrink 판단
  useEffect(() => {
    const unsub = height.on('change', (h) => setIsShrunk(h < 50));
    setIsShrunk(height.get() < 50);
    return () => unsub();
  }, [height]);

  // resize 이벤트
  useEffect(() => {
    const onResize = () => updateHighlight();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenedSection('');
        setIsSearching(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --------------------
  // Render
  // --------------------
  return (
    <motion.div
      ref={containerRef}
      className='mx-auto rounded-full z-50 relative shadow-lg cursor-pointer'
      style={{ width, height, minWidth: 340 }}
    >
      {/* 배경 */}
      <div
        className={`absolute inset-0 rounded-full pointer-events-none ${dimmed ? 'bg-grayscale-50' : 'bg-white'}`}
      />

      {/* highlight */}
      <motion.div
        style={{ left: highlightX, width: highlightW }}
        animate={{ opacity: hoverSection && !isTablet ? 1 : openedSection ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`absolute top-0 bottom-0 z-10 shadow-md rounded-full pointer-events-none ${isSearching ? 'bg-white' : 'bg-grayscale-50'}`}
      />

      {/* 섹션 버튼 */}
      <div className='relative z-20 w-full h-full grid overflow-auto grid-cols-[1fr_1fr_1fr] scrollbar-hide'>
        {sections.map((sec) => {
          const isKeyword = sec === 'keyword';
          return (
            <div
              key={sec}
              ref={(el) => {
                sectionRefs[sec].current = el;
              }}
              data-section={sec}
              className={`relative flex flex-col justify-center px-6 cursor-pointer select-none ${isKeyword ? 'pr-12' : ''}`}
              onMouseEnter={() => setHoverSection(sec)}
              onMouseLeave={() => setHoverSection(null)}
              onClick={(e) => {
                e.stopPropagation();
                setIsSearching(true);
                setOpenedSection(sec);
                setTimeout(updateHighlight, 0);
              }}
            >
              <span
                className={`text-title ${isShrunk ? 'text-14-regular text-center' : 'text-12-regular'} truncate`}
                style={{ minWidth: 0 }}
              >
                {sectionLabels[sec]}
              </span>

              {/* Place input */}
              {!isShrunk && sec === 'place' && (
                <input
                  type='text'
                  value={placeInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlaceInput(val);

                    setPlace(val);

                    const normalizedVal = normalize(val);
                    setFilteredPlaces(
                      PLACES.filter((p) => {
                        const normalizedName = normalize(p.name);
                        return normalizedName.includes(normalizedVal);
                      }),
                    );

                    if (openedSection !== 'place') setOpenedSection('place');
                  }}
                  placeholder='여행지 검색'
                  className='bg-transparent text-12-medium text-title focus:outline-none placeholder:text-14-regular placeholder:text-subtitle truncate'
                  style={{ minWidth: 0 }}
                />
              )}

              {/* Price 표시 */}
              {!isShrunk && sec === 'price' && (
                <span className='text-14-regular text-subtitle truncate' style={{ minWidth: 0 }}>
                  {price[0].toLocaleString()}원~
                  {price[1] >= 300_000 ? '30만 원 이상' : `${price[1].toLocaleString()}원`}
                </span>
              )}

              {/* Keyword input */}
              {isKeyword && (
                <>
                  {!isShrunk && (
                    <input
                      type='text'
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      placeholder='원하는 체험 검색'
                      className='bg-transparent text-sm text-title focus:outline-none placeholder:text-14px-regular placeholder:text-subtitle truncate'
                      style={{ minWidth: 0 }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setOpenedSection('keyword');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  )}

                  {/* 검색 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch();
                    }}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow cursor-pointer transition
                      ${isShrunk ? 'w-7 h-7 right-2 bg-primary-500 text-white hover:bg-primary-600' : 'right-3 w-10 h-10 bg-primary-500 text-white hover:bg-primary-600'}
                    `}
                    aria-label='검색'
                  >
                    <SearchIcon width={24} height={24} />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Drop-down */}
      <AnimatePresence>
        {openedSection && openedSection !== 'keyword' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`relative top-0 mt-3 bg-white rounded-2xl shadow-xl z-40 ${
              openedSection === 'place'
                ? 'w-[425px] h-[344px] overflow-y-scroll scrollbar-hide py-9 pl-3'
                : 'w-[590px] pt-9 pb-3 pl-6 pr-9'
            }`}
          >
            <button
              className='absolute top-3 right-3 text-gray-400 hover:text-gray-600'
              onClick={handleReset}
            >
              <X size={20} />
            </button>

            {openedSection === 'place' && (
              <ul className='space-y-2 overflow-y-auto'>
                {filteredPlaces.map((place) => (
                  <li
                    key={place.name}
                    className='flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer'
                    onClick={() => {
                      setPlace(place.name);
                      setPlaceInput(place.name);
                      setFilteredPlaces(PLACES);
                    }}
                  >
                    <Image src={place.src} alt={place.name} width={56} height={56} />
                    <div className='flex flex-col justify-center min-w-0'>
                      <span className='text-14-regular text-title truncate'>{place.name}</span>
                      <span className='block text-12-regular text-grayscale-500 truncate'>
                        {place.description}
                      </span>
                    </div>
                  </li>
                ))}
                {filteredPlaces.length === 0 && (
                  <li className='p-3 text-gray-400'>검색 결과가 없습니다.</li>
                )}
              </ul>
            )}

            {openedSection === 'price' && (
              <div>
                <h3 className='text-lg font-bold mb-3'>가격 범위</h3>
                <PriceFilter priceRange={price} setPriceRange={setPrice} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
