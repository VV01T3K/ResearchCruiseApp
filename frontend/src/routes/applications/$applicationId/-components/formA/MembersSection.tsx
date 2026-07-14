import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { withForm } from '@/lib/form';
import type { FormAViewModel } from '@/routes/applications/$applicationId/-models/formA-view-model';
import { formADefaultValues } from '@/routes/applications/$applicationId/-schemas/formA.schema';
import { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

export const MembersSection = withForm({
  defaultValues: formADefaultValues,
  props: {} as { context: FormAViewModel },
  render: function MembersSection({ form, context }) {
    const { isReadonly, initValues } = context;

    function getUgTeamsColumns(
      notifyRowsChanged: () => void,
      removeRow: (index: number) => void
    ): ColumnDef<UgTeamValues>[] {
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
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
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
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
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
                  removeRow(row.index);
                }}
                disabled={isReadonly}
              />
            </div>
          ),
          size: 5,
        },
      ];
    }

    function getGuestTeams(
      notifyRowsChanged: () => void,
      removeRow: (index: number) => void
    ): ColumnDef<GuestTeamValues>[] {
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
            <form.AppField
              name={`guestTeams[${row.index}].name`}
              children={(field) => (
                <field.TextField containerClassName="mx-4" showRequiredAsterisk disabled={isReadonly} />
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
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta)}
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
                  removeRow(row.index);
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
                  columns={getUgTeamsColumns(
                    () => field.handleChange((prev) => prev),
                    (index) => {
                      field.removeValue(index);
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                    }
                  )}
                  data={field.state.value}
                  showRequiredAsterisk
                  buttons={() => [
                    <DropdownElementSelectorButton
                      key="new"
                      options={initValues.ugUnits.map((unit) => ({
                        value: unit.name,
                        content: unit.name,
                        onClick: () => {
                          field.pushValue({
                            ugUnitId: unit.id,
                            noOfEmployees: 0,
                            noOfStudents: 0,
                          });
                          field.handleChange((prev: UgTeamValues[]) => prev);
                          field.handleBlur();
                        },
                      }))}
                      variant="primaryOutline"
                      disabled={isReadonly}
                      data-testid="form-a-add-ug-unit-btn"
                    >
                      Dodaj jednostkę UG
                    </DropdownElementSelectorButton>,
                  ]}
                  emptyTableMessage="Nie dodano żadnego zespołu."
                  variant="form"
                  disabled={isReadonly}
                  errors={getErrors(field.state.meta)}
                  data-testid="form-a-ug-teams-table"
                />
                <AppInputErrorsList errors={getErrors(field.state.meta)} data-testid="form-a-ug-teams-errors" />
              </div>
            )}
          />
          <form.Field
            name="guestTeams"
            mode="array"
            children={(field) => (
              <div>
                <AppTable
                  columns={getGuestTeams(
                    () => field.handleChange((prev) => prev),
                    (index) => {
                      field.removeValue(index);
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                    }
                  )}
                  data={field.state.value}
                  buttons={() => [
                    <AppButton
                      key="new"
                      variant="primary"
                      onClick={() => {
                        field.pushValue({ name: '', noOfPersons: 0 });
                        field.handleChange((prev: GuestTeamValues[]) => prev);
                        field.handleBlur();
                      }}
                      className="flex items-center gap-4"
                      disabled={isReadonly}
                      data-testid="form-a-add-guest-team-btn"
                    >
                      Dodaj nowy zespół
                    </AppButton>,
                    <DropdownElementSelectorButton
                      key="historical"
                      options={initValues.historicalGuestInstitutions.map((institution) => ({
                        value: institution,
                        onClick: () => {
                          field.pushValue({ name: institution, noOfPersons: 0 });
                          field.handleChange((prev: GuestTeamValues[]) => prev);
                          field.handleBlur();
                        },
                      }))}
                      variant="primaryOutline"
                      disabled={isReadonly}
                      data-testid="form-a-add-historical-team-btn"
                    >
                      Dodaj historyczny zespół
                    </DropdownElementSelectorButton>,
                  ]}
                  emptyTableMessage="Nie dodano żadnego zespołu."
                  variant="form"
                  disabled={isReadonly}
                  errors={getErrors(field.state.meta)}
                  data-testid="form-a-guest-teams-table"
                />
                <AppInputErrorsList errors={getErrors(field.state.meta)} data-testid="form-a-guest-teams-errors" />
              </div>
            )}
          />
        </div>
      </AppAccordion>
    );
  },
});
