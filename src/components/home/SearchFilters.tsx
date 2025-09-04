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

type Props = {
  scrollY: MotionValue<number>;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
};

type Place = {
  src: string;
  name: string;
  description: string;
};

export default function SearchFilters({ scrollY, isSearching, setIsSearching }: Props) {
  const router = useRouter();

  const [openedSection, setOpenedSection] = useState<'place' | 'price' | 'keyword' | ''>('');
  const [hoverSection, setHoverSection] = useState<'place' | 'price' | 'keyword' | null>(null);
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState<[number, number]>([0, 300_000]);
  const [placeInput, setPlaceInput] = useState('');
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(PLACES);
  const [keyword, setKeyword] = useState('');

  const sectionLabels = { place: '지역', price: '가격', keyword: '검색어' } as const;
  const sections: Array<keyof typeof sectionLabels> = ['place', 'price', 'keyword'];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = {
    place: useRef<HTMLDivElement | null>(null),
    price: useRef<HTMLDivElement | null>(null),
    keyword: useRef<HTMLDivElement | null>(null),
  };

  const highlightX = useMotionValue(0);
  const highlightW = useMotionValue(0);

  const rawWidth = useTransform(scrollY, [0, 1], [814, 340]);
  const rawHeight = useTransform(scrollY, [0, 1], [64, 46]);
  const width = useMotionValue(814);
  const height = useMotionValue(64);

  const [isShrunk, setIsShrunk] = useState(false);

  // 🔹 DOM 기반 highlight 업데이트
  const updateHighlight = () => {
    if (!containerRef.current) return;

    let target: HTMLDivElement | null = null;
    if (hoverSection) target = sectionRefs[hoverSection].current;
    else if (openedSection) target = sectionRefs[openedSection].current;

    if (!target) {
      animate(highlightW, 0, { type: 'spring', stiffness: 500, damping: 30 });
      return;
    }

    const targetRect = target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const left = targetRect.left - containerRect.left;
    const widthValue = targetRect.width;

    animate(highlightX, left, { type: 'spring', stiffness: 500, damping: 30 });
    animate(highlightW, widthValue, { type: 'spring', stiffness: 500, damping: 30 });
  };

  useEffect(() => {
    updateHighlight();
    const t = setTimeout(updateHighlight, 100);
    return () => clearTimeout(t);
  }, [openedSection, hoverSection, isShrunk, width]);

  useEffect(() => {
    const unsubWidth = rawWidth.onChange((v) => {
      if (!isSearching) animate(width, v, { type: 'spring', stiffness: 300, damping: 35 });
    });
    const unsubHeight = rawHeight.onChange((v) => {
      if (!isSearching) animate(height, v, { type: 'spring', stiffness: 300, damping: 35 });
    });

    if (isSearching) {
      animate(width, 814, { type: 'spring', stiffness: 300, damping: 35 });
      animate(height, 64, { type: 'spring', stiffness: 300, damping: 35 });
    }

    return () => {
      unsubWidth();
      unsubHeight();
    };
  }, [isSearching]);

  useEffect(() => {
    const unsub = height.onChange((h) => setIsShrunk(h < 50));
    setIsShrunk(height.get() < 50);
    return () => unsub();
  }, [height]);

  useEffect(() => {
    const onResize = () => updateHighlight();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenedSection('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (place) params.append('place', place);
    if (price[0] !== 0) params.append('min-price', price[0].toString());
    if (price[1] !== 300_000) params.append('max-price', price[1].toString());
    if (keyword) params.append('keyword', keyword);

    router.push(`/?${params.toString()}`);
    setOpenedSection('');
    setIsSearching(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    animate(height, rawHeight.get(), { type: 'spring', stiffness: 300, damping: 35 });
  };

  const handleReset = () => {
    setIsSearching(false);
    setPlace('');
    setPrice([0, 300_000]);
    setKeyword('');
    setOpenedSection('');

    animate(height, rawHeight.get(), { type: 'spring', stiffness: 300, damping: 35 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dimmed = openedSection !== '' || isSearching;

  return (
    <motion.div
      ref={containerRef}
      className='mx-auto rounded-full z-50 relative shadow-lg cursor-pointer'
      style={{ width, height, minWidth: 340 }}
    >
      <div
        className={`absolute inset-0 rounded-full pointer-events-none ${dimmed ? 'bg-grayscale-50' : 'bg-white'}`}
      />
      <motion.div
        style={{ left: highlightX, width: highlightW }}
        className={`absolute top-0 bottom-0 z-10 shadow-md rounded-full pointer-events-none ${isSearching ? 'bg-white' : 'bg-grayscale-50'}`}
      />

      <div className='relative z-20 w-full h-full grid overflow-auto grid-cols-[1fr_1fr_1fr]'>
        {sections.map((sec) => {
          const ref = sectionRefs[sec];
          const isKeyword = sec === 'keyword';

          return (
            <div
              key={sec}
              ref={(el) => {
                ref.current = el;
              }}
              data-section={sec}
              className={`relative flex flex-col justify-center px-6 cursor-pointer select-none ${isKeyword ? 'pr-12' : ''}`}
              onMouseEnter={() => setHoverSection(sec)}
              onMouseLeave={() => setHoverSection(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (isShrunk && !isSearching) {
                  setIsSearching(true);
                  setTimeout(() => {
                    setOpenedSection(sec);
                    updateHighlight();
                  }, 300);
                  return;
                }
                setIsSearching(true);
                setOpenedSection(sec);
                setTimeout(updateHighlight, 0);
              }}
            >
              <span
                className={`text-title ${isShrunk ? 'text-center text-14-regular' : 'text-12-regular'} truncate`}
                style={{ minWidth: 0 }}
              >
                {sectionLabels[sec]}
              </span>

              {!isShrunk && sec === 'place' && (
                <input
                  type='text'
                  value={placeInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPlaceInput(val);

                    setFilteredPlaces(
                      PLACES.filter((place) =>
                        place.name.toLowerCase().includes(val.toLowerCase()),
                      ),
                    );

                    setIsSearching(true);
                    setOpenedSection('place');
                  }}
                  placeholder='여행지 검색'
                  className='bg-transparent text-12-medium text-title focus:outline-none placeholder:text-14-regular placeholder:text-subtitle truncate'
                  style={{ minWidth: 0 }}
                />
              )}
              {!isShrunk && sec === 'price' && (
                <span className='text-14-regular text-subtitle truncate' style={{ minWidth: 0 }}>
                  {price[0].toLocaleString()}원~
                  {price[1] >= 300_000 ? '30만 원 이상' : `${price[1].toLocaleString()}원`}
                </span>
              )}

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
                        setIsSearching(true);
                        setOpenedSection('keyword');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  )}

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

      <AnimatePresence>
        {openedSection && openedSection !== 'keyword' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className={`relative top-0 mt-3 bg-white rounded-2xl shadow-xl py-9 z-40 ${openedSection === 'place' ? 'w-[425px] h-[344px] overflow-y-scroll pl-3' : 'left-[275px] w-[540px] px-10'}`}
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
                    <Image src={place.src} alt='한옥' width={56} height={56} />

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
