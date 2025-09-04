import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pretendard } from '@/lib/fonts';
import { OverlayProvider } from '@/components/common/OverlayProvider';
import ToastProvider from '@/components/common/ToastProvider';
import QueryProvider from '@/providers/QueryProvider';
import BottomNav from '@/components/home/BottomNav';
import Nav from '@/components/common/Nav';
import './globals.css';
import Footer from '@/components/common/Footer';

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
      <body suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <QueryProvider>
            <ToastProvider />
            <OverlayProvider>
              <Nav />
              {children}
              <Footer />
              <BottomNav />
            </OverlayProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
