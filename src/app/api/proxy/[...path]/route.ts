import axios, { AxiosError } from 'axios';
import { NextResponse } from 'next/server';
import { parse } from 'cookie';

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

// CORS Origin
function getAllowedOrigin() {
  return process.env.NODE_ENV === 'production'
    ? 'https://part4-team2.vercel.app'
    : process.env.FRONTEND_URL || 'http://localhost:3000';
}

// CORS 요청처리
export async function OPTIONS() {
  const headers = new Headers();

  headers.set('Access-Control-Allow-Origin', getAllowedOrigin());
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return new NextResponse(null, { status: 204, headers });
}

// 백엔드 서버
const BACKEND_URL = process.env.SERVER_API_URL || 'https://sp-globalnomad-api.vercel.app/16-2';

// 클라이언트 요청을 처리하는 비동기 함수
async function handleRequest(method: string, req: Request, path: string[]) {
  try {
    const pathString = path.join('/');

    // 🔹 토큰 갱신 전용 엔드포인트 처리
    if (pathString === 'auth/refresh-token') {
      return handleTokenRefresh(req);
    }

    console.log(`\n===== NEW REQUEST =====`);
    console.log(`Method: ${method}`);
    console.log(`Path: ${pathString}`);
    console.log(`Cookies: ${req.headers.get('cookie')}`);

    // 쿠키 파싱
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const accessToken = cookies.accessToken || '';

    // 1. 클라이언트 요청의 모든 헤더를 복사하여 백엔드로 전달
    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (!['host', 'connection'].includes(key.toLowerCase())) {
        headers.set(key, value);
      }
    });

    // accessToken이 있으면 Authorization 헤더로 추가
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    // 2. GET 요청이 아닐 경우 요청 본문을 파싱
    const body = method !== 'GET' ? await req.text() : undefined;

    console.log('요청 헤더:', Object.fromEntries(headers.entries()));
    console.log('요청 body:', body);

    const url = new URL(req.url);
    const backendUrl = new URL(`${BACKEND_URL}/${pathString}`);

    // 3. Axios 요청 생성
    const response = await axios({
      method,
      url: backendUrl.toString(),
      headers: Object.fromEntries(headers.entries()),
      params: Object.fromEntries(url.searchParams.entries()),
      data: body,
      validateStatus: () => true,
      withCredentials: true,
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
    } else {
      // 백엔드가 쿠키를 설정하지 않으면 응답 데이터에서 토큰을 찾아서 직접 쿠키로 설정
      if (response.data?.accessToken || response.data?.token) {
        const token = response.data.accessToken || response.data.token;
        const cookieValue = `accessToken=${token}; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        resHeaders.append('Set-Cookie', cookieValue);
      }

      // refreshToken만 HttpOnly로 설정
      if (response.data?.refreshToken) {
        const refreshToken = response.data.refreshToken;
        const refreshCookieValue = `refreshToken=${refreshToken}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
        resHeaders.append('Set-Cookie', refreshCookieValue);
      }
    }

    // CORS 헤더
    resHeaders.set('Access-Control-Allow-Origin', getAllowedOrigin());
    resHeaders.set('Access-Control-Allow-Credentials', 'true');

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    const data = axiosError.response?.data || { error: 'Unknown server error' };

    return new NextResponse(JSON.stringify(data), { status });
  }
}

// 토큰 갱신 전용 처리 함수
async function handleTokenRefresh(req: Request) {
  try {
    // refreshToken 추출 (서버에서만 HttpOnly 쿠키 읽을 수 있음)
    const cookieHeader = req.headers.get('cookie') || '';
    const cookies = parse(cookieHeader);
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return new NextResponse(JSON.stringify({ error: 'No refresh token' }), { status: 401 });
    }

    // 백엔드에 토큰 갱신 요청
    const response = await axios.post(
      `${BACKEND_URL}/auth/tokens`,
      { refreshToken },
      { validateStatus: () => true },
    );

    if (response.status !== 200) {
      return new NextResponse(JSON.stringify(response.data), { status: response.status });
    }

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // 새 토큰들을 쿠키로 설정해서 반환
    const resHeaders = new Headers({ 'Content-Type': 'application/json' });

    const accessCookie = `accessToken=${accessToken}; Path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    resHeaders.append('Set-Cookie', accessCookie);

    const refreshCookie = `refreshToken=${newRefreshToken}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    resHeaders.append('Set-Cookie', refreshCookie);

    return new NextResponse(
      JSON.stringify({ success: true, tokens: { accessToken, refreshToken: newRefreshToken } }),
      {
        status: 200,
        headers: resHeaders,
      },
    );
  } catch (error) {
    const refreshError = error as AxiosError;
    return new NextResponse(
      JSON.stringify({ error: 'Token refresh failed', details: refreshError.message }),
      { status: 500 },
    );
  }
}
