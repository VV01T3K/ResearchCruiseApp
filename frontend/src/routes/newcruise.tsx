import { AppInitialsAvatar, AppLoader, AppPage } from '@core/components';
import { FormAAccordion } from 'src/features/formA/components/FormAAccordion';
import { allowOnly, client } from '@core/helpers';
import { Role } from '@core/models';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { FormAInitialState, FormAPerson } from 'src/features/formA/types';
import { useForm } from '@tanstack/react-form';
import { AppDropdownInput } from 'src/features/form/compontents/AppDropdownInput';
import { FormAPeriodInput } from 'src/features/formA/components/FormAPeriodInput';

export const Route = createFileRoute('/newcruise')({
  component: RouteComponent,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner, Role.CruiseManager),
});

function RouteComponent() {
  const initialStateQuery = useSuspenseQuery({
    queryKey: ['formAInitialState'],
    queryFn: async () => {
      return client.get('/forms/InitValues/A');
    },
    select: (res) => res.data as FormAInitialState,
  });
  const form = useForm({
    defaultValues: {
      cruiseManagerId: '',
      deputyManagerId: '',
      year: '',
      acceptablePeriod: [] as string[],
      optimalPeriod: [] as string[],
    },
  });

  return (
    <AppPage title="Formularz A">
      <React.Suspense fallback={<AppLoader />}>
        <form>
          <FormAAccordion title="1. Kierownik zgłaszanego rejsu" expandedByDefault>
            <div className="grid grid-cols-3 gap-4">
              <form.Field
                name="cruiseManagerId"
                children={(field) => (
                  <AppDropdownInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                    label="Kierownik rejsu"
                    possibleValues={initialStateQuery.data?.cruiseManagers.map(mapPersonToLabel)}
                  />
                )}
              />
              <form.Field
                name="deputyManagerId"
                children={(field) => (
                  <AppDropdownInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                    label="Kierownik rejsu"
                    possibleValues={initialStateQuery.data?.cruiseManagers.map(mapPersonToLabel)}
                  />
                )}
              />
              <form.Field
                name="year"
                children={(field) => (
                  <AppDropdownInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                    label="Rok"
                    possibleValues={initialStateQuery.data?.years.map((year) => ({ value: year, textLabel: year }))}
                    includeEmptyValue={false}
                  />
                )}
              />
            </div>
          </FormAAccordion>
          <FormAAccordion title="2. Czas trwania zgłaszanego rejsu" expandedByDefault>
            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="acceptablePeriod"
                children={(field) => (
                  <FormAPeriodInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={field.state.meta.errors.join(', ')}
                    label="Dopuszczalny okres, w którym miałby się odbywać rejs"
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.acceptablePeriod}
                children={(acceptablePeriod) => {
                  return (
                    <>
                      <form.Field
                        name="optimalPeriod"
                        children={(field) => (
                          <FormAPeriodInput
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors.join(', ')}
                            maxValues={acceptablePeriod}
                            label="Optymalny okres, w którym miałby się odbywać rejs"
                          />
                        )}
                      />
                    </>
                  );
                }}
              />
            </div>
          </FormAAccordion>
        </form>
      </React.Suspense>
    </AppPage>
  );
}

function mapPersonToLabel(person: FormAPerson): { value: string; textLabel: string; richLabel?: React.ReactNode } {
  return {
    value: person.id,
    textLabel: `${person.firstName} ${person.lastName} (${person.email})`,
    richLabel: (
      <div className="w-full flex gap-4">
        <AppInitialsAvatar fullName={`${person.firstName} ${person.lastName}`} variant="small" />
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
