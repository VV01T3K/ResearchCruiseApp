import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors, groupBy } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
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
        size: 5,
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
        size: 10,
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
        size: 50,
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
        size: 10,
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
        size: 10,
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
        size: 5,
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
                  <CruiseApplicationDropdownElementSelectorButton
                    key="new"
                    options={Object.values(PublicationCategory).map((role) => ({
                      value: getPublicationCategoryLabel(role),
                      onClick: () => {
                        field.pushValue({
                          id: '',
                          category: role,
                          doi: '',
                          authors: '',
                          title: '',
                          magazine: '',
                          year: '',
                          ministerialPoints: '0',
                        });
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primary"
                    disabled={isReadonly}
                  >
                    Dodaj nową publikację
                  </CruiseApplicationDropdownElementSelectorButton>,
                  <CruiseApplicationDropdownElementSelectorButton
                    key="historical"
                    options={groupBy(initValues.historicalPublications, (x) => x.category).flatMap(
                      ([category, publications]) => [
                        ...[
                          {
                            value: category,
                            content: (
                              <div className="w-full rounded-lg text-center text-gray-500 text-sm px-2 my-2">
                                {getPublicationCategoryLabel(category as PublicationCategory)}
                              </div>
                            ),
                          },
                        ],
                        ...publications.map((publication) => ({
                          value: JSON.stringify(publication),
                          content: (
                            <div className="w-full rounded-lg hover:bg-gray-100 focus:inset-ring-2 inset-ring-blue-500 px-2 cursor-pointer">
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
                          ),
                          onClick: () => {
                            field.pushValue(publication);
                            field.handleChange((prev) => prev);
                            field.handleBlur();
                          },
                        })),
                      ]
                    )}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczną publikację
                  </CruiseApplicationDropdownElementSelectorButton>,
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
