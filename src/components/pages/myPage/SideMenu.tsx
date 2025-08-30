import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { FaUser, FaCommentDots, FaCog, FaCalendarAlt } from 'react-icons/fa';
import Image from 'next/image';
import RoundButton from '../myActivities/RoundButton';
import clsx from 'clsx';
import Link from 'next/link';

interface SideMenuProps {
  className?: string;
}

export default function SideMenu({ className }: SideMenuProps) {
  return (
    <Card
      className={clsx(
        'w-80 md:w-44 lg:w-72 sm:h-[450px] md:h-[342px] lg:h-[450px] px-4 py-6 md:px-3.5 md:py-2 lg:px-4 lg:py-6 shadow-lg',
        className,
      )}
    >
      <div className='flex flex-col gap-6 md:gap-3 lg:gap-6'>
        {/* 프로필 영역 */}
        <div className='relative flex justify-center mt-4 w-[120px] h-[120px] md:w-[70px] md:h-[70px] lg:w-[120px] lg:h-[120px] mx-auto'>
          <Image src='/images/icons/default_profile.svg' alt='Profile' width={120} height={120} />
          <RoundButton
            mode='edit'
            className='absolute bottom-[8px] right-[4px] md:bottom-[4px] md:right-[0px] lg:bottom-[8px] lg:right-[4px]'
          />
        </div>

        {/* 메뉴 리스트 */}
        <nav className='flex flex-col gap-2.5 md:gap-1 lg:gap-2.5'>
          <Button
            asChild
            variant='ghost'
            className='group hover:bg-primary-100 justify-start gap-2 py-6.5 px-10 text-grayscale-600 text-base'
          >
            <Link href='/mypage/user'>
              <FaUser className='h-4 w-4 group-hover:text-primary-500' />내 정보
            </Link>
          </Button>

          <Button
            asChild
            variant='ghost'
            className='group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base'
          >
            <Link href='/mypage/reservation-list'>
              <FaCommentDots className='h-4 w-4 group-hover:text-primary-500' />
              예약내역
            </Link>
          </Button>

          <Button
            asChild
            variant='ghost'
            className='group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base'
          >
            <Link href='/mypage/my-experience'>
              <FaCog className='h-4 w-4 group-hover:text-primary-500' /> 내 체험 관리
            </Link>
          </Button>

          <Button
            asChild
            variant='ghost'
            className='group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base'
          >
            <Link href='/mypage/reservation-status'>
              <FaCalendarAlt className='h-4 w-4 group-hover:text-primary-500' />
              예약 현황
            </Link>
          </Button>
        </nav>
      </div>
    </Card>
  );
}
