import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ActivitiesCategoryType } from '@/types/activities.type';
import clsx from 'clsx';
import { FieldError } from 'react-hook-form';

interface CategorySelectProps {
  value: string;
  error?: FieldError;
  onChange: (val: string) => void;
  onBlur: () => void;
  className?: string;
}

const categories: ActivitiesCategoryType[] = [
  '문화 · 예술',
  '식음료',
  '스포츠',
  '투어',
  '관광',
  '웰빙',
];

const CategorySelect = ({ value, error, onChange, onBlur, className }: CategorySelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={(newVal) => onChange(newVal)}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onBlur();
        }
      }}
    >
      <SelectTrigger
        className={clsx('w-full', className, error && 'data-[placeholder]:text-destructive/50')}
      >
        <SelectValue
          placeholder='카테고리를 선택해 주세요'
          className={clsx(error && 'placeholder:text-destructive/50')}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((category, index) => (
            <SelectItem key={`${category}-${index}`} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
