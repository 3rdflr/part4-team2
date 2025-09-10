'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Footer() {
  const searchParams = useSearchParams();

  if (searchParams.toString()) {
    return null;
  }
  return (
    <footer className='bg-grayscale-25 w-full h-120 flex flex-col items-center justify-start text-12-regular text-subtitle text-center pb-[118px]'>
      <div className='bg-white w-full h-20 rounded-b-full shadow-lg mb-30'></div>

      <Image
        src={'/images/icons/logo.svg'}
        alt='트리베라 로고'
        width={204}
        height={52}
        className='w-[204px] h-auto'
      />

      <p className='mt-5'>
        © 2025 Trivera
        <br />
        코드잇 스프린트
        <br />
        프론트엔드 부트캠프 16기 2팀
      </p>
      <Link href={'https://github.com/3rdflr/part4-team2'} className='mt-8 underline'>
        Github
      </Link>
    </footer>
  );
}
