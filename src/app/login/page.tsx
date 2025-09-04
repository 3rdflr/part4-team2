'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { validations } from '@/lib/utils/validations';
import { useMutation } from '@tanstack/react-query';
import { useUserStore } from '@/store/userStore';
import { AxiosError } from 'axios';
import { login } from '../api/auth';
import { getUserInfo } from '../api/user';
import { errorToast, successToast } from '@/lib/utils/toastUtils';

type loginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitted, isSubmitting, isValid, errors },
  } = useForm<loginFormValues>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 제출 버튼 활성화/비활성화 제어, defaultValues으로 초기 값 false 설정
  // isFilled: 제출 버튼 활성화 제어용
  const allFields = watch();
  const isFilled = Object.values(allFields).every(Boolean);

  // 로그인 성공 시 다이랙트 설정
  // const params = new URLSearchParams(window.location.search);
  // const redirectUrl = params.get('redirect');
  // const source = params.get('source');

  // const handleLoginSuccess = () => {
  //   console.log(source);
  //   alert(source);

  //   if (source === 'signup') {
  //     // 회원가입 페이지를 통해 왔다면 무조건 메인 페이지로 이동
  //     router.push('/');
  //   } else if (redirectUrl) {
  //     // 리다이렉트 URL이 있다면 해당 페이지로 이동
  //     router.push(redirectUrl);
  //   } else {
  //     // 리다이렉트 URL이 없다면 기본 페이지(메인)로 이동
  //     router.push('/');
  //   }
  // };

  // 로그인 요청 mutation
  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: async () => {
      const user = await getUserInfo();
      setUser(user);

      router.push('/');

      // handleLoginSuccess();

      successToast.run(`${user.nickname}님 환영합니다!`);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;

      // alert => 모달로 변경 예정, 리팩토링 때 훅으로 만들 예정
      const { status, data } = error.response ?? {};

      if (status === 400 || status === 409) {
        const fieldMap: Record<string, string> = {
          email: '이메일',
          password: '비밀번호',
        };

        let handled = false;

        for (const [field, keyword] of Object.entries(fieldMap)) {
          if (data?.message.includes(keyword)) {
            setError(field as keyof loginFormValues, {
              type: 'server',
              message: data.message,
            });

            handled = true;

            break;
          }
        }

        if (!handled) errorToast.run(data?.message);
      } else {
        errorToast.run(data?.message);
      }
    },
    retry: 0,
  });

  const handleKakaoLogin = () => {
    const REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY!;
    const REDIRECT_URI = encodeURIComponent(process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URI!);

    // 카카오 로그인 페이지로 이동
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    window.location.href = kakaoAuthUrl; // 카카오 로그인 페이지로 이동
  };

  // 폼 제출
  const onSubmit = (data: loginFormValues) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className=' m-auto grid place-items-center px-[24px] max-w-[674px]'>
      <Image
        src='/images/logo_large.svg'
        width={150}
        height={200}
        alt='Trivera'
        className='object-contain w-auto h-auto mb-[60px] cursor-pointer'
        onClick={() => {
          router.push('/');
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full grid gap-1'>
        <FormInput
          type='text'
          id='email'
          label='이메일'
          placeholder='이메일을 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
          error={errors.email?.message}
          {...register('email', validations.email)}
        />

        <FormInput
          type='password'
          id='password'
          label='비밀번호'
          placeholder='8자 이상 입력해 주세요'
          aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
          error={errors.password?.message}
          {...register('password', validations.password)}
        />

        <Button
          type='submit'
          size='lg'
          className='w-full mt-2'
          disabled={isSubmitted ? !isValid : !isFilled}
        >
          {isSubmitting ? '로그인 중...' : '로그인하기'}
        </Button>
      </form>

      <div className='flex my-[30px] w-full items-center'>
        <hr className='w-full flex-grow' />
        <span className='mx-4 text-[16px] text-[var(--grayscale-700)] text-center whitespace-nowrap cursor-default'>
          or
        </span>
        <hr className='w-full flex-grow' />
      </div>
      <Button
        type='submit'
        variant='secondary'
        size='lg'
        className='w-full bg-[#FEE500] text-[#3C1E1E] border-none hover:bg-[#FEE500]/60'
        onClick={handleKakaoLogin}
      >
        <Image
          src='/images/icons/icon_kakao.svg'
          width={24}
          height={24}
          alt='카카오톡 아이콘'
          className='w-6 h-6 object-contain'
        />
        카카오 로그인
      </Button>
      <p className='text-[var(--grayscale-400)] mt-[30px] cursor-default'>
        회원이 아니신가요?
        <span
          onClick={() => {
            router.push('/signup');
          }}
          className='underline cursor-pointer ml-1'
        >
          회원가입하기
        </span>
      </p>
    </div>
  );
};

export default Login;
