import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import SearchIcon from 'bootstrap-icons/icons/search.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { useDropdown } from '@/core/hooks/DropdownHook';
import { useOutsideClickDetection } from '@/core/hooks/OutsideClickDetectionHook';
import { cn, getErrors, groupBy } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { FormAInitValuesDto } from '@/cruise-applications/models/FormAInitValuesDto';
import {
  getPublicationCategoryLabel,
  PublicationCategory,
  PublicationDto,
} from '@/cruise-applications/models/PublicationDto';

export function FormAPublicationsSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'publications', undefined, undefined, PublicationDto[]>
  ): ColumnDef<PublicationDto>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 20,
      },
      {
        header: 'Kategoria',
        accessorFn: (row) => row.category,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`publications[${row.index}].category`}
            children={(field) => (
              <AppDropdownInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange as (value: string) => void}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                allOptions={Object.values(PublicationCategory).map((role) => ({
                  value: role,
                  inlineLabel: getPublicationCategoryLabel(role),
                }))}
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 100,
      },
      {
        header: 'Informacje',
        accessorFn: (row) => `${row.doi}, ${row.authors}, ${row.title}, ${row.magazine}`,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <form.Field
              name={`publications[${row.index}].doi`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="DOI"
                  placeholder='np. "10.1016/j.jmarsys.2019.03.007"'
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`publications[${row.index}].authors`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Autorzy"
                  placeholder='np. "Kowalski J., Nowak A."'
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`publications[${row.index}].title`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Tytuł"
                  placeholder='np. "The impact of sea level rise on the coastal zone"'
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`publications[${row.index}].magazine`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Czasopismo"
                  placeholder='np. "Journal of Marine Systems"'
                  required
                  disabled={isReadonly}
                />
              )}
            />
          </div>
        ),
      },
      {
        header: 'Rok wydania',
        accessorFn: (row) => row.year,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`publications[${row.index}].year`}
            children={(field) => (
              <AppYearPickerInput
                name={field.name}
                value={field.state.value ? parseInt(field.state.value) : undefined}
                onChange={(e) => field.handleChange(e?.toString() ?? '')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Rok"
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 80,
      },
      {
        header: 'Punkty ministerialne',
        accessorFn: (row) => row.ministerialPoints,
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <form.Field
            name={`publications[${row.index}].ministerialPoints`}
            children={(field) => (
              <AppNumberInput
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                step={10}
                onChange={(x: number) => field.handleChange(x.toString())}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Punkty"
                required
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 80,
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
        size: 20,
      },
    ];
  }

  return (
    <AppAccordion title="9. Publikacje" expandedByDefault>
      <header className="text-center space-y-4 mb-8 max-w-2xl mx-auto">
        <h3 className="text-xl">
          Publikacje kategorii <span className="font-semibold">temat</span>
        </h3>
        <p className="text-sm">
          Publikacje z ubiegłych 5 lat związane <span className="font-semibold">bezpośrednio</span> tematycznie z
          zadaniami do realizacji na planowanym rejsie{' '}
          <span className="font-semibold">
            opublikowane przez zespoł zaangażowany w realizację rejsu – z afiliacją UG.
          </span>
        </p>
        <h3 className="text-xl">
          Publikacje kategorii <span className="font-semibold">dopisek</span>
        </h3>
        <p className="text-sm">
          Publikacje autorstwa zespołu zaangażowanego w realizację rejsu, ALE zawierające dopisek w treści publikacji (w
          wersji angielskiej lub w innym języku):{' '}
          <span className="font-semibold">
            „…the research/study was conducted onboard r/v Oceanograf (the research vessel owned by the University of
            Gdańsk)…”
          </span>
          ,
          <span className="font-semibold">
            „… samples for the present study were collected during a research cruise onboard r/v Oceanograf…”{' '}
          </span>
          lub podobny, ale wskazujący jednoznacznie, że badania w ramach niniejszej publikacji były prowadzone z pokładu
          jednostki RV Oceanograf.
        </p>
      </header>
      <div>
        <form.Field
          name="publications"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <AddNewPublicationButton key="publications.add-new-btn" field={field} disabled={isReadonly} />,
                  <AddHistoricalPublicationButton
                    key="publications.add-historical-btn"
                    field={field}
                    initValues={initValues}
                    disabled={isReadonly}
                  />,
                ]}
                variant="form"
                disabled={isReadonly}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} />
            </>
          )}
        />
      </div>
    </AppAccordion>
  );
}

type AddHistoricalPublicationButtonProps = {
  field: FieldApi<FormADto, 'publications', undefined, undefined, PublicationDto[]>;
  initValues: FormAInitValuesDto;
  disabled?: boolean;
};
function AddHistoricalPublicationButton({ field, initValues, disabled }: AddHistoricalPublicationButtonProps) {
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
          Dodaj historyczną publikację
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            <div className="sticky top-0">
              <SearchIcon className="w-5 h-5 absolute z-10 right-5 top-2.5" />
              <AppInput
                name="publications.add-historical-btn.search"
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Szukaj..."
                autoFocus
              />
            </div>
            {groupBy(
              initValues.historicalPublications.filter((publication) =>
                JSON.stringify(Object.values(publication)).toLowerCase().includes(searchValue.toLowerCase())
              ),
              (x) => x.category
            ).map(([category, publications]) => (
              <React.Fragment key={category}>
                <div className="w-full rounded-lg text-center text-gray-500 text-sm px-2 my-2">
                  {name[category as keyof typeof name]}
                </div>
                {publications.map((publication) => (
                  <div
                    key={`publications.add-historical-btn.${JSON.stringify(publication)}`}
                    onClick={() => {
                      field.pushValue(publication);
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                      field.form.validateAllFields('blur');
                      field.form.validateAllFields('change');
                      setExpanded(false);
                    }}
                    className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2 cursor-pointer"
                  >
                    <div>
                      <strong>DOI:</strong> {publication.doi}
                    </div>
                    <div>
                      <strong>Autorzy:</strong> {publication.authors}
                    </div>
                    <div>
                      <strong>Tytuł:</strong> {publication.title}
                    </div>
                    <div>
                      <strong>Czasopismo:</strong> {publication.magazine}
                    </div>
                    <div>
                      <strong>Rok:</strong> {publication.year}
                    </div>
                  </div>
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

type AddNewPublicationButtonProps = {
  field: FieldApi<FormADto, 'publications', undefined, undefined, PublicationDto[]>;
  disabled?: boolean;
};
function AddNewPublicationButton({ field, disabled }: AddNewPublicationButtonProps) {
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
          Dodaj nową publikację
          {expanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </AppButton>
      </div>

      <AnimatePresence>
        {expanded && (
          <Modal dropdownRef={dropdownRef} elementRef={elementRef}>
            {Object.values(PublicationCategory)
              .map((role) => ({
                category: role,
                name: getPublicationCategoryLabel(role),
              }))
              .map(({ name, category }) => (
                <AppButton
                  key={`publications.add-new-btn.${category}`}
                  onClick={() => {
                    field.pushValue({
                      id: '',
                      category: category as PublicationDto['category'],
                      doi: '',
                      authors: '',
                      title: '',
                      magazine: '',
                      year: '',
                      ministerialPoints: '0',
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
