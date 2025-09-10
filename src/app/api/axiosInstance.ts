import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '@/store/userStore';
import { errorToast } from '@/lib/utils/toastUtils';
import { BASE_URL } from './config';

// 실패한 요청들을 큐에 저장할 때 사용하는 타입 정의
interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error?: AxiosError | unknown) => void;
}

let isRefreshing = false; // 현재 토큰 갱신 중인지 확인 & 동시에 여러 요청 중복 갱신 방지
let failedQueue: FailedRequest[] = []; // 토큰 갱신 중일 때 대기해야 하는 API 요청을 저장하는 큐

/**
 * 큐에 쌓인 요청들을 처리합니다.
 * 토큰 갱신 성공 시 → 모든 대기 요청을 다시 실행
 * 토큰 갱신 실패 시 → 모든 대기 요청을 에러로 처리
 */
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  failedQueue = [];
};

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 응답 인터셉터 등록
axiosInstance.interceptors.response.use(
  (response) => response,

  // 에러 응답 처리 함수
  async (error: AxiosError) => {
    if (!error.config) {
      console.error('Axios error without config:', error);
      return Promise.reject(error);
    }

    // _retry: 이미 재시도했는지 확인하는 플래그 (무한 루프 방지)
    const originalRequest: InternalAxiosRequestConfig & { _retry?: boolean } = error.config;

    // HTTP 401 에러이고, 아직 재시도하지 않은 요청인 경우에만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // 재시도 플래그 설정 (같은 요청 재시도x)

      // 🔍 로그인하지 않은 사용자의 무한 루프 방지
      // 사용자가 로그인하지 않은 상태라면 refresh 토큰도 없으므로
      // 갱신 시도 없이 바로 로그인 필요 에러 반환
      const user = useUserStore.getState().user;
      if (!user) {
        return Promise.reject({
          message: '로그인이 필요합니다.',
          status: 401,
          code: 'LOGIN_REQUIRED',
          name: 'AuthError',
        });
      }

      // 🔄 동시성 처리: 이미 다른 요청이 토큰 갱신 중이라면
      // 현재 요청을 큐에 추가하고 갱신 완료를 기다림
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
        // 🚨 인터셉터가 없는 별도의 axios 인스턴스 생성
        // 현재 인스턴스를 사용하면 refresh-token 요청도 인터셉터를 거쳐서
        // 401이 발생하면 또 다시 이 코드가 실행되는 순환 참조 발생
        const plainAxios = axios.create({
          baseURL: BASE_URL,
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });

        // 서버에 refresh-token 요청
        // refreshToken은 HttpOnly 쿠키에 저장되어 있어서
        // 클라이언트에서 직접 읽을 수 없고, 브라우저가 자동으로 전송
        await plainAxios.post('/auth/refresh-token');

        // 🎉 토큰 갱신 성공 : 큐에 대기 중인 모든 요청들을 성공 처리
        processQueue(null);

        // 원본 요청을 새로운 토큰으로 다시 실행
        return axiosInstance(originalRequest);
      } catch (error) {
        // 토큰 갱신 실패 (refresh token도 만료되었거나 유효하지 않음)
        const refreshError = error as AxiosError;

        // 큐에 대기 중인 모든 요청들을 에러로 처리
        processQueue(refreshError);

        // 🧹 로그아웃 처리
        // 서버에서 쿠키 삭제 요청, 상태 관리 유저 정보 삭제
        fetch('/api/logout', { method: 'POST' }).catch(() => {});
        useUserStore.getState().clearUser();

        errorToast.run('로그인 세션이 만료되었습니다.');

        // 4. 로그인 페이지로 리다이렉트 (약간의 지연 후)
        setTimeout(() => {
          const currentPath = window.location.pathname;

          // 메인 페이지에 있을 때 이동X
          if (currentPath !== '/') {
            window.location.href = '/login';
          }
        }, 800);

        // 에러 객체 반환
        return Promise.reject({
          message: '로그인 세션이 만료되었습니다.',
          status: 401,
          code: 'SESSION_EXPIRED',
          name: 'SessionExpiredError',
          originalError: refreshError,
        });
      } finally {
        // 토큰 갱신 프로세스 종료
        isRefreshing = false;
      }
    }
    // 401이 아니거나 이미 재시도한 요청은 그대로 에러 반환
    return Promise.reject(error);
  },
);

export default axiosInstance;
