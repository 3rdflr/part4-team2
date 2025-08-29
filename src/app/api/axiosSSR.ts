import { headers } from 'next/headers';
import axios, { AxiosError } from 'axios';

interface RequestOptions<T = unknown> {
  method?: string;
  body?: T;
}

// 기본 URL 설정
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sp-globalnomad-api.vercel.app/16-2';

/**
 * 서버 컴포넌트에서 API를 호출하는 비동기 함수.
 * 클라이언트의 쿠키를 서버에서 직접 가져와 백엔드에 전달.
 * @param path - 호출할 API의 경로 (예: 'users/me', 'posts/1')
 * @param options - 요청 옵션. HTTP 메서드(GET, POST 등)와 요청 본문을 포함할 수 있습니다.
 */
export async function axiosSSR<T = unknown>(path: string, options?: RequestOptions<T>) {
  // 서버 컴포넌트에서 클라이언트의 요청 헤더를 가져옴
  const headersList = headers();
  const cookie = headersList.get('cookie');

  try {
    const response = await axios({
      method: options?.method || 'GET',
      url: `${BASE_URL}/${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      data: options?.body,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('서버에서 API 호출 실패:', axiosError.message);
    throw new Error(
      axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : '알 수 없는 오류가 발생했습니다.',
    );
  }
}

export default axiosSSR;
