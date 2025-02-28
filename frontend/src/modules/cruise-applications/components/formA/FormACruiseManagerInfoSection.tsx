import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAvatar } from '@/core/components/AppAvatar';
import { AppDropdownInput, AppDropdownInputOption } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';

function mapPersonToLabel(person: FormUserDto): AppDropdownInputOption<string> {
  return {
    value: person.id,
    inlineLabel: `${person.firstName} ${person.lastName} (${person.email})`,
    richLabel: (
      <div className="w-full flex gap-4">
        <AppAvatar fullName={`${person.firstName} ${person.lastName}`} variant="small" />
        <div className="flex flex-col justify-center flex-1">
          <div className="font-semibold">
            {person.firstName} {person.lastName}
          </div>
          <div>{person.email}</div>
        </div>
      </div>
    ),
  };
}

export function FormACruiseManagerInfoSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="1. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form.Field
          name="cruiseManagerId"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Kierownik rejsu"
              required
              placeholder="Wybierz kierownika rejsu"
              allOptions={initValues.cruiseManagers.map(mapPersonToLabel)}
              disabled={isReadonly}
            />
          )}
        />

        <form.Field
          name="deputyManagerId"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Zastępca kierownika rejsu"
              placeholder="Wybierz zastępcę kierownika rejsu"
              allOptions={initValues.deputyManagers.map(mapPersonToLabel)}
              disabled={isReadonly}
            />
          )}
        />

        <form.Field
          name="year"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Rok"
              required
              placeholder="Wybierz rok"
              allOptions={initValues.years.map((year) => ({
                value: year,
                inlineLabel: year,
              }))}
              disabled={isReadonly}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}
