import type { Metadata } from 'next';
import ToastProvider from '@/components/common/ToastProvider';
import { pretendard } from '@/lib/fonts';
import './globals.css';
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
      <ToastProvider />
      <body>
        <OverlayProvider>{children}</OverlayProvider>
      </body>
    </html>
  );
}
