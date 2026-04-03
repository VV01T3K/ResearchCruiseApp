import { useStore } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';

import { FormABlockadeWarning } from '@/components/applications/formA/FormABlockadeWarning';
import { type CruisePeriodType } from '@/api/dto/applications/FormADto';
import { CruiseApplicationPeriodInput } from '@/components/applications/common/CruiseApplicationPeriodInput';
import { AppLayout } from '@/components/shared/AppLayout';
import { useFieldContext } from '@/integrations/tanstack/form/context';
import { normalizeErrors } from '@/integrations/tanstack/form/fieldComponents/shared';
import { useAppForm } from '@/integrations/tanstack/form';

import {
  cruiseGoalOptions,
  getCurrentBlockades,
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

const simplifiedExperimentFormASchema = z.object({
  cruiseManagerId: z.uuid(),
  deputyManagerId: z.uuid(),
  year: z.codec(
    z.string(),
    z
      .int()
      .min(new Date().getFullYear() - 1)
      .max(new Date().getFullYear() + 1),
    {
      decode: (string) => Number(string),
      encode: (int) => String(int),
    }
  ),
  period: z.discriminatedUnion('exact', [
    z
      .object({
        exact: z.literal(false),
        acceptable: z
          .object({
            start: z.int().min(0).max(24),
            end: z.int().min(0).max(24),
          })
          .refine(({ start, end }) => start < end, {
            message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
            path: ['end'],
          }),
        optimal: z
          .object({
            start: z.int().min(0).max(24),
            end: z.int().min(0).max(24),
          })
          .refine(({ start, end }) => start < end, {
            message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
            path: ['end'],
          }),
        precise: z.any(),
      })
      .transform(({ precise: _precise, ...period }) => period),
    z
      .object({
        exact: z.literal(true),
        optimal: z.any(),
        acceptable: z.any(),
        precise: z
          .object({
            start: z
              .string()
              .check(z.iso.date())
              .transform((value) => new Date(value)),
            end: z
              .string()
              .check(z.iso.date())
              .transform((value) => new Date(value)),
          })
          .refine(({ start, end }) => start < end, {
            message: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
            path: ['end'],
          }),
      })
      .transform(({ optimal: _optimal, acceptable: _acceptable, ...period }) => period),
  ]),
  notes: z.string(),
  cruiseDurationHours: z.codec(z.string(), z.int().min(1).max(1440), {
    decode: (string) => Number(string),
    encode: (int) => String(int),
  }),
  shipUsage: z.string(),
  differentUsage: z.string(),
  cruiseGoal: z.string(),
  cruiseGoalDescription: z.string(),
});

type SimplifiedExperimentFormAInput = z.input<typeof simplifiedExperimentFormASchema>;
type SimplifiedExperimentFormAOutput = z.output<typeof simplifiedExperimentFormASchema>;
type SimplifiedExperimentPeriodInput = SimplifiedExperimentFormAInput['period'];
type SimplifiedPeriodModeInput = Extract<SimplifiedExperimentPeriodInput, { exact: false }>;
type SimplifiedCruisePeriod = SimplifiedPeriodModeInput['acceptable'];

function toCruisePeriod(period?: SimplifiedCruisePeriod): CruisePeriodType | undefined {
  if (!period) {
    return undefined;
  }

  return [String(period.start), String(period.end)] as CruisePeriodType;
}

function fromCruisePeriod(period: CruisePeriodType): SimplifiedCruisePeriod {
  return {
    start: Number(period[0]),
    end: Number(period[1]),
  };
}

function formatSubmittedValue(value: SimplifiedExperimentFormAOutput) {
  return JSON.stringify(value, null, 2);
}

function SimplifiedCruisePeriodField({ label, maxValues }: { label: string; maxValues?: SimplifiedCruisePeriod }) {
  const field = useFieldContext<SimplifiedCruisePeriod>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const normalizedErrors = field.state.meta.isTouched && errors.length > 0 ? normalizeErrors(errors) : undefined;

  return (
    <CruiseApplicationPeriodInput
      name={field.name}
      value={toCruisePeriod(field.state.value)}
      maxValues={toCruisePeriod(maxValues)}
      onChange={(value) => field.handleChange(fromCruisePeriod(value))}
      onBlur={field.handleBlur}
      errors={normalizedErrors?.map((error) => error.message)}
      label={label}
    />
  );
}

function PeriodTypeField() {
  const field = useFieldContext<boolean>();

  return (
    <div className="flex flex-col">
      <label htmlFor={field.name} className="mb-2 block text-sm font-medium text-gray-900">
        Wybierz sposób określenia terminu rejsu
      </label>
      <select
        id={field.name}
        name={field.name}
        value={field.state.value ? 'precise' : 'period'}
        onChange={(event) => {
          field.handleChange(event.target.value === 'precise');
        }}
        onBlur={field.handleBlur}
        className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 transition duration-300 ease-in-out outline-none hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500 focus:ring-inset"
      >
        <option value="" disabled>
          Wybierz
        </option>
        {periodSelectionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExperimentFormA() {
  const defaultValues: SimplifiedExperimentFormAInput = {
    cruiseManagerId: '',
    deputyManagerId: '',
    year: String(new Date().getFullYear()),
    period: {
      exact: false,
      acceptable: {
        start: 0,
        end: 24,
      },
      optimal: {
        start: 4,
        end: 10,
      },
      precise: {
        start: '',
        end: '',
      },
    },
    notes: '',
    cruiseDurationHours: '',
    shipUsage: '',
    differentUsage: '',
    cruiseGoal: '',
    cruiseGoalDescription: '',
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: simplifiedExperimentFormASchema,
      onSubmit: simplifiedExperimentFormASchema,
    },
    onSubmit: ({ value }) => {
      const parsedValue = simplifiedExperimentFormASchema.parse(value);
      console.log(parsedValue);
      alert(`Form submitted:\n${formatSubmittedValue(parsedValue)}`);
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
                    period: state.values.period,
                    shipUsage: state.values.shipUsage,
                    year: state.values.year,
                  })}
                >
                  {({ period, shipUsage, year }) => {
                    const currentBlockades = getCurrentBlockades(year);
                    // const overlappingBlockades = getOverlappingBlockades(
                    //   {
                    //     acceptablePeriod: toCruisePeriod(period.acceptable) ?? '',
                    //     periodSelectionType: period.type,
                    //     precisePeriodEnd: period.precise.end,
                    //     precisePeriodStart: period.precise.start,
                    //     year,
                    //   },
                    //   currentBlockades
                    // );

                    return (
                      <div className="space-y-5">
                        <FormABlockadeWarning year={Number.parseInt(year, 10)} blockades={currentBlockades} />

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <form.AppField name="period.exact">{() => <PeriodTypeField />}</form.AppField>
                          </div>

                          {period.exact ? (
                            <>
                              <form.AppField name={'period.precise.start' as never}>
                                {(field) => (
                                  <field.NativeDateField
                                    label="Dokładny termin rozpoczęcia rejsu"
                                    testId="experiment-form-a-precise-start"
                                  />
                                )}
                              </form.AppField>

                              <form.AppField name={'period.precise.end' as never}>
                                {(field) => (
                                  <field.NativeDateField
                                    label="Dokładny termin zakończenia rejsu"
                                    min={period.precise.start || undefined}
                                    testId="experiment-form-a-precise-end"
                                  />
                                )}
                              </form.AppField>
                            </>
                          ) : (
                            <>
                              <form.AppField name="period.acceptable">
                                {() => (
                                  <SimplifiedCruisePeriodField label="Dopuszczalny okres, w którym miałby się odbywać rejs" />
                                )}
                              </form.AppField>

                              <form.AppField name="period.optimal">
                                {() => (
                                  <SimplifiedCruisePeriodField
                                    label="Optymalny okres, w którym miałby się odbywać rejs"
                                    maxValues={period.acceptable}
                                  />
                                )}
                              </form.AppField>
                            </>
                          )}

                          {/* {overlappingBlockades.length > 0 ? (
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
                          ) : null} */}

                          <div className="md:col-span-2">
                            <form.AppField name="cruiseDurationHours">
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
                            <form.AppField name="notes">
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
