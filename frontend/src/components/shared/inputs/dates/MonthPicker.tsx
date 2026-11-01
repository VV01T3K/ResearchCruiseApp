import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import React from 'react';

import { Button } from '@/components/shared/Button';
import { months } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';

type Props = {
  selectedDate: Date | undefined;
  onSelectMonth: (date: Date) => void;
};
export function MonthPicker({ selectedDate, onSelectMonth }: Props) {
  const [visibleYear, setVisibleYear] = React.useState<number>(() => (selectedDate ?? new Date()).getFullYear());

  function handleSelectMonth(index: number) {
    const date = new Date(visibleYear, index);
    onSelectMonth(date);
  }

  return (
    <>
      <div className="grid grid-cols-5 items-center px-2 py-2">
        <Button
          variant="plain"
          onClick={() => setVisibleYear((prev) => prev - 1)}
          className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
        >
          <CaretLeftIcon className="h-5 w-5" />
        </Button>
        <span className="col-span-3 inline-flex items-center justify-center gap-2 font-bold">{visibleYear}</span>
        <Button
          variant="plain"
          onClick={() => setVisibleYear((prev) => prev + 1)}
          className="grid w-full place-items-center rounded-lg hover:bg-gray-100"
        >
          <CaretRightIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 px-4 py-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant="plain"
            onClick={() => handleSelectMonth(index)}
            className={cn(
              selectedDate?.getFullYear() === visibleYear && selectedDate?.getMonth() === index
                ? 'text-primary-500 font-bold'
                : '',
              'grid place-items-center rounded-lg hover:bg-gray-100'
            )}
          >
            {month}
          </Button>
        ))}
      </div>
    </>
  );
}
