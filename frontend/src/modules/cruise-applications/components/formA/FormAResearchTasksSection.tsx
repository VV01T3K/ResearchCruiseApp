import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn, getErrors, groupBy } from '@/core/lib/utils';
import { ResearchTaskDetails } from '@/cruise-applications/components/formA/research-task-details/ResearchTaskDetails';
import { ResearchTaskThumbnail } from '@/cruise-applications/components/research-task-thumbnails/ResearchTaskThumbnail';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import {
  getEmptyTask,
  getTaskName,
  ResearchTaskDto,
  ResearchTaskType,
  taskTypes,
} from '@/cruise-applications/models/ResearchTaskDto';

export function FormAResearchTasksSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'researchTasks', undefined, undefined, ResearchTaskDto[]>
  ): ColumnDef<ResearchTaskDto>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Zadanie',
        accessorFn: (row) => getTaskName(row.type),
        cell: ({ row }) => (
          <form.Field
            key={row.index}
            name={`researchTasks[${row.index}].type`}
            children={(field) => getTaskName(field.state.value) ?? 'Nieznany typ'}
          />
        ),
        size: 25,
      },
      {
        header: 'Szczegóły',
        cell: ({ row }) => (
          <ResearchTaskDetails
            form={form}
            row={row}
            disabled={isReadonly}
            hasFormBeenSubmitted={hasFormBeenSubmitted}
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
    <AppAccordion title="6. Zadania do zrealizowania w trakcie rejsu" expandedByDefault>
      <div>
        <form.Field
          name="researchTasks"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AddNewResearchTaskButton key="researchTasks.add-new-btn" field={field} disabled={isReadonly} />,
                  <AddHistoricalResearchTaskButton
                    key="researchTasks.add-historical-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                emptyTableMessage="Nie dodano żadnego zadania."
                variant="form"
                disabled={isReadonly}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}

type AddHistoricalResearchTaskButtonProps = {
  field: FieldApi<FormADto, 'researchTasks', undefined, undefined, ResearchTaskDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddHistoricalResearchTaskButton({ field, initValues, disabled }: AddHistoricalResearchTaskButtonProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
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
            <div className="sticky top-0">
              <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
              <AppInput
                name="researchTasks.add-historical-btn.search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Szukaj..."
                autoFocus
              />
            </div>
            {groupBy(
              initValues.historicalResearchTasks.filter((task) =>
                JSON.stringify(Object.values(task)).toLowerCase().includes(searchValue.toLowerCase())
              ),
              (x) => x.type
            ).map(([type, tasks]) => (
              <React.Fragment key={type}>
                <div className="w-full rounded-lg text-center text-gray-500 text-sm px-2 my-2">
                  {getTaskName(type as ResearchTaskType)}
                </div>
                {tasks.map((task) => (
                  <AppButton
                    key={`researchTasks.add-historical-btn.${JSON.stringify(task)}`}
                    onClick={() => {
                      field.pushValue(task);
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                      field.form.validateAllFields('blur');
                      field.form.validateAllFields('change');
                      setExpanded(false);
                    }}
                    variant="plain"
                    className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2"
                  >
                    <ResearchTaskThumbnail task={task} />
                  </AppButton>
                ))}
                <hr className="text-gray-200 h-0.5" />
              </React.Fragment>
            ))}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type AddNewResearchTaskButtonProps = {
  field: FieldApi<FormADto, 'researchTasks', undefined, undefined, ResearchTaskDto[]>;
  disabled?: boolean;
};
function AddNewResearchTaskButton({ field, disabled }: AddNewResearchTaskButtonProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOutsideClickDetection({
    refs: [elementRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
      setSearchValue('');
    },
  });

  return (
    <>
      <div ref={elementRef}>
        <AppButton
          variant="primary"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-4"
          disabled={disabled}
        >
          Dodaj nowe zadanie
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="sticky top-0">
              <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
              <AppInput
                name="researchTasks.add-new-btn.search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Szukaj..."
                autoFocus
              />
            </div>
            {taskTypes
              .map((type) => ({
                name: getTaskName(type),
                type,
              }))
              .filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase()))
              .map(({ name, type }) => (
                <AppButton
                  key={`researchTasks.add-new-btn.${type}`}
                  onClick={() => {
                    field.pushValue(getEmptyTask(type));
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                    field.form.validateAllFields('blur');
                    field.form.validateAllFields('change');
                    setExpanded(false);
                  }}
                  variant="plain"
                  className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2"
                >
                  {name}
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
        'fixed origin-top-right w-(--width) rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden z-50 max-h-96 overflow-y-auto'
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
