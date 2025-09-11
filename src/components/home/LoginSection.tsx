'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dropdown, Modal, useDropdownContext } from 'react-simplified-package';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useUserStore } from '@/store/userStore';
import { logout } from '@/lib/utils/logoutUtils';
import { Bell, Heart, CircleUser, LogOut } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotification';
import Link from 'next/link';
import Image from 'next/image';
import NotificationModal from './NotificationModal';
import { useSaveCurrentUrl } from '@/lib/utils/useSaveCurrentUrl';

export default function LoginSection() {
  const { isDesktop } = useScreenSize();
  const { data: notificationData } = useNotifications();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = useUserStore((state) => state.user);

  const saveCurrentUrl = useSaveCurrentUrl();

  if (user) {
    return (
      <>
        {isDesktop && (
          <Link
            href='/my-activities/activity'
            className='px-4 py-2 hover:border rounded-full hover:bg-grayscale-50 transition-soft text-14-regular text-title'
          >
            호스팅 하기
          </Link>
        )}
        <Dropdown>
          <Dropdown.Trigger>
            <div className='w-[30px] h-[30px] rounded-full cursor-pointer overflow-hidden'>
              <Image
                src={
                  user.profileImageUrl ? user.profileImageUrl : '/images/icons/default_profile.svg'
                }
                alt='Profile'
                width={30}
                height={30}
                className='object-cover w-full h-full'
              />
            </div>
          </Dropdown.Trigger>
          <Dropdown.Menu className='w-36 bg-white rounded-xl shadow-lg py-2 border-b border-gray-200 z-[999]'>
            <DropdownMenuButtons setIsModalOpen={setIsModalOpen} />
          </Dropdown.Menu>
        </Dropdown>
        {notificationData?.totalCount && notificationData?.totalCount > 0 ? (
          <span className='relative bottom-3 right-4 block w-2 h-2 bg-primary-500 rounded-full animate-ping'></span>
        ) : null}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NotificationModal />
        </Modal>
      </>
    );
  }
  return (
    <>
      {isDesktop && (
        <Link
          onClick={saveCurrentUrl}
          href='/login'
          className='px-4 py-2 hover:border rounded-full hover:bg-grayscale-50 transition-soft text-14-regular text-title'
        >
          로그인 하기
        </Link>
      )}
      <Link onClick={saveCurrentUrl} href='/login' className='cursor-pointer'>
        <Image src='/images/icons/default_profile_gray.svg' alt='Profile' width={30} height={30} />
      </Link>
    </>
  );
}

const DropdownMenuButtons: React.FC<{ setIsModalOpen: (v: boolean) => void }> = ({
  setIsModalOpen,
}) => {
  const router = useRouter();

  const { close } = useDropdownContext();

  const { data: notificationData } = useNotifications();

  return (
    <>
      <button
        onClick={() => router.push('/mypage/user')}
        className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title cursor-pointer z-[200] hover:bg-gray-100 transition'
      >
        <CircleUser strokeWidth={1.5} width={20} height={20} /> 프로필
      </button>

      <button
        onClick={() => {
          router.push('/mypage/wishlist');
          close();
        }}
        className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title cursor-pointer z-[200] hover:bg-gray-100 transition'
      >
        <Heart strokeWidth={1.5} width={20} height={20} /> 위시리스트
      </button>

      <button
        onClick={() => {
          setIsModalOpen(true);
          close();
        }}
        className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title cursor-pointer z-[200] hover:bg-gray-100 transition'
      >
        <Bell strokeWidth={1.5} width={20} height={20} /> 알림
        {notificationData?.totalCount && notificationData?.totalCount > 0 ? (
          <span className='ml-5 bg-primary-500 text-white text-[8px] font-bold rounded-full min-w-[18px] h-[18px] flex text-center items-center justify-center px-1'>
            {notificationData?.totalCount}
          </span>
        ) : null}
      </button>

      <button
        onClick={() => {
          logout();
          router.push('/');
          close();
        }}
        className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title cursor-pointer z-[200] hover:bg-gray-100 transition'
      >
        <LogOut strokeWidth={1.5} width={20} height={20} /> 로그아웃
      </button>
    </>
  );
};
