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
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn, getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import { GuestTeamDto } from '@/cruise-applications/models/GuestTeamDto';
import { UGTeamDto } from '@/cruise-applications/models/UGTeamDto';

export function FormAMembersSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getUgTeamsColumns(
    field: FieldApi<FormADto, 'ugTeams', undefined, undefined, UGTeamDto[]>
  ): ColumnDef<UGTeamDto>[] {
    const tableField = field;
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Jednostka',
        accessorFn: (row) => row.ugUnitId,
        cell: ({ row }) => initValues.ugUnits.find((unit) => unit.id === row.original.ugUnitId)?.name,
      },
      {
        header: 'Liczba pracowników',
        accessorFn: (row) => row.noOfEmployees,
        cell: ({ row }) => (
          <form.Field
            name={`ugTeams[${row.index}].noOfEmployees`}
            children={(field) => (
              <AppNumberInput
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
      },
      {
        header: 'Liczba studentów',
        accessorFn: (row) => row.noOfStudents,
        cell: ({ row }) => (
          <form.Field
            name={`ugTeams[${row.index}].noOfStudents`}
            children={(field) => (
              <AppNumberInput
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
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
                tableField.handleChange((prev) => prev);
              }}
              disabled={isReadonly}
            />
          </div>
        ),
        size: 10,
      },
    ];
  }

  function getGuestTeams(
    field: FieldApi<FormADto, 'guestTeams', undefined, undefined, GuestTeamDto[]>
  ): ColumnDef<GuestTeamDto>[] {
    const tableField = field;
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Instytucja',
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <form.Field
            name={`guestTeams[${row.index}].name`}
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                containerClassName="mx-4"
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
      },
      {
        header: 'Liczba osób',
        accessorFn: (row) => row.noOfPersons,
        cell: ({ row }) => (
          <form.Field
            name={`guestTeams[${row.index}].noOfPersons`}
            children={(field) => (
              <AppNumberInput
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
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
                tableField.handleChange((prev) => prev);
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
    <AppAccordion title="8. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form.Field
          name="ugTeams"
          mode="array"
          children={(field) => (
            <div>
              <AppTable
                columns={getUgTeamsColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AddUGTeamButton
                    key="ugTeams.add-ug-unit-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </div>
          )}
        />
        <form.Field
          name="guestTeams"
          mode="array"
          children={(field) => (
            <div>
              <AppTable
                columns={getGuestTeams(field)}
                data={field.state.value}
                buttons={() => [
                  <AppButton
                    key="guestTeams.add-new-btn"
                    variant="primary"
                    onClick={() => {
                      field.pushValue({ name: '', noOfPersons: '0' });
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                      field.form.validateAllFields('blur');
                      field.form.validateAllFields('change');
                    }}
                    className="flex items-center gap-4"
                    disabled={isReadonly}
                  >
                    Dodaj nowy zespół
                  </AppButton>,
                  <AddHistoricalGuestTeamButton
                    key="guestTeams.add-historical-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
            </div>
          )}
        />
      </div>
    </AppAccordion>
  );
}

type AddUGTeamButtonProps = {
  field: FieldApi<FormADto, 'ugTeams', undefined, undefined, UGTeamDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddUGTeamButton({ field, initValues, disabled }: AddUGTeamButtonProps) {
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
          Dodaj jednostkę UG
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="sticky top-0">
              <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
              <AppInput
                name="ugTeams.add-ug-unit-btn.search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Szukaj..."
                autoFocus
              />
            </div>
            {initValues.ugUnits
              .filter((unit) => unit.name.toLowerCase().includes(searchValue.toLowerCase()))
              .map((unit) => (
                <AppButton
                  key={`ugTeams.add-ug-unit-btn.${unit.id}`}
                  onClick={() => {
                    field.pushValue({ ugUnitId: unit.id, noOfEmployees: '0', noOfStudents: '0' });
                    field.handleChange((prev) => prev);
                    field.handleBlur();
                    field.form.validateAllFields('blur');
                    field.form.validateAllFields('change');
                    setExpanded(false);
                  }}
                  variant="plain"
                  className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2"
                >
                  {unit.name}
                </AppButton>
              ))}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

type AddHistoricalGuestTeamButtonProps = {
  field: FieldApi<FormADto, 'guestTeams', undefined, undefined, GuestTeamDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddHistoricalGuestTeamButton({ field, initValues, disabled }: AddHistoricalGuestTeamButtonProps) {
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
          Dodaj historyczny zespół
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="sticky top-0">
              <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
              <AppInput
                name="guestTeams.add-historical-btn.search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Szukaj..."
                autoFocus
              />
            </div>
            {initValues.historicalGuestInstitutions.map((guestInstitution) => (
              <AppButton
                key={`guestTeams.add-historical-btn.${guestInstitution}`}
                onClick={() => {
                  field.pushValue({ name: guestInstitution, noOfPersons: '0' });
                  field.handleChange((prev) => prev);
                  field.handleBlur();
                  field.form.validateAllFields('blur');
                  field.form.validateAllFields('change');
                  setExpanded(false);
                }}
                variant="plain"
                className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2"
              >
                {guestInstitution}
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
      style={{ top: top, left: left, width }}
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
