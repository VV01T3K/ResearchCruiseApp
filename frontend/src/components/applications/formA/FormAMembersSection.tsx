import type { AnyFieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/components/applications/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormA } from '@/contexts/applications/FormAContext';
import { GuestTeamDto } from '@/api/dto/applications/GuestTeamDto';
import { UGTeamDto } from '@/api/dto/applications/UGTeamDto';

export function FormAMembersSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  function getUgTeamsColumns(field: AnyFieldApi): ColumnDef<UGTeamDto>[] {
    const tableField = field;
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
      },
      {
        header: 'Jednostka',
        accessorFn: (row) => row.ugUnitId,
        cell: ({ row }) => initValues.ugUnits.find((unit) => unit.id === row.original.ugUnitId)?.name,
        size: 50,
        enableColumnFilter: false,
        enableSorting: false,
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
                  tableField.handleChange((prev: UGTeamDto[]) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
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
                  tableField.handleChange((prev: UGTeamDto[]) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AppTableDeleteRowButton
              onClick={() => {
                field.removeValue(row.index);
                field.handleChange((prev: UGTeamDto[]) => prev);
                field.handleBlur();
                tableField.handleChange((prev: UGTeamDto[]) => prev);
              }}
              disabled={isReadonly}
            />
          </div>
        ),
        size: 5,
      },
    ];
  }

  function getGuestTeams(field: AnyFieldApi): ColumnDef<GuestTeamDto>[] {
    const tableField = field;
    return [
      {
        header: 'Lp.',
        cell: ({ row }) => `${row.index + 1}. `,
        size: 5,
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
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 70,
        enableColumnFilter: false,
        enableSorting: false,
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
                  tableField.handleChange((prev: GuestTeamDto[]) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AppTableDeleteRowButton
              onClick={() => {
                field.removeValue(row.index);
                field.handleChange((prev: GuestTeamDto[]) => prev);
                field.handleBlur();
                tableField.handleChange((prev: GuestTeamDto[]) => prev);
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
    <AppAccordion
      title="8. Zespoły badawcze, które miałyby uczestniczyć w rejsie"
      expandedByDefault
      data-testid="form-a-members-section"
    >
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        <form.Field
          name="ugTeams"
          mode="array"
          children={(field) => (
            <div className="mt-auto">
              <AppTable
                columns={getUgTeamsColumns(field)}
                data={field.state.value}
                showRequiredAsterisk
                buttons={() => [
                  <CruiseApplicationDropdownElementSelectorButton
                    key="new"
                    options={initValues.ugUnits.map((unit) => ({
                      value: unit.name,
                      content: unit.name,
                      onClick: () => {
                        field.pushValue({ ugUnitId: unit.id, noOfEmployees: '0', noOfStudents: '0' });
                        field.handleChange((prev: UGTeamDto[]) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                    data-testid="form-a-add-ug-unit-btn"
                  >
                    Dodaj jednostkę UG
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                data-testid="form-a-ug-teams-table"
              />
              <AppInputErrorsList
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                data-testid="form-a-ug-teams-errors"
              />
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
                    key="new"
                    variant="primary"
                    onClick={() => {
                      field.pushValue({ name: '', noOfPersons: '0' });
                      field.handleChange((prev: GuestTeamDto[]) => prev);
                      field.handleBlur();
                    }}
                    className="flex items-center gap-4"
                    disabled={isReadonly}
                    data-testid="form-a-add-guest-team-btn"
                  >
                    Dodaj nowy zespół
                  </AppButton>,
                  <CruiseApplicationDropdownElementSelectorButton
                    key="historical"
                    options={initValues.historicalGuestInstitutions.map((institution) => ({
                      value: institution,
                      onClick: () => {
                        field.pushValue({ name: institution, noOfPersons: '0' });
                        field.handleChange((prev: GuestTeamDto[]) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                    data-testid="form-a-add-historical-team-btn"
                  >
                    Dodaj historyczny zespół
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                data-testid="form-a-guest-teams-table"
              />
              <AppInputErrorsList
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                data-testid="form-a-guest-teams-errors"
              />
            </div>
          )}
        />
      </div>
    </AppAccordion>
  );
}
