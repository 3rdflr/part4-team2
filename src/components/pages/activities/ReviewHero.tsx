import { Stars } from '@/components/common/Stars';
import { motion } from 'framer-motion';

interface ReviewHeroProps {
  reviewCount: number;
  rating: number;
}

type Level = 0 | 1 | 2 | 3 | 4;
const LABELS = ['평점 없음', '보통', '다소 만족', '만족', '매우 만족'] as const;

export function ReviewHero({ reviewCount = 1000, rating = 5 }: ReviewHeroProps) {
  const level = Math.max(0, Math.min(4, Math.floor(rating))) as Level;
  const summary = LABELS[level];

  return (
    <div className='flex flex-col items-center gap-[6px]'>
      <motion.h1
        className='font-bold text-3xl md:text-3xl'
        key={rating}
        initial={{ opacity: 0.7, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {rating.toFixed(1)}
      </motion.h1>
      <motion.div
        key={`stars-${rating}`}
        initial={{ opacity: 0.7, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Stars initRate={rating} size='lg' className='justify-center' />
      </motion.div>
      <motion.p
        className='font-bold text-md'
        key={summary}
        initial={{ opacity: 0.7, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {summary}
      </motion.p>

      <p className='text-sm text-gray-500'>{reviewCount.toLocaleString()}개 후기</p>
    </div>
  );
}
