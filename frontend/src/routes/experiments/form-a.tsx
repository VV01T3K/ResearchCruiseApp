import { createFileRoute } from '@tanstack/react-router';
import KeyFillIcon from 'bootstrap-icons/icons/key-fill.svg?react';

import { CruiseApplicationDropdownElementSelectorButton } from '@/components/applications/common/CruiseApplicationDropdownElementSelectorButton';
import { FormABlockadeWarning } from '@/components/applications/formA/FormABlockadeWarning';
import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppTableDeleteRowButton } from '@/components/shared/table/AppTableDeleteRowButton';
import { useAppForm } from '@/integrations/tanstack/form';

import {
  cruiseGoalOptions,
  formatBlockadeDate,
  getCurrentBlockades,
  getOverlappingBlockades,
  defaultValues,
  managerOptions,
  researchAreaOptions,
  shipUsageOptions,
  experimentFormASchema,
  yearOptions,
} from './-form-a';
import { ExperimentCruisePeriodField, PeriodTypeField, SectionCard } from './-componets-a';

function getMatchingResearchArea(name: string) {
  return researchAreaOptions.find(
    (option) => option.name.trim().toLocaleLowerCase() === name.trim().toLocaleLowerCase()
  );
}

export const Route = createFileRoute('/experiments/form-a')({
  component: ExperimentFormA,
});

function useExperimentFormA() {
  return useAppForm({
    defaultValues,
    validators: {
      onChange: experimentFormASchema,
      onSubmit: experimentFormASchema,
    },
    onSubmit: ({ value }) => {
      const parsedValue = experimentFormASchema.parse(value);
      console.log(parsedValue);
      alert(`Form submitted:\n${JSON.stringify(parsedValue, null, 2)}`);
    },
  });
}

