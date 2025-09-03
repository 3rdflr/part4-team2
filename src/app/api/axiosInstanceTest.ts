import axios from 'axios';

// 백엔드 주소 직접 지정 (프록시 제거)
export const axiosInstanceTest = axios.create({
  baseURL: 'https://sp-globalnomad-api.vercel.app/16-2',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  // withCredentials: true, // 쿠키 인증 필요 없으면 제거
});

export default axiosInstanceTest;
