'use client';
import React from 'react';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from '@/components/ui/drawer';

interface BottomSheetProps {
  title?: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BottomSheet = ({ open, onOpenChange, title, children, buttons }: BottomSheetProps) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus={open}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {/* DrawerDescription: 미사용이지만 구조는 필요 */}
          <DrawerDescription className='sr-only'>다이얼로그 내용</DrawerDescription>
        </DrawerHeader>

        <div className='px-6 py-6 max-h-[60vh] overflow-y-auto'>{children}</div>

        <DrawerFooter className='flex flex-col'>{buttons}</DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BottomSheet;
