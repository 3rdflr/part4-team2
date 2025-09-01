import axios, { AxiosError } from 'axios';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { parse } from 'cookie';

interface RequestOptions<T = unknown> {
  method?: string;
  body?: T;
}

interface CustomError extends Error {
  status?: number;
  data?: unknown;
}

// 기본 URL 설정
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sp-globalnomad-api.vercel.app/16-2';

/**
 * 서버 컴포넌트에서 API를 호출하는 비동기 함수.
 * 클라이언트의 쿠키를 서버에서 직접 가져와 백엔드에 전달.
 * @param path - 호출할 API의 경로 (예: 'users/me', 'posts/1')
 * @param options - 요청 옵션. HTTP 메서드(GET, POST 등)와 요청 본문을 포함할 수 있습니다.
 *
 * @example
 * // GET 요청 (기본값)
 * const user = await axiosSSR('users/me');
 *
 * @example
 * // POST 요청 - 게시글 작성
 * const newPost = await axiosSSR('posts', {
 *   method: 'POST',
 *   body: { title: '제목', content: '내용' }
 * });
 *
 * @example
 * // PUT 요청 - 사용자 정보 수정
 * const updatedUser = await axiosSSR('users/123', {
 *   method: 'PUT',
 *   body: { name: '새이름', email: 'new@email.com' }
 * });
 *
 * @example
 * // 에러 처리
 * try {
 *   const data = await axiosSSR('protected-route');
 * } catch (error) {
 *   console.error('API 호출 실패:', error.message);
 *   // error.status, error.data로 상세 정보 접근 가능
 * }
 *
 * @throws {CustomError} - API 호출 실패 시 status, data 속성을 포함한 에러
 */
export async function axiosSSR<T = unknown>(path: string, options?: RequestOptions<T>) {
  // 서버 컴포넌트에서 클라이언트의 요청 헤더를 가져옴
  const headersList = headers();
  const cookieHeader = headersList.get('cookie') || '';
  const cookies = parse(cookieHeader);
  const accessToken = cookies.accessToken || '';

  try {
    const response = await axios({
      method: options?.method || 'GET',
      url: `${BASE_URL}/${path}`,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      data: options?.body,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('서버에서 API 호출 실패:', axiosError.message);

    // SSR 환경에서 401 에러 발생 시 처리
    if (axiosError.response?.status === 401) {
      redirect('/login?message=세션이%20만료되었습니다.');
    }

    // 에러 객체 개선: 상태 코드와 응답 데이터 포함
    const errorData = axiosError.response?.data || { message: '알 수 없는 오류가 발생했습니다.' };
    const customError: CustomError = new Error(
      typeof errorData === 'object' &&
      errorData &&
      'message' in errorData &&
      typeof errorData.message === 'string'
        ? errorData.message
        : '알 수 없는 오류가 발생했습니다.',
    );

    // 에러 객체에 추가 정보 첨부
    customError.status = axiosError.response?.status;
    customError.data = errorData;

    throw customError;
  }
}

export default axiosSSR;
