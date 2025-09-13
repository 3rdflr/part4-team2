'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { SchedulesByDate } from '@/types/activities.type';

interface BookingDateModalProps {
  isOpen: boolean;
  onClose: (fromXButton?: boolean) => void;
  schedulesByDate: SchedulesByDate;
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
  inputRect?: DOMRect | null; // input 위치 정보
}

export function BookingDateModal({
  isOpen,
  onClose,
  schedulesByDate,
  selectedDate,
  onSelectDate,
  inputRect,
}: BookingDateModalProps) {
  const handleDateSelect = (date: Date | undefined) => {
    onSelectDate(date);
    // X 버튼으로만 닫히도록 변경 - 날짜 선택 시 자동으로 닫지 않음
  };

  // 모달 위치 계산 - input 왼쪽으로 슬라이드
  const modalStyle = inputRect
    ? {
        position: 'fixed' as const,
        top: inputRect.top,
        left: Math.max(20, inputRect.left - 420), // input 왼쪽으로 420px, 최소 20px 마진
        minWidth: '400px',
        maxWidth: '420px',
        zIndex: 50,
      }
    : {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '400px',
        maxWidth: '420px',
        zIndex: 50,
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 모달 */}
          <motion.div
            initial={{
              opacity: 0,
              x: inputRect ? 60 : 0, // input 기준 오른쪽에서 왼쪽으로 슬라이드
              y: inputRect ? 0 : 20,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: inputRect ? 60 : 0,
              y: inputRect ? 0 : 20,
              scale: 0.95,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            style={modalStyle}
          >
            <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>
              {/* 헤더 */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-primary-50 to-primary-100'
              >
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>날짜 선택</h3>
                  <p className='text-sm text-primary-600 mt-1'>체험할 날짜를 선택해주세요</p>
                </div>
                <motion.button
                  onClick={() => onClose(true)}
                  className='p-2 hover:bg-white/50 rounded-full transition-colors'
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <X className='w-5 h-5 text-gray-500' />
                </motion.button>
              </motion.div>

              {/* 캘린더 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='p-6'
              >
                <BookingCalendar
                  schedulesByDate={schedulesByDate}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
