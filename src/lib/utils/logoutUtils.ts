import { useUserStore } from '@/store/userStore';
import { errorToast, successToast } from './toastUtils';

export async function logout() {
  const { user } = useUserStore.getState();
  if (!user) return;

  try {
    const res = await fetch('/api/logout', { method: 'POST' });

    if (!res.ok) {
      throw new Error(`서버 로그아웃 실패 (status: ${res.status})`);
    }

    const data = await res.json();
    if (data.message === 'Already logged out') {
      successToast.run('이미 로그아웃 상태 입니다.');
    } else {
      successToast.run('로그아웃 되었습니다.');
    }

    useUserStore.getState().clearUser();
  } catch (error) {
    errorToast.run('로그아웃 실패하였습니다. 잠시후 시도해주세요');

    console.error('로그아웃 실패:', error);
  }
}
