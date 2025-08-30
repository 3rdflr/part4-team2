import { Label } from '@/components/ui/label';
import useMyActivityForm from '@/hooks/useMyActivityForm';
import { MyActivityFormData } from '@/lib/utils/myActivitySchema';
import { Control, Controller } from 'react-hook-form';
import ImageUploader from './ImageUploader';
import { SubImage } from '@/types/activities.type';

interface ImageUploadSectionProps {
  control: Control<MyActivityFormData>;
  methods: ReturnType<typeof useMyActivityForm>['methods'];
  setValue: ReturnType<typeof useMyActivityForm>['setValue'];
}

const ImageUploadSection = ({ control, methods, setValue }: ImageUploadSectionProps) => {
  return (
    <div className='flex flex-col gap-7.5 mt-5'>
      <div className='flex flex-col'>
        <Label>배너 이미지 등록</Label>
        <span className='text-12-regular text-grayscale-500 py-1'>
          <span className='text-primary-500 mr-0.5'>*</span>배너 이미지는 필수입니다
        </span>
        <Controller
          name='bannerFiles'
          control={control}
          rules={{ required: '배너 이미지를 업로드해주세요' }}
          render={({ field, fieldState }) => (
            <div>
              <ImageUploader
                maxImages={1}
                files={field.value || []}
                fetchedImages={
                  methods.getValues('bannerImages')?.length ? methods.getValues('bannerImages') : []
                }
                onChange={(val) => {
                  field.onChange(val);
                  field.onBlur();
                }}
                onDeleteFetched={() => {
                  setValue('bannerImageUrl', '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                  methods.setValue('bannerImages', [], {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  field.onChange([]);
                }}
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

      <div className='flex flex-col'>
        <Label>소개 이미지 등록</Label>
        <span className='text-12-regular text-grayscale-500 py-1'>
          <span className='text-primary-500 mr-0.5'>*</span>소개 이미지는 최소 2개 이상 등록해주세요
        </span>
        <Controller
          name='subFiles'
          control={control}
          rules={{ required: '배너 이미지를 업로드해주세요' }}
          render={({ field, fieldState }) => (
            <div>
              <ImageUploader
                files={field.value || []}
                fetchedImages={methods.getValues('subImages')}
                onChange={(val) => field.onChange(val)}
                onDeleteFetched={(id) => {
                  if (id !== undefined) {
                    const prev = methods.getValues('subImageIdsToRemove') || [];
                    methods.setValue('subImageIdsToRemove', [...prev, id], {
                      shouldDirty: true,
                      shouldValidate: true,
                    });

                    // subImages 배열에서 삭제
                    const prevImages = (methods.getValues('subImages') as SubImage[]) || [];
                    const newImages = prevImages.filter((img) => img.id !== id);
                    methods.setValue('subImages', newImages, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });

                    field.onChange([]);
                  }
                }}
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
    </div>
  );
};

export default ImageUploadSection;
