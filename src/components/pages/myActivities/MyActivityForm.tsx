'use client';
import DateTimeRow from './DateTimeRow';
import {
  Controller,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FormProvider,
  Merge,
} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from './CategorySelect';
import { MyActivityFormData } from '@/lib/utils/myActivitySchema';
import FormInput from '@/components/common/FormInput';
import clsx from 'clsx';
import { MyActivitySchedule } from '@/types/myActivity.types';
import { useEffect } from 'react';
import { toInputDate } from '@/lib/utils/dateUtils';
import useMyActivityForm from '@/hooks/useMyActivityForm';
import ImageUploadSection from './ImageUploadSection';
import Script from 'next/script';

interface MyActivityFormProps {
  mode?: 'EDIT' | 'REGISTER';
  activityId?: string;
}

const MyActivityForm = ({ mode = 'REGISTER', activityId }: MyActivityFormProps) => {
  const {
    methods,
    errors,
    control,
    scheduleFields,
    register,
    setValue,
    trigger,
    update,
    append,
    remove,
    getDetailMutation,
    uploadImageAndGetUrl,
    registerForm,
    updateForm,
    setOriginalSchedules,
  } = useMyActivityForm({ mode, activityId });

  const handleOpenAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setValue('address', addr, { shouldValidate: true });
      },
    }).open();
  };

  const onSubmit = async (data: MyActivityFormData) => {
    console.log('폼 유효성 통과', data);
    await uploadImageAndGetUrl();
    if (mode === 'REGISTER') {
      registerForm();
    } else {
      console.log(data);
      updateForm();
    }
  };

  const onError = (errors: FieldErrors<MyActivityFormData>) => {
    console.log('폼 에러 발생', errors);
  };

  useEffect(() => {
    if (mode === 'EDIT') {
      getDetailMutation.mutate(Number(activityId), {
        onSuccess: (activity) => {
          const detailSchedules = activity.schedules.map((schedule) => ({
            ...schedule,
            date: toInputDate(schedule.date),
          }));

          setOriginalSchedules(detailSchedules);
          const formData: MyActivityFormData = {
            ...activity,
            price: String(activity.price),
            schedules: detailSchedules,
            subImages: activity.subImages ?? [],
            bannerImages: [{ imageUrl: activity.bannerImageUrl }],
            subImageUrls: [] as string[],
            bannerFiles: [],
            subFiles: [],
          };

          methods.reset(formData);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex flex-col'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <div className='flex flex-col gap-6'>
            <Label className='text-[18px] font-bold'>
              {mode === 'REGISTER' ? '내 체험 등록' : '내 체험 수정'}
            </Label>

            {/* 제목 */}
            <div className='flex flex-col gap-2.5'>
              <FormInput
                type='text'
                id='title'
                label='제목'
                placeholder='제목을 입력해 주세요'
                error={errors.title?.message}
                maxLength={20}
                {...register('title')}
              />
            </div>

            {/* 카테고리 */}
            <div className='flex flex-col gap-2.5'>
              <Label>카테고리</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: '카테고리를 선택해주세요' }}
                render={({ field, fieldState }) => (
                  <div>
                    <CategorySelect
                      value={field.value ?? undefined}
                      error={fieldState.error}
                      onChange={field.onChange}
                      onBlur={() => {
                        field.onBlur();
                        trigger('category');
                      }}
                      className={
                        fieldState.error &&
                        'border-destructive/20 bg-destructive/10 dark:bg-destructive/20'
                      }
                    />
                    {fieldState.error && (
                      <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px]'>
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>

            {/* 설명 */}
            <div className='flex flex-col gap-2.5'>
              <Label>설명</Label>
              <Textarea
                {...register('description')}
                error={errors.description?.message}
                className='min-h-[200px]'
                placeholder='체험에 대한 설명을 입력해 주세요'
              />
            </div>

            {/* 가격 */}
            <div className='flex flex-col gap-2.5'>
              <Controller
                name='price'
                control={methods.control}
                render={({ field }) => (
                  <FormInput
                    label='가격'
                    id='price'
                    placeholder='체험 금액을 입력해주세요'
                    {...field}
                    value={
                      field.value
                        ? new Intl.NumberFormat('ko-KR').format(
                            Number(field.value.replace(/,/g, '')),
                          )
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(raw)) field.onChange(raw);
                    }}
                    error={errors.price?.message}
                    maxLength={8}
                  />
                )}
              />
            </div>

            {/* 주소 */}
            <div className='flex flex-col gap-2.5'>
              <div className='flex gap-2 w-full items-center'>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: '주소를 선택해 주세요' }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      type='text'
                      id='address'
                      label='주소'
                      placeholder='주소를 선택해 주세요'
                      {...field}
                      readOnly
                      className='w-full box-border bg-grayscale-25 text-muted-foreground !placeholder-grayscale-400 cursor-pointer'
                      onClick={handleOpenAddressSearch}
                      onBlur={() => {}} // onBlur 비워서 validation 안 발생
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Button
                  type='button'
                  size='lg'
                  className='px-4 py-3 text-sm font-bold text-white rounded-[16px] flex-shrink-0'
                  onClick={handleOpenAddressSearch}
                >
                  검색
                </Button>
              </div>
            </div>
          </div>

          {/* 예약 가능한 시간대 */}
          <div className='mt-7.5'>
            <Label>예약 가능한 시간대</Label>
            {scheduleFields.map((scheduleField, index) => (
              <div
                key={index}
                className={clsx(
                  'w-full',
                  errors?.schedules?.[index] ? '' : 'py-2.5',
                  index === 0 ? 'pt-4' : '',
                  index === 0 && scheduleFields.length > 1 ? 'pb-5' : '',
                  index === 1 ? 'pt-5 border-t border-grayscale-100' : '',
                )}
              >
                <DateTimeRow
                  key={index}
                  data={scheduleField}
                  onChange={(val) => {
                    update(index, val);
                    trigger('schedules');
                  }}
                  onBlur={() => {
                    trigger('schedules');
                  }}
                  onAdd={() =>
                    append({
                      date: '',
                      startTime: '',
                      endTime: '',
                    })
                  }
                  onRemove={() => remove(index)}
                  isFirstRow={index === 0}
                  errors={
                    errors?.schedules?.[index] as Merge<
                      FieldError,
                      FieldErrorsImpl<Omit<MyActivitySchedule, 'id'>>
                    >
                  }
                />
              </div>
            ))}
          </div>

          {/* 이미지 등록 */}
          <ImageUploadSection control={control} methods={methods} setValue={setValue} />

          <div className='flex justify-center w-full mt-6'>
            <Button
              type='submit'
              className='w-30'
              disabled={!methods.formState.isDirty || !methods.formState.isValid}
            >
              {mode === 'REGISTER' ? '등록' : '수정'}하기
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* 다음 주소 API 스크립트 */}
      <Script
        src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        strategy='afterInteractive'
      />
    </div>
  );
};

export default MyActivityForm;
