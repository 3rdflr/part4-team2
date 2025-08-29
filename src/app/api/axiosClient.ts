import axios, { AxiosError, AxiosRequestConfig } from 'axios';
// import { useRouter } from 'next/navigation';

interface FailedRequest {
  resolve: (value?: string) => void;
  reject: (error?: AxiosError | unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = []; // API 대기하는 요청 큐

/**
 * 큐에 쌓인 요청들을 처리합니다.
 * @param error - 에러가 발생한 경우, 에러 객체를 전달합니다.
 */
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve));
  failedQueue = [];
};

// 기본 URL 설정
const BASE_URL = '/api/proxy';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// 요청 인터셉터: 401 에러 처리
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 에러 발생 시 config 객체가 없을 때
    if (!error.config) return Promise.reject(error);

    // 타입 에러를 해결하기 위해 `InternalAxiosRequestConfig` 타입 사용
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

    // HTTP 상태 코드가 401이고, 재시도 플래그가 없는 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 클라이언트일 때만 큐 처리
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(axiosClient(originalRequest)),
            reject,
          });
        });
      }
      isRefreshing = true;

      try {
        // 🔄 수정된 부분: refreshToken을 body에 포함
        const cookies = document.cookie.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        const refreshToken = cookies.refreshToken;

        // 새 AccessToken을 쿠키로 내려줌
        await axiosClient.post('/auth/tokens', {
          refreshToken: refreshToken, // refreshToken을 body에 포함
        });

        processQueue(null);

        // 큐 대기 처리
        return axiosClient(originalRequest);
      } catch (error) {
        const refreshError = error as AxiosError;

        processQueue(refreshError);

        // 쿠키 삭제 및 로그인 페이지로 리다이렉트
        document.cookie = 'accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'refreshToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        //  페이지이동(추가예정...)
        // const router = useRouter();
        // router.push('/login');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
