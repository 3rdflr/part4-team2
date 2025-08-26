import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

// 사용법 다시 적기

/**
 * 공통 입력 필드, FormInput 컴포넌트
 *
 * - `type` prop으로 입력 타입을 지정
 * - `id` prop을 통해 label과 input을 연결
 * - `label` prop으로 input 상단에 표시될 텍스트를 지정
 * - 필요 시 추가 props (placeholder, value, onChange 등)를 모두 전달 가능
 *
 * @param {string} [type='text'] - input 타입
 * @param {string} id - input과 label 연결용 id
 * @param {string} label - input 상단에 표시될 라벨 텍스트
 * @param {string} error - errors 객체의 message를 넘겨주세요.
 *
 * @example
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
  </div>
  <Button type='submit' disabled={isSubmitting}>
    전송
  </Button>
</form>
 */

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ type = 'text', id, label, error, ...props }, ref) => {
    return (
      <div className='flex flex-col w-full'>
        <Label htmlFor={id} className='mb-[10px]'>
          {label}
        </Label>
        <Input type={type} id={id} ref={ref} {...props} />
        <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px] min-h-[20px]'>
          {error}
        </small>
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';

export default FormInput;
