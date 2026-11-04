import { ColumnDef } from '@/integrations/tanstack/table/features';

import { Accordion } from '@/components/shared/Accordion';
import { Alert } from '@/components/shared/Alert';
import { Button } from '@/components/shared/Button';
import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';
import { Table } from '@/components/shared/table/Table';
import { TableDeleteRowButton } from '@/components/shared/table/TableDeleteRowButton';
import { getErrors } from '@/integrations/tanstack/form/errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormBViewModel } from '@/features/applications/models/formB-view-model';
import { formBDefaultValues } from '@/features/applications/schemas/formB.schema';
import { CrewMemberValues } from '@/features/applications/schemas/types/CrewMemberValues';
import { GuestTeamValues } from '@/features/applications/schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/features/applications/schemas/types/UgTeamValues';

export function MembersSection({ context }: { context: FormBViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formBDefaultValues });
  const { isReadonly, formAInitValues } = context;

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

  function getCrewMembersColumns(removeRow: (index: number) => void): ColumnDef<CrewMemberValues>[] {
    return [
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
            <form.AppField name={`crewMembers[${row.index}].title`}>
              {(field) => (
                <field.TextField aria-label={`Tytuł, wiersz ${row.index + 1}`} label="Tytuł" disabled={isReadonly} />
              )}
            </form.AppField>

            <form.AppField name={`crewMembers[${row.index}].firstName`}>
              {(field) => (
                <field.TextField
                  aria-label={`Imiona, wiersz ${row.index + 1}`}
                  label="Imiona"
                  containerClassName="col-span-2"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>

            <form.AppField name={`crewMembers[${row.index}].lastName`}>
              {(field) => (
                <field.TextField
                  aria-label={`Nazwisko, wiersz ${row.index + 1}`}
                  label="Nazwisko"
                  containerClassName="col-span-2"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>
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
            <form.AppField name={`crewMembers[${row.index}].birthPlace`}>
              {(field) => (
                <field.TextField
                  aria-label={`Miejsce urodzenia, wiersz ${row.index + 1}`}
                  label="Miejsce urodzenia"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>

            <form.AppField name={`crewMembers[${row.index}].birthDate`}>
              {(field) => (
                <field.DateField
                  onChange={(e) => field.handleChange(e ?? '')}
                  label="Data urodzenia"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>

            <form.AppField name={`crewMembers[${row.index}].documentNumber`}>
              {(field) => (
                <field.TextField
                  aria-label={`Numer ID dokumentu, wiersz ${row.index + 1}`}
                  label="Numer ID dokumentu"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>

            <form.AppField name={`crewMembers[${row.index}].documentExpiryDate`}>
              {(field) => (
                <field.DateField
                  onChange={(e) => field.handleChange(e ?? '')}
                  label="Data ważności dokumentu"
                  disabled={isReadonly}
                />
              )}
            </form.AppField>
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
          <form.AppField name={`crewMembers[${row.index}].institution`}>
            {(field) => (
              <field.TextField
                aria-label={`Nazwa jednostki, wiersz ${row.index + 1}`}
                placeholder="Wprowadź nazwę jednostki"
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
            <TableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />,
          </div>
        ),
        size: 5,
      },
    ];
  }

  return (
    <Accordion title="9. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <Alert>Rejs do 12 godzin w porze dziennej - 33 osoby, powyżej 12 godzin - 16 osób</Alert>
      <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
        <form.AppField name="ugTeams" mode="array">
          {(field) => (
            <div>
              <Table
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
                    className="flex items-center gap-4"
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
      <form.AppField name="crewMembers" mode="array">
        {(field) => (
          <>
            <Table
              columns={getCrewMembersColumns((index) => {
                field.removeValue(index);
                field.handleBlur();
              })}
              data={field.state.value}
              buttons={() => [
                <Button
                  key="crewMembers.add-btn"
                  onClick={() => {
                    field.pushValue({
                      title: '',
                      firstName: '',
                      lastName: '',
                      birthPlace: '',
                      birthDate: '',
                      documentNumber: '',
                      documentExpiryDate: '',
                      institution: '',
                    });
                    field.handleBlur();
                  }}
                  disabled={isReadonly}
                >
                  Dodaj członka załogi
                </Button>,
              ]}
              emptyTableMessage="Nie dodano żadnego członka załogi."
              variant="form"
              disabled={isReadonly}
              errors={getErrors(field.state.meta, form.state.submissionAttempts)}
            />
            <InputErrorsList errors={getErrors(field.state.meta, form.state.submissionAttempts)} />
          </>
        )}
      </form.AppField>
    </Accordion>
  );
}
