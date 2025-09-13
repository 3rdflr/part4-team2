import { Modal } from 'react-simplified-package';
import { Button } from '@/components/ui/button';

interface PaymentsErrorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentsError({ isOpen, onClose }: PaymentsErrorProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} modalClassName='max-w-[400px] w-full'>
      <div className='flex flex-col items-center gap-4 p-6'>
        <div className='text-red-500 text-2xl'>⚠️</div>
        <div className='text-center'>
          <h3 className='font-medium text-gray-900 mb-1'>결제 오류</h3>
          <p className='text-sm text-gray-500'>결제 시스템에 문제가 발생했습니다</p>
        </div>
        <Button onClick={onClose} className='w-full'>
          닫기
        </Button>
      </div>
    </Modal>
  );
}
