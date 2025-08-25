import { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';

interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'plus' | 'minus' | 'close';
  children?: React.ReactNode;
  className?: string;
}

const RoundButton = ({ mode = 'close', children, className }: RoundButtonProps) => {
  const baseClass = 'rounded-full';

  const getModeClass = (): string => {
    const modeClassMap: Record<string, string> = {
      plus: 'p-3.5 bg-primary-500',
      minus: 'p-3.5 bg-grayscale-50',
      close: 'p-1.5 bg-grayscale-950',
    };
    return modeClassMap[mode];
  };

  return (
    <button className={clsx(baseClass, getModeClass(), className)}>
      {mode === 'plus' && <FaPlus size={12} className='text-white' />}
      {mode === 'minus' && <FaMinus size={12} className='text-black' />}
      {mode === 'close' && <FaTimes size={10} className='text-white' />}
      {children}
    </button>
  );
};

export default RoundButton;
