import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/store/userStore';
import { errorToast } from '@/lib/utils/toastUtils';
import { BASE_URL } from './config';

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: AxiosError | unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = []; // API 대기하는 요청 큐

/**
 * 큐에 쌓인 요청들을 처리합니다.
 * @param error - 에러가 발생한 경우, 에러 객체를 전달합니다.
 */
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터: 401 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 에러 발생 시 config 객체가 없을 때
    if (!error.config) return Promise.reject(error);

    // 타입 에러를 해결하기 위해 `InternalAxiosRequestConfig` 타입 사용
    const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

    // HTTP 상태 코드가 401이고, 재시도 플래그가 없는 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 로그인하지 않은 경우 refresh 토큰 갱신 시도하지 않음
      const user = useUserStore.getState().user;
      if (!user) {
        return Promise.reject(error);
      }

      // 클라이언트일 때만 큐 처리
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }
      isRefreshing = true;

      try {
        // 인터셉터 없는 인스턴스로 refresh-token 호출
        const plainAxios = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        // refreshToken은 HttpOnly라서 클라이언트에서 못 읽음
        // 프록시 서버에서 처리하도록 요청
        await plainAxios.post('/auth/refresh-token');

        processQueue(null);

        // 큐 대기 처리
        return axiosInstance(originalRequest);
      } catch (error) {
        const refreshError = error as AxiosError;
        processQueue(refreshError);

        // 쿠키 삭제 + 유저 정보 삭제
        fetch('/api/logout', { method: 'POST' }).catch(() => {});

        useUserStore.getState().clearUser();

        errorToast.run('로그인 세션이 만료되었습니다.');

        setTimeout(() => {
          const currentPath = window.location.pathname;

          // 메인 페이지에 있을 때 이동X
          if (currentPath !== '/') {
            window.location.href = '/login';
          }
        }, 800);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
