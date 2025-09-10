import { NotificationItem } from '@/types/notification.type';
import { useNotifications, useDeleteNotification } from '@/hooks/useNotification';
import { X } from 'lucide-react';
import formatTime from '@/hooks/useFormatTime';
import Spinner from '../common/Spinner';

export default function NotificationModal() {
  const { data: notificationData, isLoading, error } = useNotifications();
  const deleteNotification = useDeleteNotification();

  const handleDeleteNotification = (id: number) => {
    deleteNotification.mutate(id);
  };

  return (
    <>
      <div className='h-[380px] min-w-[300px] overflow-y-scroll scrollbar-hide mt-5 py-5'>
        {isLoading ? (
          <div className='h-full flex items-center justify-center w-full'>
            <Spinner />
          </div>
        ) : error ? (
          <div className='flex flex-col items-center justify-center w-full h-full'>
            <p className='text-grayscale-500 text-12-regular'>알림을 불러올 수 없어요</p>
          </div>
        ) : notificationData?.totalCount && notificationData?.totalCount > 0 ? (
          <>
            <h2 className='text-16-medium font-semibold text-title  mb-[48px]'>
              {notificationData?.totalCount}개의 알림
            </h2>
            <ul className='flex flex-col gap-[24px] scrollbar-hide'>
              {notificationData?.notifications?.map(
                ({ id, content, createdAt }: NotificationItem) => (
                  <li
                    key={id}
                    className='flex flex-col gap-[12px] relative bg-grayscale-25 p-5 rounded-2xl'
                  >
                    <div
                      className={`${content.includes('승인') ? 'bg-blue-200 text-blue-400 ' : 'bg-red-200 text-red-400 '} flex items-center justify-center rounded-full px-[10px] py-[6px] w-fit h-fit`}
                    >
                      <span className='leading-none text-xs font-medium'>
                        {content.includes('승인') ? '예약 승인' : '예약 거절'}
                      </span>
                    </div>
                    <div className='flex flex-col gap-[12px] ml-[4px]'>
                      <p className='text-14-regular text-title break-keep'>{content}</p>
                      <span className='text-12-regular text-subtitle  leading-none'>
                        {formatTime(createdAt)}
                      </span>
                    </div>
                    <button
                      className='absolute top-5 right-5 cursor-pointer '
                      onClick={() => handleDeleteNotification(id)}
                    >
                      <X width={20} height={20} />
                    </button>
                  </li>
                ),
              )}
            </ul>
          </>
        ) : (
          <div className='flex flex-col items-center justify-center w-full h-full'>
            <p className='text-grayscale-500 text-12-regular'>알림이 없어요</p>
          </div>
        )}
      </div>
    </>
  );
}
