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
import { AppInput, AppNumberInput } from 'src/features/form/compontents';
import { AnimatePresence, motion } from 'motion/react';

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
      acceptablePeriod: [] as number[],
      optimalPeriod: [] as number[],
      cruiseHours: 0,
      periodNotes: '',
      shipUsage: 0,
      differentShipUsage: '',
      permissions: [],
    },
  });

  return (
    <AppPage title="Formularz A">
      <React.Suspense fallback={<AppLoader />}>
        <form className="space-y-8">
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
            <div className="grid grid-cols-2 gap-8">
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

              <form.Subscribe
                selector={(state) => state.values.cruiseHours}
                children={(cruiseHours) => {
                  return (
                    <>
                      <form.Field
                        name="cruiseHours"
                        children={(field) => (
                          <AppNumberInput
                            name={field.name}
                            value={Math.floor((cruiseHours / 24) * 100) / 100}
                            onChange={(e) => field.handleChange(Number(e.target.value) * 24)}
                            onIncrement={() => field.handleChange((Math.floor(cruiseHours / 24) + 1) * 24)}
                            onDecrement={() => field.handleChange((Math.floor(cruiseHours / 24) - 1) * 24)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors.join(', ')}
                            label="Liczba planowanych dób rejsowych"
                            required
                          />
                        )}
                      />
                    </>
                  );
                }}
              />

              <form.Subscribe
                selector={(state) => state.values.cruiseHours}
                children={(cruiseHours) => {
                  return (
                    <>
                      <form.Field
                        name="cruiseHours"
                        children={(field) => (
                          <AppNumberInput
                            name={field.name}
                            value={cruiseHours}
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                            onIncrement={() => field.handleChange(cruiseHours + 1)}
                            onDecrement={() => field.handleChange(cruiseHours - 1)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors.join(', ')}
                            label="Liczba planowanych godzin rejsowych"
                            required
                          />
                        )}
                      />
                    </>
                  );
                }}
              />

              <form.Field
                name="periodNotes"
                children={(field) => (
                  <div className="col-span-2">
                    <AppInput
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors.join(', ')}
                      label="Uwagi dotyczące teminu"
                      placeholder='np. "Rejs w okresie wakacyjnym"'
                    />
                  </div>
                )}
              />

              <form.Field
                name="shipUsage"
                children={(field) => (
                  <div className="col-span-2">
                    <AppDropdownInput
                      value={field.state.value.toString()}
                      onChange={(e) => field.handleChange(Number(e))}
                      onBlur={field.handleBlur}
                      error={field.state.meta.errors.join(', ')}
                      label="Statek na potrzeby badań będzie wykorzystywany"
                      possibleValues={initialStateQuery.data?.shipUsages.map((shipUsage, i) => ({
                        value: i.toString(),
                        textLabel: shipUsage,
                      }))}
                    />
                  </div>
                )}
              />

              <form.Subscribe selector={(state) => state.values.shipUsage}>
                {(shipUsage) => (
                  <div className="col-span-2">
                    <AnimatePresence>
                      {shipUsage === 4 && (
                        <motion.div
                          initial={{ opacity: 0, translateY: '-10%' }}
                          animate={{ opacity: 1, translateY: '0' }}
                          exit={{ opacity: 0, translateY: '-10%' }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                        >
                          <form.Field
                            name="differentShipUsage"
                            children={(field) => (
                              <div className="col-span-2">
                                <AppInput
                                  name={field.name}
                                  value={field.state.value}
                                  onChange={(e) => field.handleChange(e.target.value)}
                                  onBlur={field.handleBlur}
                                  error={field.state.meta.errors.join(', ')}
                                  label="Inny sposób użycia"
                                  placeholder="np. statek badawczy"
                                  required
                                />
                              </div>
                            )}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </form.Subscribe>
            </div>
          </FormAAccordion>
          <FormAAccordion title="3. Dodatkowe pozwolenia do planowanych podczas rejsu badań" expandedByDefault>
            <div></div>
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
