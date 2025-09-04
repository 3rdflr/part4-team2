'use client';

import { useState, useEffect } from 'react';
import { Modal } from 'react-simplified-package';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Bell, Search, Heart } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useNotifications } from '@/hooks/useNotification';
import Link from 'next/link';
import Image from 'next/image';
import NotificationModal from './NotificationModal';

export default function BottomNav() {
  const { isMobile } = useScreenSize();
  const { data: notificationData } = useNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visible, setVisible] = useState(true);

  const user = useUserStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    let sheetContent: HTMLElement | null = null;
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = sheetContent?.scrollTop ?? window.scrollY;

      if (scrollTop > lastScrollTop && scrollTop > 20) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    const attachScrollEvent = () => {
      sheetContent = document.querySelector<HTMLElement>('.activity-sheet-content');
      if (sheetContent) {
        sheetContent.removeEventListener('scroll', handleScroll);
        sheetContent.addEventListener('scroll', handleScroll);
      }
    };

    // 초기 이벤트
    window.addEventListener('scroll', handleScroll);
    attachScrollEvent();

    // DOM이 생기면 이벤트 연결
    const observer = new MutationObserver(() => {
      attachScrollEvent();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sheetContent?.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <>
      <motion.nav
        className='fixed bottom-0 left-0 right-0 flex items-center justify-center w-full h-[82px] z-[120] bg-gradient-to-b from-white to-gray-50 border-b border-grayscalescale-20 border-t shadow-md'
        animate={{ y: visible ? 0 : 82 }} // translate-y 대신 y로
        transition={{ type: 'spring', stiffness: 300, damping: 30 }} // 스프링 효과
      >
        {user ? (
          <div className='flex justify-between items-center w-full max-w-[500px] gap-8 text-12-regular px-14'>
            <Link
              className={`${
                pathname === '/' ? 'text-primary-300' : 'text-grayscale-500 '
              } flex flex-col items-center justify-center gap-1`}
              href='/'
            >
              <Search strokeWidth={1} width={20} height={20} />
              <span>검색</span>
            </Link>
            <Link
              className={`${
                pathname === '/mypage/wishlist' ? 'text-primary-300' : 'text-grayscale-500'
              } flex flex-col items-center justify-center gap-1`}
              href='/mypage/wishlist'
            >
              <Heart strokeWidth={1} width={20} height={20} />
              <span>위시리스트</span>
            </Link>
            <button
              className='text-grayscale-500 dark:text-grayscale-400 flex flex-col items-center justify-center gap-1'
              onClick={() => setIsModalOpen(true)}
            >
              <Bell strokeWidth={1} width={20} height={20} />
              <span>알림</span>
              {notificationData?.totalCount && notificationData?.totalCount > 0 ? (
                <span className='absolute top-4.5 right-34.5 block w-1 h-1 bg-primary-500 rounded-full animate-ping'></span>
              ) : null}
            </button>

            <Link
              className={`${
                pathname.startsWith('/mypage') && pathname !== '/mypage/wishlist'
                  ? 'text-primary-300'
                  : 'text-grayscale-500 dark:text-grayscale-400'
              } flex flex-col items-center justify-center gap-1`}
              href='/mypage'
            >
              <Image
                src={
                  user.profileImageUrl ? user.profileImageUrl : '/images/icons/default_profile.svg'
                }
                alt='Profile'
                width={20}
                height={20}
              />
              <span>프로필</span>
            </Link>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <NotificationModal />
            </Modal>
          </div>
        ) : (
          <div className='flex justify-between items-center w-full px-20 text-12-regular'>
            <Link
              className={`${
                pathname === '/' ? 'text-primary-300' : 'text-grayscale-500'
              } flex flex-col items-center justify-center gap-1`}
              href='/'
            >
              <Search strokeWidth={1} width={20} height={20} />
              <span>검색</span>
            </Link>
            <Link
              className={`${
                pathname.startsWith('/login') ? 'text-primary-300' : 'text-grayscale-500'
              } flex flex-col items-center justify-center gap-1 cursor-pointer`}
              href='/login'
            >
              <Image
                src={'/images/icons/default_profile_gray.svg'}
                alt='Profile'
                width={20}
                height={20}
              />
              <span>로그인</span>
            </Link>
          </div>
        )}
      </motion.nav>
    </>
  );
}
