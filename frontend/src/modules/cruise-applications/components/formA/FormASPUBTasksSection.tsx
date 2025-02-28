import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn, getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { SpubTaskDto } from '@/cruise-applications/models/SpubTaskDto';

export function FormASPUBTasksSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'spubTasks', undefined, undefined, SpubTaskDto[]>
  ): ColumnDef<SpubTaskDto>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}.`,
        size: 10,
      },
      {
        header: 'Rok rozpoczęcia',
        accessorFn: (row) => row.yearFrom,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`spubTasks[${row.index}].yearFrom`}
            children={(field) => (
              <AppYearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 80,
      },
      {
        header: 'Rok zakończenia',
        accessorFn: (row) => row.yearTo,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`spubTasks[${row.index}].yearTo`}
            children={(field) => (
              <AppYearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 80,
      },
      {
        header: 'Nazwa zadania',
        accessorFn: (row) => row.name,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`spubTasks[${row.index}].name`}
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AppTableDeleteRowButton
              onClick={() => {
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
              }}
              disabled={isReadonly}
            />
          </div>
        ),
        size: 10,
      },
    ];
  }

  return (
    <AppAccordion
      title="10. Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
      expandedByDefault
    >
      <div>
        <form.Field
          name="spubTasks"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AppButton
                    key="spubTasks.add-new-btn"
                    onClick={() => {
                      field.pushValue({ name: '', yearFrom: '', yearTo: '' });
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                      field.form.validateAllFields('blur');
                      field.form.validateAllFields('change');
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj
                  </AppButton>,
                  <AddHistoricalSPUBTaskButton
                    key="spubTasks.add-historical-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                emptyTableMessage="Brak zadań SPUB"
                variant="form"
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}

type AddHistoricalSPUBTaskButtonProps = {
  field: FieldApi<FormADto, 'spubTasks', undefined, undefined, SpubTaskDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddHistoricalSPUBTaskButton({ field, initValues, disabled }: AddHistoricalSPUBTaskButtonProps) {
  const [expanded, setExpanded] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOutsideClickDetection({
    refs: [elementRef, dropdownRef],
    onOutsideClick: () => setExpanded(false),
  });

  return (
    <>
      <div ref={elementRef}>
        <AppButton
          variant="primaryOutline"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-4"
          disabled={disabled}
        >
          Dodaj historyczne zadanie
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            {initValues.historicalSpubTasks.map((spubTask) => (
              <AppButton
                key={`spubTasks.add-historical-btn.${JSON.stringify(spubTask)}`}
                onClick={() => {
                  field.pushValue(spubTask);
                  field.handleChange((prev) => prev);
                  field.handleBlur();
                  field.form.validateAllFields('blur');
                  field.form.validateAllFields('change');
                  setExpanded(false);
                }}
                variant="plain"
                className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2"
              >
                {spubTask.name} ({spubTask.yearFrom} - {spubTask.yearTo})
              </AppButton>
            ))}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type ModalProps = {
  elementRef: React.RefObject<HTMLDivElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;

  children: React.ReactNode;
};
function Modal({ elementRef, dropdownRef, children }: ModalProps) {
  const { top, left, width, direction } = useDropdown({
    openingItemRef: elementRef,
    dropdownRef,
    dropdownPosition: 'center',
    dropdownWidthMultiplier: 1.5,
  });

  return (
    <motion.div
      style={{ top: top, left: left, width: width }}
      className={cn(
        'fixed origin-top-right w-(--width) rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50 max-h-64 overflow-y-auto'
      )}
      ref={dropdownRef}
      initial={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      animate={{ opacity: 1, translateY: '0' }}
      exit={{ opacity: 0, translateY: direction === 'down' ? '-10%' : '10%' }}
      transition={{ ease: 'easeOut', duration: 0.2 }}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabIndex={-1}
    >
      {children}
    </motion.div>
  );
}
