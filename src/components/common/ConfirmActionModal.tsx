import { Modal } from 'react-simplified-package';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface ConfirmActionModalProps {
  title?: string | React.ReactNode;
  exitText?: string;
  actionText?: string;
  buttons?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

const ConfirmActionModal = ({
  title,
  exitText = '아니오',
  actionText = '네',
  buttons,
  className,
  isOpen,
  onClose,
  onAction,
}: ConfirmActionModalProps) => {
  const buttonClass = 'w-28 sm:w-36';
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName={clsx('bg-white !p-7.5 !rounded-3xl', className)}
      buttonClassName='!hidden'
    >
      <div className='flex flex-col items-center gap-6 w-65 sm:w-85'>
        <span className='text-18-bold'>{title}</span>
        <div className='flex sm:gap-3 gap-2'>
          {buttons ? (
            buttons
          ) : (
            <>
              <Button size='md' variant='secondary' className={buttonClass} onClick={onClose}>
                {exitText}
              </Button>
              <Button size='md' className={buttonClass} onClick={onAction}>
                {actionText}
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmActionModal;
