/**
 * 선언형 스켈레톤 로딩 컴포넌트
 * Suspense fallback으로 사용
 */
export default function ActivitySkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='animate-pulse max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 이미지 영역 스켈레톤 */}
          <div>
            <div className='w-full h-96 bg-gray-200 rounded-lg mb-4' />
            <div className='flex gap-2'>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className='w-20 h-20 bg-gray-200 rounded-md' />
              ))}
            </div>
          </div>

          {/* 정보 영역 스켈레톤 */}
          <div className='space-y-6'>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded w-24' />
              <div className='h-8 bg-gray-200 rounded w-3/4' />
              <div className='h-5 bg-gray-200 rounded w-1/2' />
              <div className='h-4 bg-gray-200 rounded w-1/3' />
            </div>
            <div className='h-6 bg-gray-200 rounded w-32' />
            <div className='space-y-3'>
              <div className='h-4 bg-gray-200 rounded w-full' />
              <div className='h-4 bg-gray-200 rounded w-5/6' />
              <div className='h-4 bg-gray-200 rounded w-4/5' />
            </div>
          </div>
        </div>

        {/* 하단 섹션 스켈레톤 */}
        <div className='mt-12 space-y-8'>
          {/* 지도 섹션 스켈레톤 */}
          <div className='border-t pt-8'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-4' />
            <div className='h-64 bg-gray-200 rounded-lg' />
          </div>

          {/* 리뷰 섹션 스켈레톤 */}
          <div className='border-t pt-8'>
            <div className='h-6 bg-gray-200 rounded w-32 mb-4' />
            <div className='space-y-4'>
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className='flex gap-4 p-4 border rounded-lg'>
                  <div className='w-12 h-12 bg-gray-200 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-1/4' />
                    <div className='h-4 bg-gray-200 rounded w-full' />
                    <div className='h-4 bg-gray-200 rounded w-3/4' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
