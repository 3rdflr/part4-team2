'use client';
import SideMenu from '@/components/pages/myPage/SideMenu';
import { useScreenSize } from '@/hooks/useScreenSize';
import { ReactNode } from 'react';

interface MyPageCommonLayoutProps {
  children: ReactNode;
}

const MyPageCommonLayout = ({ children }: MyPageCommonLayoutProps) => {
  const { isMobile } = useScreenSize();
  return (
    <div className='flex max-w-[327px] md:max-w-[684px] lg:max-w-[980px] mx-auto py-7.5 gap-7.5 lg:gap-12.5'>
      {!isMobile && <SideMenu />}
      {children}
    </div>
  );
};

export default MyPageCommonLayout;
