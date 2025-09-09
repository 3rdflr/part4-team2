import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { useUserStore } from '@/store/userStore';

import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import { useOverlay } from '@/hooks/useOverlay';
import { redirectToKakaoAuth } from './kakao';

interface KakaoButtonProps {
  onClick: () => void;
  type: 'login' | 'signup';
}

const KakaoButton = ({ onClick, type }: KakaoButtonProps) => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const overlay = useOverlay();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 성공 로직
      if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {
        const { user } = event.data.payload;
        console.log(user);

        setUser(user);
        router.replace('/'); // 홈으로 이동
        successToast.run(`${user.nickname}님 환영합니다!`);
      }

      // 실패 로직
      if (event.data.type === 'KAKAO_LOGIN_ERROR') {
        const { status, errorMessage } = event.data.payload;

        // login 에러 처리
        if (type === 'login') {
          if (status === 404 || status === 403) {
            overlay.open(({ isOpen, close }) => (
              <ConfirmActionModal
                title={
                  <div className='text-center'>
                    등록되지 않은 사용자입니다. <br /> 카카오 간편 회원가입 하시겠습니까?
                  </div>
                }
                actionText='회원가입 하기'
                isOpen={isOpen}
                onClose={close}
                onAction={() => {
                  close();
                  redirectToKakaoAuth('signup');
                }}
              />
            ));
          } else {
            errorToast.run(errorMessage);
            router.replace('/login');
          }
        }

        // signup 에러 처리
        if (type === 'signup') {
          errorToast.run(errorMessage);

          if ((status === 409 || status === 400) && errorMessage.includes('등록된')) {
            router.replace('/login');
            return;
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router, setUser, overlay, type]);

  return (
    <Button
      type='button'
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
