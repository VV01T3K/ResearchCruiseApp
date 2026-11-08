import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { DropdownElementSelectorButton } from '@/features/applications/components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormAViewModel } from '@/features/applications/models/formA-view-model';
import { formADefaultValues } from '@/features/applications/schemas/formA.schema';
import { GuestTeamValues } from '@/features/applications/schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/features/applications/schemas/types/UgTeamValues';

export function MembersSection({ context }: { context: FormAViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formADefaultValues });
  const { isReadonly, initValues } = context;

  function getUgTeamsColumns(removeRow: (index: number) => void): ColumnDef<UgTeamValues>[] {
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
          <form.AppField name={`ugTeams[${row.index}].noOfEmployees`}>
            {(field) => (
              <field.NumberField
                aria-label={`Liczba pracowników, wiersz ${row.index + 1}`}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: 'Liczba studentów',
        accessorFn: (row) => row.noOfStudents,
        cell: ({ row }) => (
          <form.AppField name={`ugTeams[${row.index}].noOfStudents`}>
            {(field) => (
              <field.NumberField
                aria-label={`Liczba studentów, wiersz ${row.index + 1}`}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Akcje</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableDeleteRowButton
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

  function getGuestTeams(removeRow: (index: number) => void): ColumnDef<GuestTeamValues>[] {
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
          <form.AppField name={`guestTeams[${row.index}].name`}>
            {(field) => (
              <field.TextField
                aria-label={`Instytucja, wiersz ${row.index + 1}`}
                containerClassName="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 70,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        header: 'Liczba osób',
        accessorFn: (row) => row.noOfPersons,
        cell: ({ row }) => (
          <form.AppField name={`guestTeams[${row.index}].noOfPersons`}>
            {(field) => (
              <field.NumberField
                aria-label={`Liczba osób, wiersz ${row.index + 1}`}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                showRequiredAsterisk
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
        enableColumnFilter: false,
        enableSorting: false,
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Akcje</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TableDeleteRowButton
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
    <Accordion title="8. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        <form.AppField name="ugTeams" mode="array">
          {(field) => (
            <div className="mt-auto">
              <Table
                className="md:-mt-2"
                columns={getUgTeamsColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
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
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj jednostkę UG
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </div>
          )}
        </form.AppField>
        <form.AppField name="guestTeams" mode="array">
          {(field) => (
            <div>
              <Table
                className="md:-mt-2"
                columns={getGuestTeams((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <Button
                    key="new"
                    variant="primary"
                    onClick={() => {
                      field.pushValue({ name: '', noOfPersons: 0 });
                      field.handleBlur();
                    }}
                    className="flex items-center"
                    disabled={isReadonly}
                  >
                    Dodaj nowy zespół
                  </Button>,
                  <DropdownElementSelectorButton
                    key="historical"
                    options={initValues.historicalGuestInstitutions.map((institution) => ({
                      value: institution,
                      onClick: () => {
                        field.pushValue({ name: institution, noOfPersons: 0 });
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczny zespół
                  </DropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </div>
          )}
        </form.AppField>
      </div>
    </Accordion>
  );
}
