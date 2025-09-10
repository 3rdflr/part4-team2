'use client';
import { FormProvider } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema } from '@/lib/utils/userSchema';
import { useUserStore } from '@/store/userStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserInfo, updateUserInfo } from '@/app/api/user';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { UserProfile, UserUpdateRequest } from '@/types/user.type';
import { useOverlay } from '@/hooks/useOverlay';
import ConfirmModal from '@/components/common/ConfirmModal';
import { successToast } from '@/lib/utils/toastUtils';
import Spinner from '@/components/common/Spinner';

type UserFormValues = {
  nickname: string;
  email?: string;
  password: string;
  confirmPassword: string;
};

const UserPage = () => {
  const { setUser } = useUserStore();
  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInfo,
    refetchOnMount: 'always',
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
      successToast.run('내 정보 수정이 완료되었습니다.');
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

  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const { reset, register, handleSubmit, getValues, clearErrors, formState, trigger } = methods;
  const { isSubmitted, isSubmitting, isValid, errors } = formState;

  const onSubmit = async (data: UserFormValues) => {
    const { nickname, password } = data;
    const params = {
      nickname,
      newPassword: password,
    };
    updateUser(params);
  };

  useEffect(() => {
    if (userData) {
      setUser(userData);
      reset({
        nickname: userData.nickname,
        email: userData.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [userData, reset, setUser]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col w-full items-start gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>내 정보</Label>
          <span className='text-14-medium text-grayscale-500'>
            닉네임과 비밀번호를 수정하실 수 있습니다.
          </span>
        </div>
        <div className='flex flex-col w-full'>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                {/* 제목 */}
                <FormInput
                  type='text'
                  id='nickname'
                  label='닉네임'
                  placeholder='닉네임을 입력해 주세요'
                  aria-invalid={isSubmitted ? (errors.nickname ? 'true' : 'false') : undefined}
                  error={errors.nickname?.message}
                  {...register('nickname')}
                />
                {/* 이메일 */}
                <FormInput
                  type='text'
                  id='email'
                  label='이메일'
                  placeholder='이메일을 입력해 주세요'
                  disabled
                  autoComplete='email'
                  {...register('email')}
                />
                <FormInput
                  type='password'
                  id='password'
                  label='비밀번호'
                  placeholder='8자 이상 입력해 주세요'
                  autoComplete='new-password'
                  aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
                  error={errors.password?.message}
                  onInput={async () => {
                    const confirmPasswordValue = getValues('confirmPassword');
                    if (confirmPasswordValue) {
                      await trigger('confirmPassword');
                      // 에러 클리어 후 다시 유효성 체크
                      clearErrors('confirmPassword');
                      await trigger('confirmPassword');
                    }
                  }}
                  {...register('password')}
                />
                <FormInput
                  type='password'
                  id='confirmPassword'
                  label='비밀번호 확인'
                  placeholder='비밀번호를 한 번 더 입력해 주세요'
                  autoComplete='new-password'
                  aria-invalid={
                    isSubmitted ? (errors.confirmPassword ? 'true' : 'false') : undefined
                  }
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
              <div className='flex justify-center'>
                <Button size='md' disabled={!isValid} className='min-w-30'>
                  {isSubmitting ? '저장중...' : '저장하기'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
