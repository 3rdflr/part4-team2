'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.log('❌ [ERROR] ActivityPage 에러 발생', {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className='container mx-auto px-4 py-16 text-center'>
      <div className='max-w-md mx-auto'>
        <div className='text-6xl mb-4'>🚧</div>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>체험 정보를 불러올 수 없습니다</h1>
        <p className='text-gray-600 mb-8'>
          일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <div className='space-y-4'>
          <button
            onClick={reset}
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors mr-4'
          >
            다시 시도
          </button>
          <button
            onClick={() => window.history.back()}
            className='bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors'
          >
            이전 페이지
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className='mt-8 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500'>개발자 정보</summary>
            <pre className='mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto'>
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
