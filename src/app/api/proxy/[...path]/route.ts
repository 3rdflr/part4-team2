import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';

// 모든 HTTP 메서드에 대한 핸들러를 생성하는 함수
function makeHandler(method: string) {
  return async (req: Request, { params }: { params: { path: string[] } }) => {
    return handleRequest(method, req, params.path);
  };
}

export const GET = makeHandler('GET');
export const POST = makeHandler('POST');
export const PUT = makeHandler('PUT');
export const DELETE = makeHandler('DELETE');
export const PATCH = makeHandler('PATCH');

// 클라이언트 요청을 처리하는 비동기 함수
async function handleRequest(method: string, req: Request, path: string[]) {
  try {
    // 1. 클라이언트 요청의 모든 헤더를 복사하여 백엔드로 전달
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // 2. GET 요청이 아닐 경우 요청 본문을 파싱
    const body = method !== 'GET' ? await req.text() : undefined;

    const backendUrl = new URL(`https://sp-globalnomad-api.vercel.app/16-2/${path.join('/')}`);

    // 3. Axios 요청 생성
    const response = await axios({
      method,
      url: backendUrl.toString(),
      headers: Object.fromEntries(headers.entries()),
      data: body,
      validateStatus: () => true,
    });

    // 4. 백엔드 응답을 클라이언트에 전달
    const resHeaders = new Headers({ 'Content-Type': 'application/json' });

    // 5. 백엔드에서 온 Set-Cookie 헤더를 Next.js 응답 헤더에 직접 복사
    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach((cookie) => resHeaders.append('Set-Cookie', cookie));
      } else {
        resHeaders.append('Set-Cookie', setCookieHeader);
      }
    }

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || { error: 'Unknown server error' };

    return new NextResponse(JSON.stringify(data), { status });
  }
}
