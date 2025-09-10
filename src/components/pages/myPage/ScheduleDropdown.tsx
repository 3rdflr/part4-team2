import { Dropdown, useDropdownContext } from 'react-simplified-package';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { ReservedSchedule } from '@/types/myReservation.type';
import { useScreenSize } from '@/hooks/useScreenSize';

interface ScheduleDropdownProps {
  value?: string | undefined;
  scheduleList?: ReservedSchedule[];
  onChange?: (val: string) => void;
}

const ScheduleDropdown = ({ value, scheduleList, onChange }: ScheduleDropdownProps) => {
  const { isTablet, isMobile } = useScreenSize();
  const dropdownWidth = isMobile ? 'w-[327px]' : isTablet ? 'w-[338px]' : 'w-[292px]';
  const selected = scheduleList?.find((s) => String(s.scheduleId) === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
  };

  const DropdownMenuList = () => {
    const { close } = useDropdownContext();

    return (
      <>
        {scheduleList?.map((schedule) => (
          <div
            key={schedule.scheduleId}
            onClick={() => {
              handleSelect(String(schedule.scheduleId));
              close();
            }}
            className='hover:bg-primary-100 block rounded-md text-black p-2.5'
          >
            <div className='flex justify-between items-center'>
              {`${schedule.startTime}-${schedule.endTime}`}
              {selected?.scheduleId === schedule.scheduleId && (
                <CheckIcon className='size-4 text-muted-foreground' />
              )}
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          className={`${dropdownWidth} flex justify-between items-center rounded-2xl border border-grayscale-100 px-5 py-4 focus:ring-[3px] focus:border-[var(--primary-200)] focus:ring-[var(--primary-200)]/30`}
        >
          <div className=''>
            {selected ? `${selected.startTime}-${selected.endTime}` : '예약 시간을 선택해 주세요'}
          </div>
          <ChevronDownIcon className='size-4 opacity-50' />
        </button>
      </Dropdown.Trigger>

      <Dropdown.Menu
        className={`${dropdownWidth} border border-grayscale-100 bg-white rounded-2xl px-2 py-1.5`}
      >
        <DropdownMenuList />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ScheduleDropdown;
