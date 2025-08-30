'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useUserStore } from '@/store/userStore';
import { Dropdown, Modal } from 'react-simplified-package';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Bell, Heart, CircleUser, LogOut } from 'lucide-react';

export default function LoginSection() {
  const { isDesktop } = useScreenSize();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

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
            <Image
              src={
                user.profileImageUrl ? user.profileImageUrl : '/images/icons/default_profile.svg'
              }
              alt='Profile'
              width={30}
              height={30}
            />
          </Dropdown.Trigger>
          <Dropdown.Menu
            className='w-36 bg-white rounded-xl shadow-lg py-2 border-b border-gray-200'
            style={{ width: '146px', borderRadius: '15px', borderBottom: '1px solid #e5e7eb' }}
          >
            <button
              onClick={() => router.push('/profile')}
              className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title hover:bg-gray-100 transition'
            >
              <CircleUser strokeWidth={1.5} width={20} height={20} /> 프로필
            </button>

            <button
              onClick={() => router.push('/wishlist')}
              className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title hover:bg-gray-100 transition'
            >
              <Heart strokeWidth={1.5} width={20} height={20} /> 위시리스트
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title hover:bg-gray-100 transition'
            >
              <Bell strokeWidth={1.5} width={20} height={20} /> 알림
            </button>

            <button
              onClick={() => {
                clearUser();
                localStorage.removeItem('accessToken');
              }}
              className='flex items-center justify-start gap-3 w-full text-start px-4 py-2 text-14-regular text-title hover:bg-gray-100 transition'
            >
              <LogOut strokeWidth={1.5} width={20} height={20} /> 로그아웃
            </button>
          </Dropdown.Menu>
        </Dropdown>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          알림 들어갈 예정
        </Modal>
      </>
    );
  }
  return (
    <>
      {isDesktop && (
        <Link
          href='/login'
          className='px-4 py-2 hover:border rounded-full hover:bg-grayscale-50 transition-soft text-14-regular text-title'
        >
          로그인 하기
        </Link>
      )}
      <Link href='/login' className='cursor-pointer'>
        <Image src='/images/icons/default_profile.svg' alt='Profile' width={30} height={30} />
      </Link>
    </>
  );
}
