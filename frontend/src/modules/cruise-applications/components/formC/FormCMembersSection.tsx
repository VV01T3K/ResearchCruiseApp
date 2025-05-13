import { FieldApi } from '@tanstack/react-form';
import { ColumnDef } from '@tanstack/react-table';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';
import { AppTable } from '@/core/components/table/AppTable';
import { AppTableDeleteRowButton } from '@/core/components/table/AppTableDeleteRowButton';
import { getErrors } from '@/core/lib/utils';
import { CruiseApplicationDropdownElementSelectorButton } from '@/cruise-applications/components/common/CruiseApplicationDropdownElementSelectorButton';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';
import { CrewMemberDto } from '@/cruise-applications/models/CrewMemberDto';
import { FormCDto } from '@/cruise-applications/models/FormCDto';
import { GuestTeamDto } from '@/cruise-applications/models/GuestTeamDto';
import { UGTeamDto } from '@/cruise-applications/models/UGTeamDto';

export function FormCMembersSection() {
  const { form, formB, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  function getUgTeamsColumns(
    field: FieldApi<FormCDto, 'ugTeams', undefined, undefined, UGTeamDto[]>
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
    field: FieldApi<FormCDto, 'guestTeams', undefined, undefined, GuestTeamDto[]>
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

  const crewMembersColumns: ColumnDef<CrewMemberDto>[] = [
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
    <AppAccordion title="9. Zespoły badawcze, które uczestniczyły w rejsie" expandedByDefault>
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
