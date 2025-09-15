/* eslint-disable @next/next/no-img-element */
import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import RoundButton from './RoundButton';
import clsx from 'clsx';
import { errorToast } from '@/lib/utils/toastUtils';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import { useOverlay } from '@/hooks/useOverlay';

interface FetchImage {
  id?: number;
  imageUrl: string;
}

interface ImageUploaderProps {
  maxImages?: number;
  files?: File[];
  fetchedImages?: FetchImage[];
  onChange?: (file: File[]) => void;
  onDeleteFetched?: (id?: number) => void;
}

const ImageUploader = ({
  maxImages = 4,
  files = [],
  fetchedImages = [],
  onChange,
  onDeleteFetched,
}: ImageUploaderProps) => {
  const overlay = useOverlay();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // 파일 용량 체크 (4MB 제한)
    const maxSize = 4 * 1024 * 1024;
    const fileList = Array.from(e.target.files);

    if (fileList.some((file) => file.size > maxSize)) {
      errorToast.run('4MB를 초과하는 파일은 등록이 불가합니다.');
    }

    const validFiles = fileList.filter((file) => file.size <= maxSize);

    const newImages = [...files, ...validFiles].slice(0, maxImages);
    onChange?.(newImages);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    if (files.length + fetchedImages.length >= maxImages) {
      return;
    }
    inputRef.current?.click();
  };

  const onClickShowDeleteModal = (index: number, onDelete: (index: number) => void) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='이미지를 정말 삭제하시겠어요?'
        actionText='삭제하기'
        isOpen={isOpen}
        onClose={close}
        onAction={() => {
          close();
          onDelete(index);
        }}
      />
    ));
  };

  const deleteFile = (index: number) => {
    const deleteImage = files[index];
    URL.revokeObjectURL(deleteImage as unknown as string);
    const newImages = files.filter((_, i) => i !== index);
    onChange?.(newImages);
  };

  const deleteFetchedImage = (index: number) => {
    const image = fetchedImages[index];
    if (!image) return;
    onDeleteFetched?.(image.id);
  };

  return (
    <div className='flex gap-3'>
      <button
        type='button'
        className={clsx(
          'w-20 h-20 sm:w-31.5 sm:h-31.5 border border-grayscale-100  rounded-2xl gap-0.5 flex flex-col items-center justify-center focus:outline-none focus-visible:border-[var(--primary-500)] focus-visible:ring-[var(--primary-300)]/30 focus-visible:ring-[3px]',
          {
            'bg-grayscale-25': files.length + fetchedImages.length === maxImages,
            'bg-white cursor-pointer': files.length + fetchedImages.length !== maxImages,
          },
        )}
        onClick={handleUploadClick}
      >
        <div className='w-6 h-6 sm:w-10 sm:h-10'>
          <ImagePlus className='w-full h-full text-grayscale-300' strokeWidth={1.5} />
        </div>
        <div className='text-grayscale-600 text-13-medium'>
          {files.length + fetchedImages.length} / {maxImages}
        </div>
      </button>

      {/* 상세 데이터 이미지 */}
      {fetchedImages.map((image, index) => {
        return (
          <div
            key={index}
            className='relative w-20 h-20 sm:w-31.5 sm:h-31.5 border border-grayscale-100 bg-white rounded-2xl'
          >
            <img
              src={image.imageUrl}
              alt='업로드 이미지'
              className='w-full h-full object-cover rounded-2xl'
            />
            <RoundButton
              className='absolute -right-2 -top-2 z-10'
              onClick={() => onClickShowDeleteModal(index, deleteFetchedImage)}
            />
          </div>
        );
      })}

      {/* 로컬 이미지 */}
      {files.map((file, index) => {
        return (
          <div
            key={index}
            className='relative w-20 h-20 sm:w-31.5 sm:h-31.5 border border-grayscale-100 bg-white rounded-2xl'
          >
            <img
              src={URL.createObjectURL(file)}
              alt='업로드 이미지'
              className='w-full h-full object-cover rounded-2xl'
            />
            <RoundButton
              className='absolute -right-2 -top-2 z-10'
              onClick={() => onClickShowDeleteModal(index, deleteFile)}
            />
          </div>
        );
      })}
      <input
        ref={inputRef}
        type='file'
        accept='image/png, image/jpeg'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
