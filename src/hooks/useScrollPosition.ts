import { useEffect, RefObject } from 'react';

/**
 * 스크롤 위치를 sessionStorage에 저장하고 복원하는 훅
 *
 * @param scrollKey - 스크롤 위치를 식별하는 키
 * @param enabled - 스크롤 위치 저장 활성화 여부 (기본값: true)
 * @param scrollElement - 스크롤 대상 요소 (기본값: window)
 */
export function useScrollPosition(
  scrollKey: string,
  enabled: boolean = true,
  scrollElement?: RefObject<HTMLElement>,
) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    let ticking = false;

    // 스크롤 대상 결정
    const targetElement = scrollElement?.current || window;
    const isWindow = targetElement === window;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scrollTop = isWindow ? window.scrollY : (targetElement as HTMLElement).scrollTop;
          sessionStorage.setItem(key, String(scrollTop));
          ticking = false;
        });
      }
    };

    // 이벤트 리스너 등록
    if (isWindow) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      (targetElement as HTMLElement).addEventListener('scroll', handleScroll, { passive: true });
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (isWindow) {
        window.removeEventListener('scroll', handleScroll);
      } else {
        (targetElement as HTMLElement)?.removeEventListener('scroll', handleScroll);
      }
      // 마지막 위치 저장
      const scrollTop = isWindow ? window.scrollY : (targetElement as HTMLElement)?.scrollTop || 0;
      // 0이 아닌 경우에만 저장 (요소가 이미 제거된 경우 방지)
      if (scrollTop > 0 || isWindow) {
        sessionStorage.setItem(key, String(scrollTop));
      }
    };
  }, [scrollKey, enabled, scrollElement]);

  /**
   * 저장된 스크롤 위치로 복원
   */
  const restoreScrollPosition = () => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    const savedScrollTop = sessionStorage.getItem(key);
    const targetElement = scrollElement?.current || window;
    const isWindow = targetElement === window;

    if (savedScrollTop && savedScrollTop !== '0') {
      const scrollTop = parseInt(savedScrollTop, 10);
      if (scrollTop > 0) {
        const startTime = Date.now();
        const maxWaitTime = 5000; // 5초 최대 대기

        const attemptRestore = () => {
          // DOM 준비 상태 확인
          let isDOMReady = false;

          if (isWindow) {
            isDOMReady = document.body.scrollHeight > window.innerHeight;
          } else {
            const element = targetElement as HTMLElement;
            isDOMReady = element.scrollHeight > element.clientHeight && element.scrollHeight > 50;
          }

          if (isDOMReady) {
            // DOM이 준비됨 - 스크롤 복원 실행
            if (isWindow) {
              window.scrollTo({ top: scrollTop, behavior: 'instant' });
            } else {
              (targetElement as HTMLElement).scrollTop = scrollTop;
            }
            console.log(`✅ [SCROLL] 복원 완료: ${scrollTop}px`);
          } else if (Date.now() - startTime < maxWaitTime) {
            // 아직 준비되지 않음 - 다음 프레임에서 재시도
            requestAnimationFrame(attemptRestore);
          } else {
            // 시간 초과
            console.warn(`⚠️ [SCROLL] 복원 시간 초과 (${maxWaitTime}ms)`);
          }
        };

        attemptRestore();
      }
    }
  };

  /**
   * 저장된 스크롤 위치 삭제
   */
  const clearScrollPosition = () => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    sessionStorage.removeItem(key);
  };

  return {
    restoreScrollPosition,
    clearScrollPosition,
  };
}
