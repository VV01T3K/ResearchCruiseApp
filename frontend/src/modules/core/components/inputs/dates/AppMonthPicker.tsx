import ChevronLeftIcon from 'bootstrap-icons/icons/chevron-left.svg?react';
import ChevronRightIcon from 'bootstrap-icons/icons/chevron-right.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

type Props = {
  selectedDate: Date | undefined;
  onSelectMonth: (date: Date) => void;
};
export function AppMonthPicker({ selectedDate, onSelectMonth }: Props) {
  const [visibleYear, setVisibleYear] = React.useState<number>(() => new Date().getFullYear());

  function handleSelectMonth(index: number) {
    const date = new Date(visibleYear, index);
    onSelectMonth(date);
  }

  return (
    <>
      <div className="grid grid-cols-5 items-center px-2 py-2">
        <AppButton
          variant="plain"
          onClick={() => setVisibleYear((prev) => prev - 1)}
          className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </AppButton>
        <span className="font-bold col-span-3 inline-flex gap-2 justify-center items-center">{visibleYear}</span>
        <AppButton
          variant="plain"
          onClick={() => setVisibleYear((prev) => prev + 1)}
          className="w-full rounded-lg grid place-items-center hover:bg-gray-100"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </AppButton>
      </div>
      <div className="grid grid-cols-3 gap-4 px-4 py-2">
        {months.map((month, index) => (
          <AppButton
            key={month}
            variant="plain"
            onClick={() => handleSelectMonth(index)}
            className={cn(
              selectedDate?.getFullYear() === visibleYear && selectedDate?.getMonth() === index
                ? 'text-primary-500 font-bold'
                : '',
              'rounded-lg grid place-items-center hover:bg-gray-100'
            )}
          >
            {month}
          </AppButton>
        ))}
      </div>
    </>
  );
}
