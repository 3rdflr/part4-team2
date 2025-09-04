import Image from 'next/image';
import RoundButton from '../myActivities/RoundButton';
import { useEffect, useRef, useState } from 'react';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { useUserStore } from '@/store/userStore';
import { useOverlay } from '@/hooks/useOverlay';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, updateUserInfo, uploadProfileImage } from '@/app/api/user';
import { UploadProfileImageResponse, UserProfile, UserUpdateRequest } from '@/types/user.type';
import { AxiosError } from 'axios';
import ConfirmModal from '@/components/common/ConfirmModal';

const ProfileImageUploader = () => {
  const { setUser } = useUserStore();
  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const inputRef = useRef<HTMLInputElement>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');

  const PROFILE_IMG_URL = '/images/icons/default_profile.svg';

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
  });

  const uploadProfileMutation = useMutation<
    UploadProfileImageResponse,
    AxiosError<{ message: string }>,
    File
  >({
    mutationFn: (file: File) => uploadProfileImage(file),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      setProfileImageUrl(response.profileImageUrl);
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

  const updateUserMutation = useMutation<
    UserProfile,
    AxiosError<{ message: string }>,
    UserUpdateRequest
  >({
    mutationFn: updateUserInfo,
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      successToast.run('프로필 이미지 변경이 완료되었습니다.');
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

  const { mutate: updateUser } = updateUserMutation;
  const { mutateAsync: uploadProfile } = uploadProfileMutation;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    // 파일 용량 체크 (5MB 제한)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      errorToast.run('5MB를 초과하는 파일은 등록이 불가합니다.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewImageUrl(reader.result as string);
    };

    reader.readAsDataURL(file);

    // 이미지 URL 생성 API 호출
    const { profileImageUrl: updatedProfileImageUrl } = await uploadProfile(file);

    // 내 정보 업데이트 API 호출
    updateUser({
      profileImageUrl: updatedProfileImageUrl,
    });

    // 파일 선택 필드 초기화
    e.target.value = '';
    // 미리보기 이미지 초기화
    setPreviewImageUrl('');
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      setProfileImageUrl(userData.profileImageUrl);
    }
  }, [userData, setUser]);

  return (
    <div className='relative flex justify-center mt-4 w-[120px] h-[120px] md:w-[70px] md:h-[70px] lg:w-[120px] lg:h-[120px] mx-auto'>
      {!profileImageUrl && !previewImageUrl ? (
        <Image
          src={PROFILE_IMG_URL}
          priority
          alt='프로필 기본 이미지'
          width={120}
          height={120}
          blurDataURL={PROFILE_IMG_URL}
        />
      ) : (
        <Image
          src={previewImageUrl ? previewImageUrl : profileImageUrl}
          alt='프로필 이미지'
          width={120}
          height={120}
          className='w-full h-full object-cover rounded-full border border-grayscale-100 bg-white'
          priority
        />
      )}

      <RoundButton
        mode='edit'
        className='absolute bottom-[8px] right-[4px] md:bottom-[4px] md:right-[0px] lg:bottom-[6px] lg:right-[2px]'
        onClick={handleUploadClick}
      />
      <input
        ref={inputRef}
        type='file'
        accept='image/png, image/jpeg'
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ProfileImageUploader;
