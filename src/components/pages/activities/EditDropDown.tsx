'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/shadCnUtils';
import { useOverlay } from '@/hooks/useOverlay';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { deleteActivity } from '@/app/api/myActivities';
import { useMutation } from '@tanstack/react-query';
import { ApiResponse } from '@/types/myActivity.type';
import { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { successToast } from '@/lib/utils/toastUtils';

interface EditDropDownProps {
  activityId: number;
  isOwner: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}
export function EditDropDown({ activityId, isOwner, open, setOpen }: EditDropDownProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const overlay = useOverlay();

  // external state와 internal state 동기화
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setOpen?.(newState);
  };

  const handleClose = () => {
    setIsOpen(false);
    setOpen?.(false);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setOpen?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setOpen]);

  const { mutate: deleteActivityMutation, isPending: isDeleting } = useMutation<
    ApiResponse,
    AxiosError<{ message: string }>,
    number
  >({
    mutationFn: (activityId: number) => deleteActivity(activityId),
    onSuccess: () => {
      successToast.run('체험 삭제가 완료되었습니다.');
      queryClient.invalidateQueries({
        queryKey: ['my-activities-list', 'activities', 'activity-detail', activityId],
      });
    },
    onError: (error) => {
      overlay.open(({ isOpen, close }) => (
        <ConfirmModal
          title={error.response?.data?.message}
          isOpen={isOpen}
          onClose={close}
          onAction={close}
        />
      ));
    },
  });

  const handleDelete = () => {
    console.log('삭제 시도: ', { activityId });
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='정말로 이 활동을 삭제하시겠어요?'
        exitText='취소'
        actionText={isDeleting ? '삭제 중...' : '삭제'}
        isOpen={isOpen}
        onClose={close}
        isLoading={isDeleting}
        onAction={() => {
          deleteActivityMutation(activityId);
          close();
          router.push('/');
        }}
      />
    ));

    handleClose();
  };

  const handleEdit = () => {
    console.log('수정 시도: ', { activityId });
    router.push(`/my-activities/activity/${activityId}`);
    handleClose();
  };

  return (
    <div ref={dropdownRef} className='relative'>
      {/* 트리거 버튼 */}
      <Button
        variant='ghost'
        className='h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-colors'
        onClick={handleToggle}
      >
        <EllipsisVertical className='w-8 h-8 text-gray-600' />
      </Button>

      {/* 커스텀 드롭다운 메뉴 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.2,
            }}
            className={cn(
              'absolute right-0 top-full mt-2',
              'min-w-[120px] p-1',
              'bg-white rounded-md border border-gray-200 shadow-lg',
              'z-[150]', // z-index 150 설정
            )}
          >
            {/* 수정하기 메뉴 아이템 */}
            <motion.button
              onClick={handleEdit}
              disabled={!isOwner}
              className={cn(
                'w-full px-3 py-2 text-sm text-left rounded-sm transition-colors',
                'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                'disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent',
              )}
              whileTap={isOwner ? { scale: 0.98 } : {}}
            >
              수정하기
            </motion.button>

            {/* 삭제하기 메뉴 아이템 */}
            <motion.button
              onClick={handleDelete}
              disabled={!isOwner}
              className={cn(
                'w-full px-3 py-2 text-sm text-left rounded-sm transition-colors',
                'hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none',
                'disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-400',
              )}
              whileTap={isOwner ? { scale: 0.98 } : {}}
            >
              삭제하기
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
