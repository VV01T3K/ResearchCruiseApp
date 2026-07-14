import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppInputErrorsList } from '@/components/shared/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/components/shared/table/AppTable';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { getErrors } from '@/lib/form-errors';
import { DropdownElementSelectorButton } from '@/routes/applications/$applicationId/-components/form-controls/DropdownElementSelectorButton';
import { withForm } from '@/lib/form';
import type { FormBViewModel } from '@/routes/applications/$applicationId/-models/formB-view-model';
import { formBDefaultValues } from '@/routes/applications/$applicationId/-schemas/formB.schema';
import { CrewMemberValues } from '@/routes/applications/$applicationId/-schemas/types/CrewMemberValues';
import { GuestTeamValues } from '@/routes/applications/$applicationId/-schemas/types/GuestTeamValues';
import { UgTeamValues } from '@/routes/applications/$applicationId/-schemas/types/UgTeamValues';

export const MembersSection = withForm({
  defaultValues: formBDefaultValues,
  props: {} as { context: FormBViewModel },
  render: function MembersSection({ form, context }) {
    const { isReadonly, formAInitValues, submissionAttempts } = context;

    function getUgTeamsColumns(
      removeRow: (index: number) => void,
      notifyRowsChanged: () => void
    ): ColumnDef<UgTeamValues>[] {
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
            <form.Field
              name={`ugTeams[${row.index}].noOfEmployees`}
              children={(field) => (
                <AppNumberInput
                  data-testid="ug-team-employees"
                  name={field.name}
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
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
            <form.Field
              name={`ugTeams[${row.index}].noOfStudents`}
              children={(field) => (
                <AppNumberInput
                  data-testid="ug-team-students"
                  name={field.name}
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
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
                  notifyRowsChanged();
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
      removeRow: (index: number) => void,
      notifyRowsChanged: () => void
    ): ColumnDef<GuestTeamValues>[] {
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
            <form.Field
              name={`guestTeams[${row.index}].name`}
              children={(field) => (
                <AppInput
                  data-testid="guest-team-name-input"
                  data-testid-errors="guest-team-name-errors"
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
                  containerClassName="mx-4"
                  disabled={isReadonly}
                />
              )}
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
            <form.Field
              name={`guestTeams[${row.index}].noOfPersons`}
              children={(field) => (
                <AppNumberInput
                  data-testid-input="guest-team-people-input"
                  data-testid-errors="guest-team-people-errors"
                  name={field.name}
                  value={field.state.value}
                  minimum={0}
                  onChange={(x: number) => {
                    field.handleChange(x);
                    notifyRowsChanged();
                  }}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
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
                  notifyRowsChanged();
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
              <form.Field
                name={`crewMembers[${row.index}].title`}
                children={(field) => (
                  <AppInput
                    data-testid="crew-member-title-input"
                    data-testid-errors="crew-member-title-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Tytuł"
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Field
                name={`crewMembers[${row.index}].firstName`}
                children={(field) => (
                  <AppInput
                    data-testid="crew-member-names-input"
                    data-testid-errors="crew-member-names-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Imiona"
                    containerClassName="col-span-2"
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Field
                name={`crewMembers[${row.index}].lastName`}
                children={(field) => (
                  <AppInput
                    data-testid="crew-member-surname-input"
                    data-testid-errors="crew-member-surname-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Nazwisko"
                    containerClassName="col-span-2"
                    disabled={isReadonly}
                  />
                )}
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
              <form.Field
                name={`crewMembers[${row.index}].birthPlace`}
                children={(field) => (
                  <AppInput
                    data-testid="crew-member-birthplace-input"
                    data-testid-errors="crew-member-birthplace-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Miejsce urodzenia"
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Field
                name={`crewMembers[${row.index}].birthDate`}
                children={(field) => (
                  <AppDatePickerInput
                    data-testid-button="crew-member-birthdate-button"
                    data-testid-errors="crew-member-birthdate-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e ?? '')}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Data urodzenia"
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Field
                name={`crewMembers[${row.index}].documentNumber`}
                children={(field) => (
                  <AppInput
                    data-testid="crew-member-document-id-input"
                    data-testid-errors="crew-member-document-id-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Numer ID dokumentu"
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Field
                name={`crewMembers[${row.index}].documentExpiryDate`}
                children={(field) => (
                  <AppDatePickerInput
                    data-testid-button="crew-member-document-expiry-button"
                    data-testid-errors="crew-member-document-expiry-errors"
                    name={field.name}
                    value={field.state.value as string}
                    onChange={(e) => field.handleChange(e ?? '')}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, submissionAttempts)}
                    label="Data ważności dokumentu"
                    disabled={isReadonly}
                  />
                )}
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
            <form.Field
              name={`crewMembers[${row.index}].institution`}
              children={(field) => (
                <AppInput
                  data-testid="crew-member-institution-input"
                  data-testid-errors="crew-member-institution-errors"
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, submissionAttempts)}
                  placeholder="Wprowadź nazwę jednostki"
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
              <AppTableDeleteRowButton onClick={() => removeRow(row.index)} disabled={isReadonly} />,
            </div>
          ),
          size: 5,
        },
      ];
    }

    return (
      <AppAccordion
        title="9. Zespoły badawcze, które miałyby uczestniczyć w rejsie"
        expandedByDefault
        data-testid="form-b-members-section"
      >
        <AppAlert>Rejs do 12 godzin w porze dziennej - 33 osoby, powyżej 12 godzin - 16 osób</AppAlert>
        <div className="grid grid-cols-1 gap-16 xl:grid-cols-2">
          <form.Field
            name="ugTeams"
            mode="array"
            children={(field) => (
              <div>
                <AppTable
                  columns={getUgTeamsColumns(
                    (index) => {
                      field.removeValue(index);
                      field.handleBlur();
                    },
                    () => field.handleChange((prev) => prev)
                  )}
                  data={field.state.value}
                  buttons={() => [
                    <DropdownElementSelectorButton
                      key="new"
                      data-testid="form-b-add-ug-unit-btn"
                      options={formAInitValues.ugUnits.map((unit) => ({
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
                    >
                      Dodaj jednostkę UG
                    </DropdownElementSelectorButton>,
                  ]}
                  emptyTableMessage="Nie dodano żadnego zespołu."
                  variant="form"
                  disabled={isReadonly}
                  errors={getErrors(field.state.meta, submissionAttempts)}
                />
                <AppInputErrorsList
                  errors={getErrors(field.state.meta, submissionAttempts)}
                  data-testid="form-b-ug-teams-errors"
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
                  columns={getGuestTeams(
                    (index) => {
                      field.removeValue(index);
                      field.handleBlur();
                    },
                    () => field.handleChange((prev) => prev)
                  )}
                  data={field.state.value}
                  buttons={() => [
                    <AppButton
                      key="new"
                      variant="primary"
                      data-testid="form-b-add-guest-team-btn"
                      onClick={() => {
                        field.pushValue({ name: '', noOfPersons: 0 });
                        field.handleChange((prev: GuestTeamValues[]) => prev);
                        field.handleBlur();
                      }}
                      className="flex items-center gap-4"
                      disabled={isReadonly}
                    >
                      Dodaj nowy zespół
                    </AppButton>,
                    <DropdownElementSelectorButton
                      key="historical"
                      data-testid="form-b-add-historical-guest-team-btn"
                      options={formAInitValues.historicalGuestInstitutions.map((institution) => ({
                        value: institution,
                        onClick: () => {
                          field.pushValue({ name: institution, noOfPersons: 0 });
                          field.handleChange((prev: GuestTeamValues[]) => prev);
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
                  errors={getErrors(field.state.meta, submissionAttempts)}
                />
                <AppInputErrorsList
                  errors={getErrors(field.state.meta, submissionAttempts)}
                  data-testid="form-b-guest-teams-errors"
                />
              </div>
            )}
          />
        </div>
        <form.Field
          name="crewMembers"
          mode="array"
          children={(field) => (
            <>
              <AppTable
                columns={getCrewMembersColumns((index) => {
                  field.removeValue(index);
                  field.handleChange((prev) => prev);
                  field.handleBlur();
                })}
                data={field.state.value}
                buttons={() => [
                  <AppButton
                    key="crewMembers.add-btn"
                    data-testid="form-b-add-crew-member-btn"
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
                      field.handleChange((prev: CrewMemberValues[]) => prev);
                      field.handleBlur();
                    }}
                    disabled={isReadonly}
                  >
                    Dodaj pozwolenie
                  </AppButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego członka załogi."
                variant="form"
                disabled={isReadonly}
                errors={getErrors(field.state.meta, submissionAttempts)}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta)} data-testid="form-b-crew-members-errors" />
            </>
          )}
        />
      </AppAccordion>
    );
  },
});