function ExperimentFormA() {
  const form = useExperimentFormA();

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
                description="Sekcja testuje podstawowe selecty oraz zależności między osobami."
                testId="experiment-form-a-section-1"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <form.AppField name="section1.cruiseManagerId">
                    {(field) => (
                      <field.SelectField
                        label="Kierownik rejsu"
                        values={managerOptions}
                        placeholder="Wybierz kierownika rejsu"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="section1.deputyManagerId">
                    {(field) => (
                      <field.SelectField
                        label="Zastępca kierownika rejsu"
                        values={managerOptions}
                        placeholder="Wybierz zastępcę kierownika rejsu"
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
                    period: state.values.section2.period,
                    year: state.values.section2.year,
                  })}
                >
                  {({ period, year }) => {
                    const currentBlockades = getCurrentBlockades(year);
                    const overlappingBlockades = getOverlappingBlockades(
                      {
                        period,
                        year,
                      },
                      currentBlockades
                    );

                    return (
                      <div className="space-y-5">
                        <FormABlockadeWarning year={Number.parseInt(year, 10)} blockades={currentBlockades} />

                        <div className="grid gap-5 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <form.AppField name="section2.year">
                              {(field) => (
                                <field.SelectField
                                  label="Rok"
                                  values={yearOptions.map((value) => ({
                                    value,
                                    label: value,
                                  }))}
                                  placeholder="Wybierz rok"
                                />
                              )}
                            </form.AppField>
                          </div>

                          <div className="md:col-span-2">
                            <form.AppField name="section2.period.exact">{() => <PeriodTypeField />}</form.AppField>
                          </div>

                          {period.exact ? (
                            <>
                              <form.AppField name="section2.period.precise.start">
                                {(field) => (
                                  <field.NativeDateField
                                    label="Dokładny termin rozpoczęcia rejsu"
                                    testId="experiment-form-a-precise-start"
                                  />
                                )}
                              </form.AppField>

                              <form.AppField name="section2.period.precise.end">
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
                              <form.AppField name="section2.period.acceptable">
                                {() => (
                                  <ExperimentCruisePeriodField label="Dopuszczalny okres, w którym miałby się odbywać rejs" />
                                )}
                              </form.AppField>

                              <form.AppField name="section2.period.optimal">
                                {() => (
                                  <ExperimentCruisePeriodField
                                    label="Optymalny okres, w którym miałby się odbywać rejs"
                                    maxValues={period.acceptable}
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
                            <div className="space-y-4" data-testid="experiment-form-a-cruise-duration">
                              <p className="text-sm font-medium text-gray-900">Planowany czas rejsu</p>

                              <div className="grid gap-4 md:grid-cols-2">
                                <form.AppField
                                  name="section2.cruiseDurationDays"
                                  listeners={{
                                    onChange: ({ value, fieldApi }) => {
                                      const nextHours = Math.max(0, Math.min(1440, Math.round(value * 24)));
                                      const currentHours = fieldApi.form.getFieldValue('section2.cruiseDurationHours');

                                      if (currentHours !== nextHours) {
                                        fieldApi.form.setFieldValue('section2.cruiseDurationHours', nextHours);
                                      }
                                    },
                                  }}
                                >
                                  {(field) => (
                                    <field.FloatField
                                      label="Liczba planowanych dób rejsowych"
                                      minimum={0}
                                      maximum={60}
                                      step={0.25}
                                      precision={2}
                                      testId="experiment-form-a-days-input"
                                    />
                                  )}
                                </form.AppField>

                                <form.AppField
                                  name="section2.cruiseDurationHours"
                                  listeners={{
                                    onChange: ({ value, fieldApi }) => {
                                      const nextDays = Number((value / 24).toFixed(2));
                                      const currentDays = fieldApi.form.getFieldValue('section2.cruiseDurationDays');

                                      if (currentDays !== nextDays) {
                                        fieldApi.form.setFieldValue('section2.cruiseDurationDays', nextDays);
                                      }
                                    },
                                  }}
                                >
                                  {(field) => (
                                    <field.IntegerField
                                      label="Liczba planowanych godzin rejsowych"
                                      minimum={0}
                                      maximum={1440}
                                      testId="experiment-form-a-hours-input"
                                    />
                                  )}
                                </form.AppField>
                              </div>
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <form.AppField name="section2.notes">
                              {(field) => <field.TextAreaField label="Uwagi dotyczące terminu" rows={3} />}
                            </form.AppField>
                          </div>

                          <div className="md:col-span-2">
                            <form.AppField name="section2.shipUsage.type">
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

                          <form.Subscribe selector={(state) => state.values.section2.shipUsage.type === '4'}>
                            {(showDifferentUsage) =>
                              showDifferentUsage ? (
                                <div className="md:col-span-2">
                                  <form.AppField name="section2.shipUsage.description">
                                    {(field) => (
                                      <field.TextField
                                        label="Inny sposób użycia"
                                        placeholder="Opisz niestandardowy sposób wykorzystania statku"
                                      />
                                    )}
                                  </form.AppField>
                                </div>
                              ) : null
                            }
                          </form.Subscribe>
                        </div>
                      </div>
                    );
                  }}
                </form.Subscribe>
              </SectionCard>

              <SectionCard
                number="3"
                title="Dodatkowe pozwolenia do planowanych podczas rejsu badań"
                description="Sekcja ćwiczy tablicowe pola TanStack Form: dodawanie, usuwanie i walidację zagnieżdżonych wierszy."
                testId="experiment-form-a-section-3"
              >
                <form.Field name="section3.permissions" mode="array">
                  {(field) => (
                    <div className="space-y-4" data-testid="experiment-form-a-permissions">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">Dodaj każde wymagane pozwolenie jako osobny wiersz.</p>

                        <AppButton
                          onClick={() => {
                            field.pushValue({ description: '', executive: '' });
                          }}
                          data-testid="experiment-form-a-add-permission"
                        >
                          Dodaj pozwolenie
                        </AppButton>
                      </div>

                      {field.state.value.length === 0 ? (
                        <AppAlert variant="info" data-testid="experiment-form-a-permissions-empty">
                          <div className="text-sm">Nie dodano jeszcze żadnego pozwolenia.</div>
                        </AppAlert>
                      ) : (
                        <div
                          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                          data-testid="experiment-form-a-permissions-table"
                        >
                          <div className="overflow-x-auto">
                            <div className="min-w-190">
                              <div className="grid grid-cols-[72px_minmax(0,1.3fr)_minmax(0,0.9fr)_96px] border-b border-gray-200 bg-gray-50">
                                <div className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Lp.</div>
                                <div className="px-4 py-3 text-sm font-semibold text-gray-700">Treść pozwolenia</div>
                                <div className="px-4 py-3 text-sm font-semibold text-gray-700">Organ wydający</div>
                                <div className="px-4 py-3" />
                              </div>

                              {field.state.value.map((_, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-[72px_minmax(0,1.3fr)_minmax(0,0.9fr)_96px] border-b border-gray-200 align-top last:border-b-0"
                                  data-testid={`experiment-form-a-permission-row-${index}`}
                                >
                                  <div className="px-4 py-4 text-center">
                                    <span className="inline-flex h-10 items-center font-semibold text-gray-500">
                                      {index + 1}.
                                    </span>
                                  </div>

                                  <div className="px-4 py-4">
                                    <form.AppField name={`section3.permissions[${index}].description`}>
                                      {(subField) => <subField.TextField placeholder="Opisz wymagane pozwolenie" />}
                                    </form.AppField>
                                  </div>

                                  <div className="px-4 py-4">
                                    <form.AppField name={`section3.permissions[${index}].executive`}>
                                      {(subField) => (
                                        <subField.TextField placeholder="Podaj organ wydający pozwolenie" />
                                      )}
                                    </form.AppField>
                                  </div>

                                  <div className="flex justify-end px-4 py-4">
                                    <span className="inline-flex h-10 items-center">
                                      <AppTableDeleteRowButton
                                        onClick={() => field.removeValue(index, { dontValidate: true })}
                                      />
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </SectionCard>

              <SectionCard
                number="4"
                title="Rejony prowadzenia badań"
                description="Sekcja odtwarza produkcyjny przepływ dodawania rejonów z listy albo wpisania własnej nazwy."
                testId="experiment-form-a-section-4"
              >
                <form.Field name="section4.researchAreaDescriptions" mode="array">
                  {(field) => (
                    <div className="space-y-4" data-testid="experiment-form-a-research-areas">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-gray-600">
                          Dodaj rejony z listy albo wybierz opcję „Inne...”, żeby wpisać własną nazwę.
                        </p>

                        <CruiseApplicationDropdownElementSelectorButton
                          variant="primary"
                          options={researchAreaOptions.concat([{ id: '', name: 'Inne...' }]).map((area) => ({
                            value: area.name,
                            onClick: () => {
                              field.pushValue({
                                areaId: area.id || null,
                                differentName: area.name === 'Inne...' ? '' : area.name,
                                info: '',
                              });
                            },
                          }))}
                          data-testid="experiment-form-a-add-research-area"
                        >
                          Dodaj rejon
                        </CruiseApplicationDropdownElementSelectorButton>
                      </div>

                      {field.state.value.length === 0 ? (
                        <AppAlert variant="info" data-testid="experiment-form-a-research-areas-empty">
                          <div className="text-sm">Nie dodano jeszcze żadnego rejonu.</div>
                        </AppAlert>
                      ) : (
                        <div
                          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                          data-testid="experiment-form-a-research-areas-table"
                        >
                          <div className="overflow-x-auto">
                            <div className="min-w-220">
                              <div className="grid grid-cols-[72px_minmax(0,1fr)_minmax(0,0.9fr)_96px] border-b border-gray-200 bg-gray-50">
                                <div className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Lp.</div>
                                <div className="px-4 py-3 text-sm font-semibold text-gray-700">
                                  Rejon prowadzenia badań
                                </div>
                                <div className="px-4 py-3 text-sm font-semibold text-gray-700">
                                  Informacje dodatkowe
                                </div>
                                <div className="px-4 py-3" />
                              </div>

                              {field.state.value.map((_, index) => (
                                <div
                                  key={index}
                                  className="grid grid-cols-[72px_minmax(0,1fr)_minmax(0,0.9fr)_96px] border-b border-gray-200 align-top last:border-b-0"
                                  data-testid={`experiment-form-a-research-area-row-${index}`}
                                >
                                  <div className="px-4 py-4 text-center">
                                    <span className="inline-flex h-10 items-center font-semibold text-gray-500">
                                      {index + 1}.
                                    </span>
                                  </div>

                                  <div className="px-4 py-4">
                                    <form.AppField name={`section4.researchAreaDescriptions[${index}].areaId`}>
                                      {(areaIdField) => (
                                        <form.AppField
                                          listeners={{
                                            onChange: ({ value }) => {
                                              form.setFieldValue(
                                                `section4.researchAreaDescriptions[${index}].areaId`,
                                                getMatchingResearchArea(value)?.id || null
                                              );
                                            },
                                          }}
                                          name={`section4.researchAreaDescriptions[${index}].differentName`}
                                        >
                                          {(subField) => (
                                            <subField.TextField
                                              placeholder="Nazwa rejonu"
                                              endAdornment={
                                                areaIdField.state.value ? (
                                                  <KeyFillIcon
                                                    className="h-4 w-4 rotate-45 text-success-dark"
                                                    title="Powiązany z listą rejonów"
                                                    aria-label="Powiązany z listą rejonów"
                                                  />
                                                ) : undefined
                                              }
                                            />
                                          )}
                                        </form.AppField>
                                      )}
                                    </form.AppField>
                                  </div>

                                  <div className="px-4 py-4">
                                    <form.AppField name={`section4.researchAreaDescriptions[${index}].info`}>
                                      {(subField) => (
                                        <subField.TextField placeholder="np. szczegóły dotyczące celu rejsu" />
                                      )}
                                    </form.AppField>
                                  </div>

                                  <div className="flex justify-end px-4 py-4">
                                    <span className="inline-flex h-10 items-center">
                                      <AppTableDeleteRowButton
                                        onClick={() => {
                                          field.removeValue(index, { dontValidate: true });
                                        }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </form.Field>
              </SectionCard>

              <SectionCard
                number="5"
                title="Cel rejsu"
                description="Sekcja pokazuje zależność między wybranym celem a wymaganym opisem."
                testId="experiment-form-a-section-5"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <form.AppField name="section5.cruiseGoal.type">
                    {(field) => (
                      <field.SelectField
                        label="Cel rejsu"
                        values={cruiseGoalOptions.map((option) => ({
                          value: option.value,
                          label: option.label,
                        }))}
                        placeholder="Wybierz cel rejsu"
                      />
                    )}
                  </form.AppField>

                  <form.Subscribe selector={(state) => state.values.section5.cruiseGoal.type === ''}>
                    {(isGoalDescriptionDisabled) => (
                      <form.AppField name="section5.cruiseGoal.description">
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
