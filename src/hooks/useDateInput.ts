import { useState } from 'react';
import { parse, isValid, format } from 'date-fns';

const useDateInput = () => {
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [error, setError] = useState<string | null>(null);
  const [isDateValid, setDateValid] = useState(false);

  function formatDate(date: Date | undefined) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return format(date, 'yyyy/MM/dd');
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let currentDate = e.target.value;
    currentDate = currentDate.replace(/\D/g, '');
    if (currentDate.length > 4 && currentDate.length <= 6) {
      currentDate = currentDate.slice(0, 4) + '/' + currentDate.slice(4);
    } else if (currentDate.length > 6) {
      currentDate =
        currentDate.slice(0, 4) + '/' + currentDate.slice(4, 6) + '/' + currentDate.slice(6, 8);
    }
    setValue(currentDate);
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(currentDate)) {
      const parsedDate = parse(currentDate, 'yyyy/MM/dd', new Date());
      if (isValid(parsedDate)) {
        setDate(parsedDate);
        setMonth(parsedDate);
        setError(null);
        setDateValid(true);
      } else {
        setError('유효한 날짜를 입력해주세요');
        setDateValid(false);
      }
    } else {
      setError(null);
      setDateValid(false);
    }
  };

  return {
    value,
    date,
    error,
    month,
    isDateValid,
    handleChange,
    setMonth,
    setDate,
    setDateValid,
    setValue,
    setError,
    formatDate,
  };
};

export default useDateInput;
