import Image from 'next/image';
import { useRouter } from 'next/navigation';

const LogoImage = () => {
  const router = useRouter();

  return (
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
  );
};

export default LogoImage;
