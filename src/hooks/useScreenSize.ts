import { useLayoutEffect, useState } from 'react';

export function useScreenSize() {
  const [width, setWidth] = useState(1024); // 초기값을 데스크탑으로 설정

  useLayoutEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
  };
}
