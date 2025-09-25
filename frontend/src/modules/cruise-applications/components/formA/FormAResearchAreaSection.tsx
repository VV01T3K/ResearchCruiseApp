import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormADto } from '@/cruise-applications/models/FormADto';
import { ResearchAreaDescriptionDto } from '@/cruise-applications/models/ResearchAreaDescriptionDto';
import { getResearchAreaName } from '@/cruise-applications/models/ResearchAreaDto';

import { CruiseApplicationDropdownElementSelectorButton } from '../common/CruiseApplicationDropdownElementSelectorButton';

export function FormAResearchAreaSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getColumns(
    field: FieldApi<FormADto, 'researchAreaDescriptions', undefined, undefined, ResearchAreaDescriptionDto[]>
  ): ColumnDef<ResearchAreaDescriptionDto>[] {
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
      },
      {
        header: 'Rejon prowadzenia badań',
        cell: ({ row }) => (
          <>
            <form.Field
              name={`researchAreaDescriptions[${row.index}].areaId`}
              children={(field) => <input type="hidden" name={field.name} value="" readOnly />}
            />
            <form.Field
              listeners={{
                onChange: () => {
                  form.setFieldValue(`researchAreaDescriptions[${row.index}].areaId`, null);
                },
              }}
              name={`researchAreaDescriptions[${row.index}].differentName`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={
                    field.state.value ?? getResearchAreaName(initValues.researchAreas, row.original.areaId ?? '') ?? ''
                  }
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  placeholder="Nazwa rejonu"
                  disabled={isReadonly}
                  required
                />
              )}
            />
          </>
        ),
        size: 30,
      },
      {
        header: 'Informacje dodatkowe',
        cell: ({ row }) => (
          <form.Field
            name={`researchAreaDescriptions[${row.index}].info`}
            children={(field) => (
              <AppInput
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                placeholder={isReadonly ? '' : 'np. szczegóły dotyczące celu rejsu'}
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
        size: 5,
      },
    ];
  }

  return (
    <AppAccordion title="4. Rejony prowadzenia badań" expandedByDefault>
      <form.Field
        name="researchAreaDescriptions"
        mode="array"
        children={(field) => (
          <>
            <AppTable
              columns={getColumns(field)}
              data={field.state.value}
              buttons={() => [
                <CruiseApplicationDropdownElementSelectorButton
                  key="new"
                  options={initValues.researchAreas.concat([{ id: '', name: 'Inne...' }]).map((area) => ({
                    value: area.name,
                    onClick: () => {
                      field.pushValue({
                        areaId: area.id != '' ? area.id : null,
                        differentName: area.id != '' ? null : '',
                        info: '',
                      });
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                    },
                  }))}
                  variant="primary"
                  disabled={isReadonly}
                >
                  Dodaj rejon
                </CruiseApplicationDropdownElementSelectorButton>,
              ]}
              emptyTableMessage="Nie dodano żadnego rejonu."
              variant="form"
              disabled={isReadonly}
            />
            <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
          </>
        )}
      />
    </AppAccordion>
  );
}
