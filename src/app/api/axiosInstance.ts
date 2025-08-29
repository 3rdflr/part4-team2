import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { GetServerSidePropsContext } from 'next';

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
 */
const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

/**
 * axiosInstance 생성
 * @param context SSR인 경우 { req }를 전달
 */
export function createAxiosInstance(context?: Pick<GetServerSidePropsContext, 'req'>) {
  const isClient = typeof window != 'undefined';

  const instance = axios.create({
    baseURL: isClient ? '/api/proxy' : BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      ...(context?.req?.headers?.cookie ? { Cookie: context.req.headers.cookie } : {}),
    },
    withCredentials: isClient,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  // 요청 인터셉터 : 401 에러 처리
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

      // HTTP 상태 코드가 401이고, 재시도 플래그가 없는 경우
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        // 클라이언트일 때만 큐 처리
        if (isClient && isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: () => resolve(instance(originalRequest)),
              reject,
            });
          });
        }

        if (isClient) isRefreshing = true;

        try {
          // refresh API 요청 (클라이언트: 프록시, SSR: API 직통)
          const refreshUrl = isClient ? '/api/proxy/auth/tokens' : `${BASE_URL}/auth/tokens`;

          // 새 AccessToken을 쿠키로 내려줌
          await axios.post(
            refreshUrl,
            {},
            {
              withCredentials: isClient,
              headers:
                !isClient && context?.req?.headers.cookie
                  ? { Cookie: context.req.headers.cookie }
                  : undefined,
            },
          );

          if (isClient) processQueue(null);

          // 큐 대기 처리
          return instance(originalRequest);
        } catch (error) {
          const refreshError = error as AxiosError;

          if (isClient) processQueue(refreshError);

          //  페이지이동(추가예정...)
          // const router = useRouter();
          // router.push('/');

          // 로컬 스토리지,, 사용자 관련 데이터(e.g., 사용자 정보)를 모두 삭제하는 로그아웃 처리 로직을 추가

          return Promise.reject(refreshError);
        } finally {
          if (isClient) isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

const axiosInstance = createAxiosInstance();
export default axiosInstance;
