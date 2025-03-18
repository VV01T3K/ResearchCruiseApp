import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn, getErrors, groupBy } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { ContractDto, getContractCategoryName } from '@/cruise-applications/models/ContractDto';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';

export function FormAContractsSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'contracts', undefined, undefined, ContractDto[]>
  ): ColumnDef<ContractDto>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Kategoria',
        accessorFn: (row) => getContractCategoryName(row.category),
        cell: ({ row }) => (
          <form.Field
            name={`contracts[${row.index}].category`}
            children={(field) => getContractCategoryName(field.state.value)}
          />
        ),
        size: 80,
      },
      {
        header: 'Instytucja',
        accessorFn: (row) => `${row.institutionName}, ${row.institutionUnit}, ${row.institutionLocalization}`,
        cell: ({ row }) => (
          <>
            <form.Field
              name={`contracts[${row.index}].institutionName`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Nazwa instytucji"
                  placeholder='np. "Uniwersytet Gdański"'
                  required
                  disabled={isReadonly}
                />
              )}
            />
            <form.Field
              name={`contracts[${row.index}].institutionUnit`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Jednostka"
                  placeholder='np. "Wydział Biologii"'
                  required
                  disabled={isReadonly}
                />
              )}
            />
            <form.Field
              name={`contracts[${row.index}].institutionLocalization`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Lokalizacja instytucji"
                  placeholder='np. "Gdańsk"'
                  required
                  disabled={isReadonly}
                />
              )}
            />
          </>
        ),
      },
      {
        header: 'Opis',
        accessorFn: (row) => row.description,
        cell: ({ row }) => (
          <form.Field
            name={`contracts[${row.index}].description`}
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Opis"
                placeholder='np. "Umowa o współpracy"'
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
      },
      {
        header: 'Skan',
        accessorFn: (row) => row.scan,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`contracts[${row.index}].scan`}
            children={(field) => (
              <AppFileInput
                name={field.name}
                value={field.state.value}
                acceptedMimeTypes={['application/pdf']}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Skan"
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
      title="7. Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze"
      expandedByDefault
    >
      <div>
        <form.Field
          name="contracts"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AddNewContractButton key="contracts.add-new-btn" field={field} disabled={isReadonly} />,
                  <AddHistoricalContractButton
                    key="contracts.add-historical-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                emptyTableMessage="Nie dodano żadnej umowy."
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

type AddHistoricalContractButtonProps = {
  field: FieldApi<FormADto, 'contracts', undefined, undefined, ContractDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddHistoricalContractButton({ field, initValues, disabled }: AddHistoricalContractButtonProps) {
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
          Dodaj historyczną umowę
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
              initValues.historicalContracts.filter((contract) =>
                JSON.stringify(Object.values(contract)).toLowerCase().includes(searchValue.toLowerCase())
              ),
              (x) => x.category
            ).map(([category, contracts]) => (
              <React.Fragment key={category}>
                <div className="w-full rounded-lg text-center text-gray-500 text-sm px-2 my-2">
                  {getContractCategoryName(category as ContractDto['category'])}
                </div>
                {contracts.map((task) => (
                  <AppButton
                    key={`contracts.add-historical-btn.${JSON.stringify(task)}`}
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
                    {task.institutionName}, {task.institutionUnit}, {task.institutionLocalization} - {task.description}
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

type AddNewContractButtonProps = {
  field: FieldApi<FormADto, 'contracts', undefined, undefined, ContractDto[]>;
  disabled?: boolean;
};
function AddNewContractButton({ field, disabled }: AddNewContractButtonProps) {
  const [expanded, setExpanded] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useOutsideClickDetection({
    refs: [elementRef, dropdownRef],
    onOutsideClick: () => {
      setExpanded(false);
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
          Dodaj nowy kontrakt
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            {[
              { name: 'Krajowa', category: 'domestic' },
              { name: 'Międzynarodowa', category: 'international' },
            ].map(({ name, category }) => (
              <AppButton
                key={`researchTasks.add-new-btn.${category}`}
                onClick={() => {
                  field.pushValue({
                    category: category as ContractDto['category'],
                    institutionName: '',
                    institutionUnit: '',
                    institutionLocalization: '',
                    description: '',
                    scan: undefined,
                  });
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
