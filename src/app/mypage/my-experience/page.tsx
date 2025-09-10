'use client';
import { deleteActivity, getMyActivitiesList } from '@/app/api/myActivities';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import MyExperienceCard from '@/components/pages/myPage/MyExperienceCard';
import MyExperienceCardSkeleton from '@/components/pages/myPage/MyExperienceSkeleton';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useOverlay } from '@/hooks/useOverlay';
import { ApiResponse } from '@/types/myActivity.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MyExperiencePage = () => {
  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['my-activities-list'],
    queryFn: () => getMyActivitiesList({}),
    refetchOnMount: 'always',
  });

  const onClickEdit = (id: number) => {
    router.push(`/my-activities/activity/${id}`);
  };

  const onClickShowDeleteModal = (id: number) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='체험을 삭제하시겠어요?'
        actionText='삭제하기'
        isOpen={isOpen}
        onClose={close}
        onAction={() => {
          close();
          onClickDelete(id);
        }}
      />
    ));
  };
  const onClickDelete = (id: number) => {
    deleteMyActivityMutation.mutate(id);
  };

  const deleteMyActivityMutation = useMutation<
    ApiResponse,
    AxiosError<{ message: string }>,
    number
  >({
    mutationFn: (activityId) => deleteActivity(activityId),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-activities-list'] });
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

  const MyExperienceList = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col gap-6'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <MyExperienceCardSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (!data?.activities || data?.activities.length === 0) {
      return (
        <div className='flex flex-col mx-auto'>
          <Image
            src={'/images/icons/_empty.png'}
            width={182}
            height={182}
            alt='체험 관리 디폴트 이미지'
          />
          <span className='text-18-medium text-grayscale-600'>아직 등록한 체험이 없어요</span>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-6'>
        {data?.activities.map((activity) => (
          <MyExperienceCard
            key={activity.id}
            data={activity}
            onEdit={(id) => onClickEdit(id)}
            onDelete={(id) => onClickShowDeleteModal(id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>내 체험 관리</Label>
          <span className='text-14-medium text-grayscale-500'>
            체험을 등록하거나 수정 및 삭제가 가능합니다.
          </span>
        </div>
        <Button size='md' onClick={() => router.push('/my-activities/activity')}>
          체험 등록하기
        </Button>
      </div>

      {/* 체험 관리 카드 목록 */}
      <MyExperienceList />
    </div>
  );
};

export default MyExperiencePage;
