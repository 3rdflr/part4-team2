import { NextResponse } from 'next/server';

/**
 * 로그아웃 API 핸들러
 * 클라이언트의 POST 요청을 받아 인증 쿠키를 삭제합니다.
 */
export async function POST(req: Request) {
  const cookiesHeader = req.headers.get('cookie') || '';

  if (!cookiesHeader.includes('accessToken') && !cookiesHeader.includes('refreshToken')) {
    return NextResponse.json({ message: 'Already logged out' }, { status: 200 });
  }

  const expiredDate = new Date(0).toUTCString();
  const cookies = [
    `accessToken=; Path=/; SameSite=Lax; Expires=${expiredDate};`, // SameSite만 추가
    `refreshToken=; Path=/; HttpOnly; SameSite=Lax; Expires=${expiredDate};`, // SameSite만 추가
  ];
  const headers = new Headers();
  cookies.forEach((cookie) => headers.append('Set-Cookie', cookie));

  return new NextResponse(JSON.stringify({ message: 'Logged out successfully' }), {
    status: 200,
    headers,
  });
}
