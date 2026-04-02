import { createFileRoute } from '@tanstack/react-router';

import { FormABlockadeWarning } from '@/components/applications/formA/FormABlockadeWarning';
import { AppAlert } from '@/components/shared/AppAlert';
import { AppLayout } from '@/components/shared/AppLayout';
import { useAppForm } from '@/integrations/tanstack/form';

import {
  cruiseGoalOptions,
  experimentFormASchema,
  formatBlockadeDate,
  getCurrentBlockades,
  getOverlappingBlockades,
  managerOptions,
  periodSelectionOptions,
  shipUsageOptions,
  yearOptions,
} from './-form-a';
import { SectionCard } from './-componets-a';
import z from 'zod';

export const Route = createFileRoute('/experiments/form-a')({
  component: ExperimentFormA,
});

function ExperimentFormA() {
  const form = useAppForm({
    defaultValues: {
      cruiseManagerId: '',
      deputyManagerId: '',
      year: yearOptions[0],
      periodSelectionType: 'period',
      acceptablePeriod: ['0', '24'],
      optimalPeriod: ['4', '10'],
      precisePeriodStart: '',
      precisePeriodEnd: '',
      cruiseHours: '144',
      periodNotes: '',
      shipUsage: '',
      differentUsage: '',
      cruiseGoal: '',
      cruiseGoalDescription: '',
    } as z.input<typeof experimentFormASchema>, // TODO: it should be automaticaly infered
    validators: {
      onChange: experimentFormASchema,
      onSubmit: experimentFormASchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      alert(`Form submitted for ${value}`);
    },
  });

  return (
    <AppLayout
      title="Eksperymentalny Formularz A"
      description="Wybrany wycinek produkcyjnego Formularza A zbudowany na nowym stosie TanStack Form."
    >
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
        className="mx-auto max-w-448 pb-8"
        data-testid="experiment-form-a"
      >
        <form.AppForm>
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
            <div className="min-w-0 space-y-6">
              <SectionCard
                number="1"
                title="Kierownik zgłaszanego rejsu"
                description="Sekcja testuje podstawowe selecty, zależności między osobami oraz wybór roku."
                testId="experiment-form-a-section-1"
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <form.AppField name="cruiseManagerId">
                    {(field) => (
                      <field.SelectField
                        label="Kierownik rejsu"
                        values={managerOptions}
                        placeholder="Wybierz kierownika rejsu"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="deputyManagerId">
                    {(field) => (
                      <field.SelectField
                        label="Zastępca kierownika rejsu"
                        values={managerOptions}
                        placeholder="Wybierz zastępcę kierownika rejsu"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="year">
                    {(field) => (
                      <field.SelectField
                        label="Rok"
                        values={yearOptions.map((value) => ({ value, label: value }))}
                        placeholder="Wybierz rok"
                      />
                    )}
                  </form.AppField>
                </div>
              </SectionCard>

              <SectionCard
                number="2"
                title="Czas trwania zgłaszanego rejsu"
                description="Ta sekcja odtwarza najciekawsze zależności z produkcyjnego Formularza A, w tym blokady i logikę okresów."
                testId="experiment-form-a-section-2"
              >
                <form.Subscribe
                  selector={(state) => ({
                    acceptablePeriod: state.values.acceptablePeriod,
                    periodSelectionType: state.values.periodSelectionType,
                    precisePeriodEnd: state.values.precisePeriodEnd,
                    precisePeriodStart: state.values.precisePeriodStart,
                    shipUsage: state.values.shipUsage,
                    year: state.values.year,
                  })}
                >
                  {({
                    acceptablePeriod,
                    periodSelectionType,
                    precisePeriodEnd,
                    precisePeriodStart,
                    shipUsage,
                    year,
                  }) => {
                    const currentBlockades = getCurrentBlockades(year);
                    const overlappingBlockades = getOverlappingBlockades(
                      {
                        acceptablePeriod,
                        periodSelectionType,
                        precisePeriodEnd,
                        precisePeriodStart,
                        year,
                      },
                      currentBlockades
                    );

                    return (
                      <div className="space-y-5">
                        <FormABlockadeWarning year={Number.parseInt(year, 10)} blockades={currentBlockades} />

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <form.AppField name="periodSelectionType">
                              {(field) => (
                                <field.SelectField
                                  label="Wybierz sposób określenia terminu rejsu"
                                  values={periodSelectionOptions}
                                />
                              )}
                            </form.AppField>
                          </div>

                          {periodSelectionType === 'precise' ? (
                            <>
                              <form.AppField name="precisePeriodStart">
                                {(field) => (
                                  <field.NativeDateField
                                    label="Dokładny termin rozpoczęcia rejsu"
                                    testId="experiment-form-a-precise-start"
                                  />
                                )}
                              </form.AppField>

                              <form.AppField name="precisePeriodEnd">
                                {(field) => (
                                  <field.NativeDateField
                                    label="Dokładny termin zakończenia rejsu"
                                    min={precisePeriodStart || undefined}
                                    testId="experiment-form-a-precise-end"
                                  />
                                )}
                              </form.AppField>
                            </>
                          ) : (
                            <>
                              <form.AppField name="acceptablePeriod">
                                {(field) => (
                                  <field.CruisePeriodField label="Dopuszczalny okres, w którym miałby się odbywać rejs" />
                                )}
                              </form.AppField>

                              <form.AppField name="optimalPeriod">
                                {(field) => (
                                  <field.CruisePeriodField
                                    label="Optymalny okres, w którym miałby się odbywać rejs"
                                    maxValues={acceptablePeriod}
                                  />
                                )}
                              </form.AppField>
                            </>
                          )}

                          {overlappingBlockades.length > 0 ? (
                            <div className="md:col-span-2" data-testid="experiment-form-a-blockade-overlap">
                              <AppAlert variant="warning">
                                <div className="space-y-2 text-sm">
                                  <p className="font-semibold">Utrudniające blokady w wybranym zakresie:</p>
                                  <ul className="space-y-1">
                                    {overlappingBlockades.map((blockade) => (
                                      <li
                                        key={`${blockade.title}-${blockade.start.toISOString()}-${blockade.end.toISOString()}`}
                                      >
                                        <span className="font-semibold">{blockade.title}</span>:{' '}
                                        {formatBlockadeDate(blockade.start)} - {formatBlockadeDate(blockade.end)}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </AppAlert>
                            </div>
                          ) : null}

                          <div className="md:col-span-2">
                            <form.AppField name="cruiseHours">
                              {(field) => (
                                <field.HoursDaysField
                                  label="Planowany czas rejsu"
                                  rootTestId="experiment-form-a-cruise-duration"
                                  daysTestId="experiment-form-a-days-input"
                                  hoursTestId="experiment-form-a-hours-input"
                                />
                              )}
                            </form.AppField>
                          </div>

                          <div className="md:col-span-2">
                            <form.AppField name="periodNotes">
                              {(field) => <field.TextAreaField label="Uwagi dotyczące terminu" rows={3} />}
                            </form.AppField>
                          </div>

                          <div className="md:col-span-2">
                            <form.AppField name="shipUsage">
                              {(field) => (
                                <field.SelectField
                                  label="Statek na potrzeby badań będzie wykorzystywany"
                                  values={shipUsageOptions.map((option) => ({
                                    value: option.value,
                                    label: option.label,
                                  }))}
                                  placeholder="Wybierz sposób użycia"
                                />
                              )}
                            </form.AppField>
                          </div>

                          {shipUsage === '4' ? (
                            <div className="md:col-span-2">
                              <form.AppField name="differentUsage">
                                {(field) => (
                                  <field.TextField
                                    label="Inny sposób użycia"
                                    placeholder="Opisz niestandardowy sposób wykorzystania statku"
                                  />
                                )}
                              </form.AppField>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    );
                  }}
                </form.Subscribe>
              </SectionCard>

              <SectionCard
                number="5"
                title="Cel rejsu"
                description="Sekcja pokazuje zależność między wybranym celem a wymaganym opisem."
                testId="experiment-form-a-section-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <form.AppField name="cruiseGoal">
                    {(field) => (
                      <field.SelectField
                        label="Cel rejsu"
                        values={cruiseGoalOptions.map((option) => ({ value: option.value, label: option.label }))}
                        placeholder="Wybierz cel rejsu"
                      />
                    )}
                  </form.AppField>

                  <form.Subscribe selector={(state) => state.values.cruiseGoal === ''}>
                    {(isGoalDescriptionDisabled) => (
                      <form.AppField name="cruiseGoalDescription">
                        {(field) => (
                          <field.TextField
                            label="Opis celu rejsu"
                            placeholder={
                              isGoalDescriptionDisabled
                                ? 'Wybierz najpierw cel rejsu'
                                : 'Krótko opisz, dlaczego ten rejs ma właśnie taki cel'
                            }
                            disabled={isGoalDescriptionDisabled}
                          />
                        )}
                      </form.AppField>
                    )}
                  </form.Subscribe>
                </div>
              </SectionCard>

              <div className="flex justify-end">
                <form.SubscribeButton label="Zapisz eksperyment" loadingLabel="Zapisywanie..." />
              </div>
            </div>

            <aside className="xl:sticky xl:top-24 xl:self-start">
              <form.LiveValuesPanel
                testId="experiment-form-a-live-values"
                panelClassName="rounded-xl border border-gray-200 bg-white p-4 shadow-sm xl:max-h-[calc(100vh-8rem)] xl:overflow-auto"
              />
            </aside>
          </div>
        </form.AppForm>
      </form>
    </AppLayout>
  );
}
