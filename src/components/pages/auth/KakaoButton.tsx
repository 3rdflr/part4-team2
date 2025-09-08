import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface KakaoButtonProps {
  onClick: () => void;
  type: 'login' | 'signup';
}

const KakaoButton = ({ onClick, type }: KakaoButtonProps) => {
  return (
    <Button
      type='submit'
      variant='secondary'
      size='lg'
      className='w-full bg-[#FEE500] text-[#3C1E1E] border-none hover:bg-[#FEE500]/60'
      onClick={onClick}
    >
      <Image
        src='/images/icons/icon_kakao.svg'
        width={24}
        height={24}
        alt='카카오톡 아이콘'
        className='w-6 h-6 object-contain'
      />
      {type === 'signup' ? '카카오 회원가입' : '카카오 로그인'}
    </Button>
  );
};

export default KakaoButton;
