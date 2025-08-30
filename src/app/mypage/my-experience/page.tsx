'use client';
import { deleteActivity, getMyActivitiesList } from '@/app/api/myActivities';
import MyExperienceCard from '@/components/pages/myPage/MyExperienceCard';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  ApiResponse,
  MyActivitiesListRequest,
  MyActivitiesListResponse,
} from '@/types/myActivity.type';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const MyExperiencePage = () => {
  const router = useRouter();
  const [experienceList, setExperienceList] = useState<MyActivitiesListResponse | null>(null);

  const onClickEdit = (id: number) => {
    router.push(`/my-activities/activity/${id}`);
  };
  const onClickDelete = (id: number) => {
    deleteMyActivityMutation.mutate(id);
  };

  const getMyActivitiesListMutation = useMutation<
    MyActivitiesListResponse,
    Error,
    MyActivitiesListRequest
  >({
    mutationFn: getMyActivitiesList,
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      setExperienceList(response);
    },
  });

  const deleteMyActivityMutation = useMutation<ApiResponse, Error, number>({
    mutationFn: (activityId) => deleteActivity(activityId),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      getMyActivitiesListMutation.mutate({});
    },
  });

  useEffect(() => {
    getMyActivitiesListMutation.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex w-full justify-between items-center gap-16'>
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

      {/* 리스트 */}
      <div className='flex flex-col gap-6'>
        {experienceList?.activities.map((activity) => (
          <MyExperienceCard
            key={activity.id}
            data={activity}
            onEdit={(id) => onClickEdit(id)}
            onDelete={(id) => onClickDelete(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default MyExperiencePage;
