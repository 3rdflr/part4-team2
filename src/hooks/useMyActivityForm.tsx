import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MyActivityFormData, MyActivitySchema } from '@/lib/utils/myActivitySchema';
import { useMutation } from '@tanstack/react-query';
import {
  ActivityCreateRequest,
  ActivityCreateResponse,
  ActivityUpdateRequest,
  ActivityUpdateResponse,
  createActivity,
  getActivityDetail,
  ImageUploadResponse,
  uploadActivityImage,
} from '@/app/api/activities';
import { ActivitiesCategoryType, ActivityDetail } from '@/types/activities.type';
import { successToast } from '@/lib/utils/toastUtils';
import { toApiDate } from '@/lib/utils/dateUtils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateActivity } from '@/app/api/myActivities';

interface useMyActivityForm {
  mode?: 'EDIT' | 'REGISTER';
  activityId?: string;
}

const useMyActivityForm = ({ mode = 'REGISTER', activityId }: useMyActivityForm) => {
  const router = useRouter();
  const [originalSchedules, setOriginalSchedules] = useState<MyActivityFormData['schedules']>([]);

  const methods = useForm({
    resolver: zodResolver(MyActivitySchema),
    defaultValues: {
      title: '',
      category: undefined,
      description: '',
      price: '',
      address: '',
      bannerImageUrl: '',
      subImageUrls: [] as string[],
      bannerFiles: [],
      subImages: [],
      bannerImages: [], // 상세조회한 배너 이미지를 보여주기 위해 추가
      subFiles: [],
      schedules: [{ date: '', startTime: '', endTime: '' }],
      subImageUrlsToAdd: [],
      subImageIdsToRemove: [],
      schedulesToAdd: [],
      scheduleIdsToRemove: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const { register, control, setValue, watch, formState, trigger } = methods;
  const { errors } = formState;

  const {
    fields: scheduleFields,
    update,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'schedules',
  });

  const getDetailMutation = useMutation<ActivityDetail, Error, number>({
    mutationFn: (activityId) => getActivityDetail(activityId),
    retry: 1,
    retryDelay: 300,
  });

  const uploadImageMutation = useMutation<ImageUploadResponse, Error, File>({
    mutationFn: (file: File) => uploadActivityImage(file),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      console.log('이미지 업로드 성공', response.activityImageUrl);
    },
    onError: (error) => {
      console.log('이미지 업로드 실패', error);
    },
  });

  const registerMutation = useMutation<ActivityCreateResponse, Error, ActivityCreateRequest>({
    mutationFn: (data: ActivityCreateRequest) => createActivity(data),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      router.push(`/activities/${response.id}`);
      successToast.run('등록이 완료되었습니다.');
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const updateMutation = useMutation<
    ActivityUpdateResponse,
    Error,
    { activityId: number; data: ActivityUpdateRequest }
  >({
    mutationFn: ({ activityId, data }) => updateActivity(activityId, data),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      router.push(`/activities/${response.id}`);
      successToast.run('수정이 완료되었습니다.');
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const uploadImageAndGetUrl = async () => {
    const bannerFiles = watch('bannerFiles') ?? [];
    const subFiles = watch('subFiles') ?? [];

    if (bannerFiles.length > 0) {
      const bannerUploadResponse = await uploadImageMutation.mutateAsync(bannerFiles[0]);
      setValue('bannerImageUrl', bannerUploadResponse.activityImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (subFiles.length > 0) {
      const subImagesUploadResponse = await Promise.all(
        subFiles.map((file) => uploadImageMutation.mutateAsync(file)),
      );

      const subImageUrls = subImagesUploadResponse.map((res) => res.activityImageUrl);

      if (mode === 'EDIT') {
        setValue('subImageUrlsToAdd', subImageUrls, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue('subImageUrls', subImageUrls, { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const registerForm = async () => {
    const values = methods.getValues();

    const params: ActivityCreateRequest = {
      ...values,
      category: values.category as ActivitiesCategoryType,
      price: Number(values.price.replace(/,/g, '')),
      subImageUrls: values.subImageUrls ?? [],
      schedules: values.schedules.map(({ date, startTime, endTime }) => ({
        date: toApiDate(date),
        startTime,
        endTime,
      })),
    };

    registerMutation.mutate(params);
  };

  const updateForm = async () => {
    const values = methods.getValues();

    // 삭제된 스케줄
    const scheduleIdsToRemove: number[] = originalSchedules
      .filter((s) => {
        const current = values.schedules.find((v) => v.id === s.id);
        if (!current) return true;

        return (
          current.date !== s.date ||
          current.startTime !== s.startTime ||
          current.endTime !== s.endTime
        );
      })
      .map((s) => Number(s.id));

    // 새로 추가된 스케줄
    const schedulesToAdd = values.schedules
      .filter((s) => {
        if (!s.id) return true;

        const original = originalSchedules.find((v) => v.id === s.id);
        if (!original) return true;

        return (
          original.date !== s.date ||
          original.startTime !== s.startTime ||
          original.endTime !== s.endTime
        );
      })
      .map(({ date, startTime, endTime }) => ({
        date: toApiDate(date),
        startTime,
        endTime,
      }));

    const params: ActivityUpdateRequest = {
      ...values,
      category: values.category as ActivitiesCategoryType,
      price: Number(values.price.replace(/,/g, '')),
      scheduleIdsToRemove,
      schedulesToAdd,
      subImageIdsToRemove: values.subImageIdsToRemove ?? [],
      subImageUrlsToAdd: values.subImageUrlsToAdd ?? [],
    };

    updateMutation.mutate({ activityId: Number(activityId), data: params });
  };

  return {
    methods,
    errors,
    control,
    formState,
    scheduleFields,
    register,
    setValue,
    watch,
    trigger,
    update,
    append,
    remove,
    getDetailMutation,
    uploadImageMutation,
    registerMutation,
    updateMutation,
    uploadImageAndGetUrl,
    registerForm,
    updateForm,
    setOriginalSchedules,
  };
};

export default useMyActivityForm;
