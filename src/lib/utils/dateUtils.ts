import { parse, format } from 'date-fns';
import { ko } from 'date-fns/locale';

// YY/MM/DD → YYYY-MM-DD 변환
export const toApiDate = (val: string) => {
  const parsed = parse(val, 'yy/MM/dd', new Date(), { locale: ko });
  return format(parsed, 'yyyy-MM-dd');
};

// YYYY-MM-DD → YY/MM/DD 변환
export const toInputDate = (val: string) => {
  const parsed = parse(val, 'yyyy-MM-dd', new Date(), { locale: ko });
  return format(parsed, 'yy/MM/dd');
};

// YYYY-MM-DD → YYYY.MM.DD 변환
export const toCardDate = (val: string) => {
  const parsed = parse(val, 'yyyy-MM-dd', new Date(), { locale: ko });
  return format(parsed, 'yyyy.MM.dd');
};
