import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/inputs/Input';
import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { DropdownElementSelectorButton } from '@/features/applications/components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';
import { CrewMemberValues } from '@/features/applications/schemas/types/CrewMemberValues';
import { GuestTeamValues } from '@/features/applications/schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/features/applications/schemas/types/UgTeamValues';

export function MembersSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { formB, isReadonly, formAInitValues } = context;

  function getUgTeamsColumns(removeRow: (index: number) => void): ColumnDef<UgTeamValues>[] {
    return [
      {
        header: 'Lp.',
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Jednostka',
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (row) => formAInitValues.ugUnits.find((unit) => unit.id === row.ugUnitId)?.name,
        size: 45,
      },
      {
        header: 'Liczba pracowników',
        enableColumnFilter: false,
        enableSorting: false,
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
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
      },
      {
        header: 'Liczba studentów',
        enableColumnFilter: false,
        enableSorting: false,
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
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 20,
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
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => `${row.index + 1}. `,
        size: 10,
      },
      {
        header: 'Instytucja',
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <form.AppField name={`guestTeams[${row.index}].name`}>
            {(field) => (
              <field.TextField
                aria-label={`Instytucja, wiersz ${row.index + 1}`}
                containerClassName="mx-4"
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 60,
      },
      {
        header: 'Liczba osób',
        enableColumnFilter: false,
        enableSorting: false,
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
                disabled={isReadonly}
              />
            )}
          </form.AppField>
        ),
        size: 25,
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

  const crewMembersColumns: ColumnDef<CrewMemberValues>[] = [
    {
      header: 'Lp.',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => `${row.index + 1}. `,
      size: 5,
    },
    {
      header: 'Dane osobowe',
      enableColumnFilter: false,
      enableSorting: false,
      accessorFn: (row) => `${row.title} ${row.firstName} ${row.lastName}`,
      cell: ({ row }) => (
        <div className="grid grid-cols-5 gap-2">
          <Input
            aria-label={`Tytuł, wiersz ${row.index + 1}`}
            value={formB.crewMembers[row.index].title}
            label="Tytuł"
            disabled
          />
          <Input
            aria-label={`Imiona, wiersz ${row.index + 1}`}
            value={formB.crewMembers[row.index].firstName}
            label="Imiona"
            containerClassName="col-span-2"
            disabled
          />
          <Input
            aria-label={`Nazwisko, wiersz ${row.index + 1}`}
            value={formB.crewMembers[row.index].lastName}
            label="Nazwisko"
            containerClassName="col-span-2"
            disabled
          />
        </div>
      ),
      size: 35,
    },
    {
      header: 'Dokument tożsamości',
      enableColumnFilter: false,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="grid grid-cols-2 gap-2">
          <Input
            aria-label={`Miejsce urodzenia, wiersz ${row.index + 1}`}
            value={formB.crewMembers[row.index].birthPlace}
            label="Miejsce urodzenia"
            disabled
          />
          <DatePickerInput
            name="birthPlace"
            value={formB.crewMembers[row.index].birthDate}
            label="Data urodzenia"
            disabled
          />
          <Input
            aria-label={`Numer ID dokumentu, wiersz ${row.index + 1}`}
            value={formB.crewMembers[row.index].documentNumber}
            label="Numer ID dokumentu"
            disabled
          />

          <DatePickerInput
            name="documentExpiryDate"
            value={formB.crewMembers[row.index].documentExpiryDate}
            label="Data ważności dokumentu"
            disabled
          />
        </div>
      ),
      size: 35,
    },
    {
      header: 'Nazwa jednostki organizacyjnej UG lub instytucji zewnętrznej',
      enableColumnFilter: false,
      enableSorting: false,
      accessorFn: (row) => row.institution,
      cell: ({ row }) => (
        <Input
          aria-label={`Nazwa jednostki, wiersz ${row.index + 1}`}
          value={formB.crewMembers[row.index].institution}
          placeholder="Wprowadź nazwę jednostki"
          disabled
        />
      ),
      size: 20,
    },
  ];

  return (
    <Accordion title="9. Zespoły badawcze, które uczestniczyły w rejsie" expandedByDefault>
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        <form.AppField name="ugTeams" mode="array">
          {(field) => (
            <div>
              <Table
                className="md:-mt-2"
                columns={getUgTeamsColumns((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <DropdownElementSelectorButton
                    key="new"
                    options={formAInitValues.ugUnits.map((unit) => ({
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
                variant="form"
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
                    options={formAInitValues.historicalGuestInstitutions.map((institution) => ({
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
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, form.state.submissionAttempts)}
              />
              <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </div>
          )}
        </form.AppField>
      </div>
      <Table
        columns={crewMembersColumns}
        data={formB.crewMembers}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego członka załogi."
        variant="form"
        disabled
      />
    </Accordion>
  );
}
