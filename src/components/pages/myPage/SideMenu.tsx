import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { FaUser, FaCommentDots, FaCog, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileImageUploader from './ProfileImageUploader';

interface SideMenuProps {
  className?: string;
}

export default function SideMenu({ className }: SideMenuProps) {
  const pathname = usePathname();

  const menuItems = [
    { href: '/mypage/user', label: '내 정보', icon: FaUser },
    { href: '/mypage/reservation-list', label: '예약내역', icon: FaCommentDots },
    { href: '/mypage/my-experience', label: '내 체험 관리', icon: FaCog },
    { href: '/mypage/reservation-status', label: '예약 현황', icon: FaCalendarAlt },
    { href: '', label: '위시리스트', icon: FaHeart },
  ];

  const onLogout = () => {
    console.log('TODO: 로그아웃 처리');
  };

  return (
    <Card
      className={clsx(
        'w-80 md:w-44 lg:w-72 sm:h-auto md:h-[380px] lg:h-[500px] px-4 py-6 md:px-3.5 md:py-2 lg:px-4 lg:py-6 shadow-lg',
        className,
      )}
    >
      <div className='flex flex-col gap-6 md:gap-3 lg:gap-6'>
        {/* 프로필 영역 */}
        <ProfileImageUploader />

        {/* 메뉴 리스트 */}
        <nav className='flex flex-col gap-2.5 md:gap-0.5 lg:gap-2.5'>
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Button
                key={href}
                asChild
                variant='ghost'
                className={clsx(
                  'group justify-start gap-2 py-6.5 text-base',
                  isActive
                    ? 'bg-primary-100 text-primary-600 hover:bg-primary-100'
                    : 'text-grayscale-600 hover:bg-[#FFF9FB]',
                )}
              >
                <Link href={href}>
                  <Icon
                    className={clsx(
                      'h-4 w-4',
                      isActive ? 'text-primary-500' : 'group-hover:text-primary-500',
                    )}
                  />
                  {label}
                </Link>
              </Button>
            );
          })}
          <Button
            asChild
            variant='ghost'
            className='sm:hidden group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base'
            onClick={onLogout}
          >
            <Link href=''>
              <FaArrowRightFromBracket className='h-4 w-4 group-hover:text-primary-500' />
              로그아웃
            </Link>
          </Button>
        </nav>
      </div>
    </Card>
  );
}
