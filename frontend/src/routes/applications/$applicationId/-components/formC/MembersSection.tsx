import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';
import { CrewMemberValues } from '@/routes/applications/$applicationId/-schemas/types/CrewMemberValues';
import { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

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
          <form.AppField
            name={`ugTeams[${row.index}].noOfEmployees`}
            children={(field) => (
              <field.NumberField
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
      },
      {
        header: 'Liczba studentów',
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (row) => row.noOfStudents,
        cell: ({ row }) => (
          <form.AppField
            name={`ugTeams[${row.index}].noOfStudents`}
            children={(field) => (
              <field.NumberField
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 20,
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
          <form.AppField
            name={`guestTeams[${row.index}].name`}
            children={(field) => <field.TextField containerClassName="mx-4" disabled={isReadonly} />}
          />
        ),
        size: 60,
      },
      {
        header: 'Liczba osób',
        enableColumnFilter: false,
        enableSorting: false,
        accessorFn: (row) => row.noOfPersons,
        cell: ({ row }) => (
          <form.AppField
            name={`guestTeams[${row.index}].noOfPersons`}
            children={(field) => (
              <field.NumberField
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x);
                }}
                className="mx-4"
                disabled={isReadonly}
              />
            )}
          />
        ),
        size: 25,
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
          <AppInput value={formB.crewMembers[row.index].title} label="Tytuł" disabled />
          <AppInput
            value={formB.crewMembers[row.index].firstName}
            label="Imiona"
            containerClassName="col-span-2"
            disabled
          />
          <AppInput
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
          <AppInput value={formB.crewMembers[row.index].birthPlace} label="Miejsce urodzenia" disabled />
          <AppDatePickerInput
            name="birthPlace"
            value={formB.crewMembers[row.index].birthDate}
            label="Data urodzenia"
            disabled
          />
          <AppInput value={formB.crewMembers[row.index].documentNumber} label="Numer ID dokumentu" disabled />

          <AppDatePickerInput
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
        <AppInput value={formB.crewMembers[row.index].institution} placeholder="Wprowadź nazwę jednostki" disabled />
      ),
      size: 20,
    },
  ];

  return (
    <AppAccordion
      title="9. Zespoły badawcze, które uczestniczyły w rejsie"
      expandedByDefault
      data-testid="form-c-members-section"
    >
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        <form.AppField
          name="ugTeams"
          mode="array"
          children={(field) => (
            <div>
              <AppTable
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
              <AppInputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </div>
          )}
        />
        <form.AppField
          name="guestTeams"
          mode="array"
          children={(field) => (
            <div>
              <AppTable
                columns={getGuestTeams((index) => {
                  field.removeValue(index);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <AppButton
                    key="new"
                    variant="primary"
                    onClick={() => {
                      field.pushValue({ name: '', noOfPersons: 0 });
                      field.handleBlur();
                    }}
                    className="flex items-center gap-4"
                    disabled={isReadonly}
                  >
                    Dodaj nowy zespół
                  </AppButton>,
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
              <AppInputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
            </div>
          )}
        />
      </div>
      <AppTable
        columns={crewMembersColumns}
        data={formB.crewMembers}
        buttons={() => []}
        emptyTableMessage="Nie dodano żadnego członka załogi."
        variant="form"
        disabled
      />
    </AppAccordion>
  );
}
