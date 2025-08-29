import type { Metadata } from 'next';
import Script from 'next/script';
import ToastProvider from '@/components/common/ToastProvider';

import QueryProvider from '@/providers/QueryProvider';

import { pretendard } from '@/lib/fonts';
import './globals.css';
import { Suspense } from 'react';
import Nav from '@/components/common/Nav';
import { OverlayProvider } from '@/components/common/OverlayProvider';

export const metadata: Metadata = {
  title: 'Trivera',
  description: '여행, 체험, 그리고 더 많은 것을 위한 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <Script
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
        strategy='beforeInteractive'
      />

      <body suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <QueryProvider>
            <ToastProvider />
            <OverlayProvider>
              <Nav />
              {children}
              <div className='fixed bottom-0 left-0 right-0 flex items-center justify-between px-12 py-4 bg-black w-full  h-[82px] zindex-50 text-white'>
                bottom nav for mobile test
              </div>
            </OverlayProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
