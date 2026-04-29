import type { AnyFieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/utils';
import { useFormC } from '@/contexts/applications/FormCContext';
import { ResearchAreaDescriptionDto } from '@/api/dto/applications/ResearchAreaDescriptionDto';
import { getResearchAreaName } from '@/api/dto/applications/ResearchAreaDto';

import { CruiseApplicationDropdownElementSelectorButton } from '../common/CruiseApplicationDropdownElementSelectorButton';

export function FormCResearchAreaSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  function getColumns(field: AnyFieldApi): ColumnDef<ResearchAreaDescriptionDto>[] {
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
                    field.state.value ??
                    getResearchAreaName(formAInitValues.researchAreas, row.original.areaId ?? '') ??
                    ''
                  }
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  placeholder="Nazwa rejonu"
                  disabled={isReadonly}
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
                field.handleChange((prev: ResearchAreaDescriptionDto[]) => prev);
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
    <AppAccordion title="5. Rejony prowadzenia badań" expandedByDefault data-testid="form-c-research-area-section">
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
                  options={formAInitValues.researchAreas.concat([{ id: '', name: 'Inne...' }]).map((area) => ({
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
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            />
            <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
          </>
        )}
      />
    </AppAccordion>
  );
}
