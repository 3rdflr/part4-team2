import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useLayoutEffect } from 'react';

/**
 *
 * 로그인 상태라면 접근이 제한된 페이지에서 홈으로 리다이렉트
 * @param redirectTo 로그인 상태 시 이동할 경로 (기본: '/')
 *
 */
export const useAuthRedirect = (redirectTo = '/') => {
  const router = useRouter();
  const { user } = useUserStore();

  useLayoutEffect(() => {
    if (user) {
      router.replace(redirectTo);
    }
  }, [user, router, redirectTo]);
};
