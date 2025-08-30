'use client';
import SideMenu from '@/components/pages/myPage/SideMenu';
import { ReactNode } from 'react';

interface MyPageCommonLayoutProps {
  children: ReactNode;
}

const MyPageCommonLayout = ({ children }: MyPageCommonLayoutProps) => {
  return (
    <div className='flex justify-center max-w-[327px] md:max-w-[684px] lg:max-w-[980px] mx-auto py-7.5 gap-7.5 lg:gap-12.5'>
      <SideMenu className='hidden md:block' />
      <div className='flex-1'>{children}</div>
    </div>
  );
};

export default MyPageCommonLayout;
