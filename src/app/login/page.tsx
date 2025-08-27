'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { validations } from '@/lib/utils/validations';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import { AxiosError } from 'axios';
import axiosInstance from '@/app/api/axiosInstance';
import { useEffect, useState } from 'react';

type FormValues = {
  email: string;
  password: string;
};

// 로그인 정보 확인용
interface User {
  id: number;
  email: string;
  nickname: string;
}

const Login = () => {
  // 로그인 정보 확인용
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [exp, setExp] = useState<number | null>(null);

  useEffect(() => {
    axiosInstance
      .get('/users/me')
      .then((res) => {
        setUser(res.data);
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setExp(payload.exp);
          } catch (e) {
            console.error('토큰 파싱 실패 ', e);
          }
        }
      })
      .catch((err) => {
        console.log('요청 실패:', err);
        setUser(null);
      });
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('accessToken'));
    }
  }, []);

  //
  const router = useRouter();

  const goToSignup = () => {
    router.push('/signup');
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitted, isSubmitting, errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
  });

  // tanstack
  const mutation = useMutation({
    mutationFn: login,
    mutationKey: ['login'],
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      setIsLoggedIn(true);
      alert(`login 성공`);
    },
    onError: (err: unknown) => {
      const error = err as AxiosError<{ message: string }>;
      if (error) {
        alert(error.response?.data.message);
      }
      if (error.response?.data.message.includes('이메일')) {
        setError('email', {
          type: 'server',
          message: error.response?.data.message,
        });
      }
    },
    retry: 0,
  });

  const onSubmit = (data: FormValues) => {
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
        className='object-contain w-auto h-auto mb-[60px]'
      />
      <form onSubmit={handleSubmit(onSubmit)} className='w-full grid gap-1'>
        <FormInput
          type='email'
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

        <Button type='submit' size='lg' className='w-full mt-2' disabled={isSubmitting}>
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
        className='w-full bg-[#FEE500] text-[#3C1E1E] border-none'
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
        <span onClick={goToSignup} className='underline cursor-pointer ml-1'>
          회원가입하기
        </span>
      </p>

      {/* 임시 */}
      <div className='mt-10 border border-[var(--primary-500)] p-5'>
        <div className='grid gap-1 mb-4'>
          <h1 className='font-bold text-lg'>로그인 정보 </h1>
          {isLoggedIn ? (
            user ? (
              <>
                <p>아이디: {user.id}</p>
                <p>이메일: {user.email}</p>
                <p>닉네임: {user.nickname}</p>
                {exp !== null && (
                  <p>
                    만료 시간: {new Date(exp * 1000).toLocaleString()} ({exp})
                  </p>
                )}
              </>
            ) : (
              <p>사용자 정보 불러오는 중...</p>
            )
          ) : (
            <p>로그인 정보가 현재 없습니다.</p>
          )}
        </div>
        <Button
          onClick={() => {
            localStorage.removeItem('accessToken');
            setIsLoggedIn(false);
            alert('로그아웃 되었습니다.');
          }}
        >
          로그아웃 (임시)
        </Button>
      </div>
    </div>
  );
};

export default Login;
