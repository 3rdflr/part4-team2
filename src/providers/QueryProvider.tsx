'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR에서는 즉시 재페칭을 피하기 위해 staleTime을 0보다 크게 설정
        staleTime: 60 * 1000, // 1분
        // 서버에서는 gcTime을 Infinity로 설정하여 메모리 관리 최적화
        gcTime: typeof window === 'undefined' ? Infinity : 1000 * 60 * 5, // 5분 (클라이언트)
        retry: (failureCount, error) => {
          // HTTP 상태 코드 확인을 위한 타입 가드
          const hasStatusCode = (err: unknown): err is { response: { status: number } } => {
            return (
              typeof err === 'object' &&
              err !== null &&
              'response' in err &&
              typeof (err as { response?: unknown }).response === 'object' &&
              (err as { response?: unknown }).response !== null &&
              'status' in (err as { response: { status?: unknown } }).response &&
              typeof (err as { response: { status?: unknown } }).response.status === 'number'
            );
          };

          // 4xx 에러는 재시도하지 않음 (클라이언트 에러)
          if (hasStatusCode(error) && error.response.status >= 400 && error.response.status < 500) {
            return false;
          }

          // 최대 2번까지 재시도
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // 서버: 항상 새로운 쿼리 클라이언트 생성
    return makeQueryClient();
  } else {
    // 브라우저: 쿼리 클라이언트가 없으면 생성하고 재사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // getQueryClient 사용하여 서버와 클라이언트 각각 최적화
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
