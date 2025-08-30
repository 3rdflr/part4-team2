import { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

import { FaPlus, FaMinus, FaTimes, FaPen } from 'react-icons/fa';

interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'plus' | 'minus' | 'close' | 'edit';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const RoundButton = ({ mode = 'close', children, className, onClick }: RoundButtonProps) => {
  const baseClass =
    'cursor-pointer rounded-full flex items-center justify-center border border-transparent focus:outline-none focus-visible:border-[var(--primary-200)] focus-visible:ring-[var(--primary-200)]/30 focus-visible:ring-[3px]';

  const getModeClass = (): string => {
    const modeClassMap: Record<string, string> = {
      plus: 'w-[28px] h-[28px] sm:w-[42px] sm:h-[42px] bg-primary-500 hover:bg-[var(--primary-400)]',
      minus: 'w-[28px] h-[28px] sm:w-[42px] sm:h-[42px] bg-grayscale-50 hover:bg-grayscale-25',
      close: 'w-[20px] h-[20px] sm:w-[26px] sm:h-[26px] bg-grayscale-950 hover:bg-grayscale-800',
      edit: 'w-[30px] h-[30px] md:w-[24px] md:h-[24px] lg:w-[30px] lg:h-[30px] bg-grayscale-300 hover:bg-grayscale-200',
    };
    return modeClassMap[mode];
  };

  return (
    <button type='button' className={clsx(baseClass, getModeClass(), className)} onClick={onClick}>
      {mode === 'plus' && <FaPlus size={12} className='text-white' />}
      {mode === 'minus' && <FaMinus size={12} className='text-black' />}
      {mode === 'close' && <FaTimes size={10} className='text-white' />}
      {mode === 'edit' && <FaPen size={10} className='text-white' />}
      {children}
    </button>
  );
};

export default RoundButton;
