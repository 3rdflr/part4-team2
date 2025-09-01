import { useUserStore } from '@/store/userStore';
import { errorToast, successToast } from './toastUtils';

export async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    useUserStore.getState().clearUser();
    successToast.run('로그아웃 되었습니다');
  } catch (error) {
    errorToast.run('로그아웃 실패하였습니다. 잠시후 시도해주세요');

    console.error('로그아웃 실패:', error);
  }
}
