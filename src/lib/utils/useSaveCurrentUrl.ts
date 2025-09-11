import { usePathname, useSearchParams } from 'next/navigation';

// 현재 URL sessionStorage에 저장
export const useSaveCurrentUrl = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const saveCurrentUrlAndGoLogin = () => {
    const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    sessionStorage.setItem('redirectUrl', currentUrl);
  };

  return saveCurrentUrlAndGoLogin;
};
