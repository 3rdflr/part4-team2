import Image from 'next/image';
import Link from 'next/link';

export default function Nav() {
  return (
    <div className='flex items-center justify-between px-12 py-4 bg-gradient-to-b from-white to-gray-50 border-b border-grayscale-100 h-[90px]'>
      <div>
        <Link href={'/'}>
          <Image src='/images/icons/logo.svg' alt='Logo' width={105} height={26} />
        </Link>
      </div>
      <div className='flex items-center justify-center gap-1'>
        <Link
          href={'/login'}
          className='hover:bg-grayscale-25 rounded-2xl px-3 py-2 text-title text-14-regular'
        >
          로그인 하기
        </Link>
        <Link href={'/login'}>
          <Image src='/images/icons/default_profile.svg' alt='Login Icon' width={30} height={30} />
        </Link>
      </div>
    </div>
  );
}
