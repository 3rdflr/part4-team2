'use client';

import { useRouter } from 'next/navigation';

interface NavbarCategoryProps {
  category: '모두' | '문화 · 예술' | '음식' | '스포츠' | '투어' | '관광' | '웰빙';
  icon: React.ReactNode;
  value: '' | '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
  isSelected: boolean;
}

export default function MobileCategoryButton({
  category,
  icon,
  value,
  isSelected,
}: NavbarCategoryProps) {
  const router = useRouter();

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    const newPath = queryString ? `/?${queryString}` : '/';
    router.push(newPath);
  };

  return (
    <button
      className={`${isSelected ? 'text-title border-b-2 border-title' : 'text-grayscale-500 '} flex flex-col items-center gap-[4px] min-w-[78px]  h-full  cursor-pointer pb-[8px] rounded-t-[8px] hover:bg-grayscale-100 transition-soft`}
      onClick={() => {
        updateQuery('category', value);
      }}
      aria-label={category}
    >
      {icon}
      <span className='text-12-medium '>{category}</span>
    </button>
  );
}
