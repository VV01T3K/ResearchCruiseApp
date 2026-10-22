import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { Popover } from '@base-ui/react/popover';
import React from 'react';

import { PickerPopup } from '@/components/inputs/dates/PickerPopup';
import { AppMonthPicker } from '@/components/shared/inputs/dates/AppMonthPicker';

type Props = {
  value: { month: number; year: number };
  onChange: ({ month, year }: { month: number; year: number }) => void;

  renderDate?: ({ month, year }: { month: number; year: number }) => React.ReactNode;
};
export function AppMonthPickerPopover({ value, onChange, renderDate }: Props) {
  const [expanded, setExpanded] = React.useState(false);

  function handleSelectMonth(newDate: Date) {
    onChange({ month: newDate.getMonth(), year: newDate.getFullYear() });
    setExpanded(false);
  }

  return (
    <Popover.Root open={expanded} onOpenChange={setExpanded} modal={false}>
      <div>
        <Popover.Trigger className="relative inline-flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-5 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          {renderDate
            ? renderDate(value)
            : new Date(value.year, value.month).toLocaleDateString('pl-PL', { month: '2-digit', year: 'numeric' })}
          <span className="flex gap-2">
            <span>{expanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}</span>
          </span>
        </Popover.Trigger>
      </div>
      <PickerPopup aria-label="Wybierz miesiąc">
        <AppMonthPicker selectedDate={new Date(value.year, value.month)} onSelectMonth={handleSelectMonth} />
      </PickerPopup>
    </Popover.Root>
  );
}
