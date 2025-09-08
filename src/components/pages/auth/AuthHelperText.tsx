import { useRouter } from 'next/navigation';

const AuthHelperText = ({ directUrl }: { directUrl: 'login' | 'signup' }) => {
  const router = useRouter();

  const actionText = directUrl === 'signup' ? '회원가입' : '로그인';
  const promptText = directUrl === 'signup' ? '회원이아니신가요?' : '회원이신가요?';

  return (
    <p className='text-[var(--grayscale-400)] mt-[30px] cursor-default'>
      {promptText}
      <span onClick={() => router.push(`/${directUrl}`)} className='underline cursor-pointer ml-1'>
        {actionText}하기
      </span>
    </p>
  );
};

export default AuthHelperText;
