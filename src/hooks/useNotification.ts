// hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, deleteNotification } from '@/app/api/notifications';
import { Notification } from '@/types/notification.type';

// 알림 조회 훅
export const useNotifications = () => {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    staleTime: 1000 * 60, // 1분
    gcTime: 1000 * 60 * 5, // 5분
  });
};

// 알림 삭제 훅
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: ['notifications'] });

      const previousData = queryClient.getQueryData(['notifications']); //백업

      queryClient.setQueryData(['notifications'], (oldData: Notification | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          notifications: oldData.notifications.filter(
            (notification) => notification.id !== notificationId,
          ),
          totalCount: oldData.totalCount - 1,
        };
      });
      return { previousData };
    },
    onError: (error, notificationId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['notifications'], context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
