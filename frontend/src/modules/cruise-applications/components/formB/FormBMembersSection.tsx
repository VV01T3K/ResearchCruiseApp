import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAlert } from '@/core/components/AppAlert';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';
import { CrewMemberDto } from '@/cruise-applications/models/CrewMemberDto';
import { FormBDto } from '@/cruise-applications/models/FormBDto';
import { GuestTeamDto } from '@/cruise-applications/models/GuestTeamDto';
import { UGTeamDto } from '@/cruise-applications/models/UGTeamDto';

export function FormBMembersSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormB();

  function getUgTeamsColumns(
    field: FieldApi<FormBDto, 'ugTeams', undefined, undefined, UGTeamDto[]>
  ): ColumnDef<UGTeamDto>[] {
    const tableField = field;
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
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                required
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
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                required
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
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
                tableField.handleChange((prev) => prev);
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
    field: FieldApi<FormBDto, 'guestTeams', undefined, undefined, GuestTeamDto[]>
  ): ColumnDef<GuestTeamDto>[] {
    const tableField = field;
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
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                containerClassName="mx-4"
                required
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
                name={field.name}
                value={parseInt(field.state.value)}
                minimum={0}
                onChange={(x: number) => {
                  field.handleChange(x.toString());
                  tableField.handleChange((prev) => prev);
                }}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                className="mx-4"
                required
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
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
                tableField.handleChange((prev) => prev);
              }}
              disabled={isReadonly}
            />
          </div>
        ),
        size: 5,
      },
    ];
  }

  function getCrewMembersColumns(
    field: FieldApi<FormBDto, 'crewMembers', undefined, undefined, CrewMemberDto[]>
  ): ColumnDef<CrewMemberDto>[] {
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
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Tytuł"
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`crewMembers[${row.index}].firstName`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Imiona"
                  containerClassName="col-span-2"
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`crewMembers[${row.index}].lastName`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Nazwisko"
                  containerClassName="col-span-2"
                  required
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
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Miejsce urodzenia"
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`crewMembers[${row.index}].birthDate`}
              children={(field) => (
                <AppDatePickerInput
                  name={field.name}
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Data urodzenia"
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`crewMembers[${row.index}].documentNumber`}
              children={(field) => (
                <AppInput
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Numer ID dokumentu"
                  required
                  disabled={isReadonly}
                />
              )}
            />

            <form.Field
              name={`crewMembers[${row.index}].documentExpiryDate`}
              children={(field) => (
                <AppDatePickerInput
                  name={field.name}
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e ?? '')}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Data ważności dokumentu"
                  required
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
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                placeholder="Wprowadź nazwę jednostki"
                required
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
                field.removeValue(row.index);
                field.handleChange((prev) => prev);
                field.handleBlur();
              }}
              disabled={isReadonly}
            />
            ,
          </div>
        ),
        size: 5,
      },
    ];
  }

  return (
    <AppAccordion title="9. Zespoły badawcze, które miałyby uczestniczyć w rejsie" expandedByDefault>
      <AppAlert>Rejs do 12 godzin w porze dziennej - 33 osoby, powyżej 12 godzin - 16 osób</AppAlert>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
        <form.Field
          name="ugTeams"
          mode="array"
          children={(field) => (
            <div>
              <AppTable
                columns={getUgTeamsColumns(field)}
                data={field.state.value}
                buttons={() => [
                  <CruiseApplicationDropdownElementSelectorButton
                    key="new"
                    options={formAInitValues.ugUnits.map((unit) => ({
                      value: unit.name,
                      content: unit.name,
                      onClick: () => {
                        field.pushValue({ ugUnitId: unit.id, noOfEmployees: '0', noOfStudents: '0' });
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj jednostkę UG
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
                disabled={isReadonly}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
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
                      field.handleChange((prev) => prev);
                      field.handleBlur();
                    }}
                    className="flex items-center gap-4"
                    disabled={isReadonly}
                  >
                    Dodaj nowy zespół
                  </AppButton>,
                  <CruiseApplicationDropdownElementSelectorButton
                    key="historical"
                    options={formAInitValues.historicalGuestInstitutions.map((institution) => ({
                      value: institution,
                      onClick: () => {
                        field.pushValue({ name: institution, noOfPersons: '0' });
                        field.handleChange((prev) => prev);
                        field.handleBlur();
                      },
                    }))}
                    variant="primaryOutline"
                    disabled={isReadonly}
                  >
                    Dodaj historyczny zespół
                  </CruiseApplicationDropdownElementSelectorButton>,
                ]}
                emptyTableMessage="Nie dodano żadnego zespołu."
                variant="form"
                disabled={isReadonly}
              />
              <AppInputErrorsList errors={getErrors(field.state.meta, hasFormBeenSubmitted)} />
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
              columns={getCrewMembersColumns(field)}
              data={field.state.value}
              buttons={() => [
                <AppButton
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
                    field.handleChange((prev) => prev);
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
            />
            <AppInputErrorsList errors={getErrors(field.state.meta)} />
          </>
        )}
      />
    </AppAccordion>
  );
}
