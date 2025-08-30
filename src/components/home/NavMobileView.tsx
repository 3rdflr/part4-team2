'use client';

import { useState } from 'react';
import { Search, SearchIcon, X, ArrowLeft, Share } from 'lucide-react';
import MobileCategoryList from './MobileCategoryList';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACES } from './Constants';
import { usePathname, useRouter } from 'next/navigation';
import PriceFilter from './PriceFilter';
import Image from 'next/image';

type Place = {
  src: string;
  name: string;
  description: string;
};

export default function NavMobileView() {
  const [openedSection, setOpenedSection] = useState<'place' | 'price' | ''>('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>(PLACES);
  const [placeInput, setPlaceInput] = useState('');
  const [price, setPrice] = useState<[number, number]>([0, 300_000]);
  const [keyword, setKeyword] = useState('');
  const [place, setPlace] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  const showNav = pathname !== '/profile';
  const otherPage = pathname !== '/';
  const share = pathname.startsWith('/activities');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '내 사이트 제목',
          text: '여기 재미있는 컨텐츠가 있어요!',
          url: window.location.href,
        });
      } catch (err) {
        console.error('공유 취소 또는 실패:', err);
      }
    } else {
      // fallback (지원 안하는 브라우저)
      await navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다!');
    }
  };

  if (!showNav) return null;

  if (otherPage)
    return (
      <div className='w-full flex justify-between items-center py-4 px-6'>
        <button
          className='w-[40px] h-[40px]  flex items-center justify-center text-title bg-gray-100 rounded-full shadow-lg'
          onClick={() => router.back()}
        >
          <ArrowLeft strokeWidth={2} width={16} height={16} />
        </button>
        {share && (
          <button
            className='w-[40px] h-[40px] flex items-center justify-center text-title bg-gray-100 rounded-full shadow-lg'
            onClick={handleShare}
          >
            <Share strokeWidth={2} width={16} height={16} />
          </button>
        )}
      </div>
    );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (place) params.append('place', place);
    if (price[0] !== 0) params.append('min-price', price[0].toString());
    if (price[1] !== 300_000) params.append('max-price', price[1].toString());
    if (keyword) params.append('keyword', keyword);

    router.push(`/?${params.toString()}`);
    setIsSearching(false);
  };

  return (
    <>
      {!isSearching ? (
        <div className='fixed top-0 left-0 w-full border-b border-gray-200 bg-gradient-to-b from-white to-gray-50 z-50'>
          <div className='px-10'>
            <button
              className='flex items-center justify-center gap-2 min-w-[275px] w-full bg-white h-[55px] rounded-full shadow-lg mt-6 mb-2'
              onClick={() => setIsSearching(true)}
            >
              <Search width={12} height={12} className='text-title' />
              <span className='text-title text-12-medium'>검색을 시작해 보세요</span>
            </button>
          </div>
          <div className='relative flex justify-center z-50'>
            <MobileCategoryList />
          </div>
        </div>
      ) : (
        <motion.div
          className='fixed top-0 left-0 w-full h-full bg-grayscale-25 z-50 overflow-y-scroll scrollbar-hide'
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ ease: [0.25, 0.8, 0.25, 1], duration: 0.6 }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className='px-18'
          >
            <input
              type='text'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className='flex items-center justify-center gap-2 min-w-[190px] w-full bg-white h-[55px] rounded-full shadow-lg mt-6 mb-2
              text-center text-12-medium text-title focus:outline-none placeholder:text-13-regular placeholder:text-subtitle truncate'
              placeholder='원하는 체험을 검색해 보세요'
            />
          </form>
          <button
            className='w-[40px] h-[40px] rounded-full bg-white shadow-lg flex items-center justify-center absolute top-[31.5px] right-4 z-50'
            onClick={() => setIsSearching(false)}
          >
            <X width={16} height={16} />
          </button>

          <div className='grid grid-rows-[minmax(56px,min-content)_minmax(56px,min-content)] gap-3 p-5 w-full'>
            {/* PLACE SECTION */}
            <motion.div
              className='rounded-xl bg-white shadow-lg p-4 overflow-visible'
              layout
              onClick={(e) => {
                e.stopPropagation();
                setOpenedSection(openedSection === 'place' ? '' : 'place');
              }}
            >
              <div className='flex items-center justify-between'>
                <span className='text-title text-14-medium'>지역</span>
                {openedSection !== 'place' && (
                  <span className='text-subtitle text-12-regular'>여행지 검색</span>
                )}
              </div>

              <AnimatePresence initial={false}>
                {openedSection === 'place' && (
                  <motion.div
                    className='mt-3'
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    layout
                  >
                    <input
                      type='text'
                      value={placeInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPlaceInput(val);
                        setFilteredPlaces(
                          PLACES.filter((p) => p.name.toLowerCase().includes(val.toLowerCase())),
                        );
                      }}
                      placeholder='여행지를 입력하세요'
                      className='w-full border rounded-md px-3 py-2 text-sm focus:outline-none placeholder:text-12-regular placeholder:text-grayscale-500'
                    />
                    <ul className='mt-2 max-h-40 overflow-y-auto'>
                      {filteredPlaces.map((p) => (
                        <li
                          key={p.name}
                          className='flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer'
                          onClick={() => {
                            setPlace(p.name);
                            setPlaceInput(p.name);
                          }}
                        >
                          <Image src={p.src} alt={p.name} width={56} height={56} />
                          <div className='flex flex-col justify-center min-w-0'>
                            <span className='text-14-regular text-title truncate'>{p.name}</span>
                            <span className='block text-12-regular text-grayscale-500 truncate'>
                              {p.description}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* PRICE SECTION */}
            <motion.div
              className='rounded-xl bg-white shadow-lg p-4 overflow-visible'
              layout
              onClick={() => setOpenedSection(openedSection === 'price' ? '' : 'price')}
            >
              <div className='flex items-center justify-between'>
                <span className='text-title text-14-medium'>가격</span>
                {openedSection !== 'price' && (
                  <span className='text-subtitle text-12-regular'>
                    {price[0].toLocaleString()}원~{price[1].toLocaleString()}원
                  </span>
                )}
              </div>

              <AnimatePresence initial={false}>
                {openedSection === 'price' && (
                  <motion.div
                    className='mt-3'
                    onClick={(e) => e.stopPropagation()}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    layout
                  >
                    <PriceFilter priceRange={price} setPriceRange={setPrice} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          <div className='fixed bottom-0 left-0 flex items-center justify-between h-[60px] w-full px-6'>
            <button
              className='underline text-14-medium text-title'
              onClick={() => {
                setPlace('');
                setPlaceInput('');
                setPrice([0, 300_000]);
                setKeyword('');
                setFilteredPlaces(PLACES);
              }}
            >
              전체 삭제
            </button>
            <button
              className='w-[101px] h-[46px] bg-primary-500 text-14-regular text-white rounded-lg flex items-center justify-center gap-2 hover:bg-primary-300'
              onClick={() => handleSearch()}
            >
              <SearchIcon width={16} height={16} color='white' /> 검색
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
