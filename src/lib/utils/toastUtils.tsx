import { createToast } from 'react-simplified-package';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const toastTypeMap = {
  success: 'text-green-500 border-green-500',
  error: 'text-[var(--secondary-red-500)] border-[var(--secondary-red-500)]',
} as const;

const toastIconMap = {
  success: <FaCheckCircle className='mr-1' />,
  error: <FaExclamationTriangle className='mr-1' />,
} as const;

const createToastWithType = (type: 'success' | 'error') => {
  return createToast(
    (str) => (
      <div
        className={`flex items-center p-4 rounded-lg bg-white shadow-md border ${toastTypeMap[type]}`}
      >
        {toastIconMap[type]}
        <span className='text-xs'>{str}</span>
      </div>
    ),
    { duration: 3000 },
  );
};

export const successToast = createToastWithType('success');
export const errorToast = createToastWithType('error');
