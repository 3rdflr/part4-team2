'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';

import { validations } from '@/lib/utils/validations';

import Image from 'next/image';

// button, input 공통 테스트 화면

type FormValues = {
  email: string;
  password: string;
};

const Common = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm<FormValues>();

  return (
    <>
      <h1 className='text-2xl'>button, input 공통</h1>

      <div className='flex gap-2 p-1'>
        <Button size='sm' onClick={() => alert('버튼이 클릭되었습니다!')}>
          버튼 테스트
        </Button>
        <Button variant='secondary'>버튼 테스트</Button>
        <Button disabled>버튼 테스트</Button>
        <Button variant='secondary'>
          <Image
            src='/icon/icon_kakao.svg'
            alt='아이콘'
            width={24}
            height={24}
            className='w-6 h-6 object-contain'
          />
          아이콘
        </Button>
      </div>

      <br />

      <form onSubmit={handleSubmit((data) => alert(data))}>
        <div className='flex gap-2 p-1 '>
          <FormInput
            type='email'
            id='input1'
            label='email'
            placeholder='email'
            error={errors.email?.message}
            aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
            {...register('email', validations.email)}
          />
          <FormInput
            type='password'
            id='input2'
            label='password'
            placeholder='password'
            error={errors.password?.message}
            aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
            {...register('password', validations.password)}
          />
        </div>
        <Button type='submit' disabled={isSubmitting}>
          전송
        </Button>
      </form>
    </>
  );
};

export default Common;
