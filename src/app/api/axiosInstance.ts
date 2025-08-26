import axios, { AxiosError } from 'axios';

// 기본 URL 설정
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sp-globalnomad-api.vercel.app/16-2';

interface FailedRequest {
  resolve: (value?: string) => void;
  reject: (error?: AxiosError | unknown) => void;
}

let isRefreshing = false; // 재발급 진행 중 여부
let failedQueue: FailedRequest[] = []; // 재발급 완료까지 대기하는 요청 큐

/**
 * 큐에 쌓인 요청들을 처리합니다.
 * @param error - 에러가 발생한 경우, 에러 객체를 전달합니다.
 * @param token - 재발급된 새로운 토큰
 */
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token ?? undefined);
    }
  });
  failedQueue = [];
};

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true,
});

// 요청 인터셉터 : Access Token 헤더 자동 첨부
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 요청 인터셉터 : 401 에러 처리 및 토큰 재발급
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // HTTP 상태 코드가 401이고, 재시도 플래그가 없는 경우
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string | null = null) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post('/auth/tokens', {});
        const newAccessToken = data.accessToken;

        localStorage.setItem('accessToken', newAccessToken); // 새로운 Access Token 저장
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`; // Axios 인스턴스의 기본 헤더를 업데이트

        processQueue(null, newAccessToken); // 큐에 있던 요청들을 새로운 토큰으로 재처리
        return axiosInstance(originalRequest); // 실패했던 원래 요청을 다시 시도
      } catch (error) {
        const refreshError = error as AxiosError;
        processQueue(refreshError, null); // 큐에 있는 모든 요청을 실패 처리

        if (refreshError.response?.status === 401) {
          console.error('세션이 만료되었습니다. 다시 로그인해주세요.');
        } else if (refreshError.response?.status === 500) {
          console.error('서버 에러가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } else {
          console.error('알 수 없는 오류가 발생했습니다.');
        }

        // Refresh Token 만료 시 accessToken 삭제
        localStorage.removeItem('accessToken');

        //  페이지이동(추가예정...)
        // const router = useRouter();
        // router.push('/');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
