import { useStore } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';
import { CruisePeriodType } from '@/cruise-applications/models/FormADto';

import { CruiseApplicationPeriodInput } from '../common/CruiseApplicationPeriodInput';
import { FormABlockadeWarning } from './FormABlockadeWarning';

function isValidPeriod(period: unknown): period is CruisePeriodType {
  return Array.isArray(period) && period.length === 2 && period[0] !== '' && period[1] !== '';
}

export function FormACruiseLengthSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted, blockades } = useFormA();

  const year = useStore(form.store, (state) => state.values.year);
  const periodSelectionType = useStore(form.store, (state) => state.values.periodSelectionType ?? 'period');
  const acceptablePeriod = useStore(form.store, (state) => state.values.acceptablePeriod);
  const optimalPeriod = useStore(form.store, (state) => state.values.optimalPeriod);
  const precisePeriodStart = useStore(form.store, (state) => state.values.precisePeriodStart);
  const precisePeriodEnd = useStore(form.store, (state) => state.values.precisePeriodEnd);

  const savedPeriodValuesRef = useRef<{ acceptable: CruisePeriodType; optimal: CruisePeriodType } | null>(null);
  const savedPreciseValuesRef = useRef<{ start: string; end: string } | null>(null);

  useEffect(() => {
    if (periodSelectionType !== 'period' || isReadonly) return;

    if (!isValidPeriod(acceptablePeriod)) {
      form.setFieldValue('acceptablePeriod', ['0', '24'] as CruisePeriodType);
    }
    if (!isValidPeriod(optimalPeriod)) {
      form.setFieldValue('optimalPeriod', ['0', '24'] as CruisePeriodType);
    }
  }, [periodSelectionType, isReadonly, acceptablePeriod, optimalPeriod, form]);

  function handlePeriodSelectionChange(value: 'precise' | 'period') {
    if (periodSelectionType === 'period' && isValidPeriod(acceptablePeriod) && isValidPeriod(optimalPeriod)) {
      savedPeriodValuesRef.current = { acceptable: acceptablePeriod, optimal: optimalPeriod };
    } else if (periodSelectionType === 'precise' && (precisePeriodStart || precisePeriodEnd)) {
      savedPreciseValuesRef.current = { start: precisePeriodStart, end: precisePeriodEnd };
    }

    form.setFieldValue('periodSelectionType', value);

    if (value === 'period') {
      const restored = savedPeriodValuesRef.current;
      form.setFieldValue('acceptablePeriod', restored?.acceptable ?? (['0', '24'] as CruisePeriodType));
      form.setFieldValue('optimalPeriod', restored?.optimal ?? (['0', '24'] as CruisePeriodType));
      form.setFieldValue('precisePeriodStart', '');
      form.setFieldValue('precisePeriodEnd', '');
    } else {
      const restored = savedPreciseValuesRef.current;
      form.setFieldValue('acceptablePeriod', '');
      form.setFieldValue('optimalPeriod', '');
      form.setFieldValue('precisePeriodStart', restored?.start ?? '');
      form.setFieldValue('precisePeriodEnd', restored?.end ?? '');
    }
  }

  return (
    <AppAccordion
      title="2. Czas trwania zgłaszanego rejsu"
      expandedByDefault
      data-testid="form-a-cruise-length-section"
    >
      <div className="space-y-4">
        <FormABlockadeWarning year={+year} blockades={blockades} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {!isReadonly && (
            <div className="lg:col-span-2">
              <AppDropdownInput
                name="periodSelectionType"
                value={periodSelectionType}
                onChange={(value) => handlePeriodSelectionChange(value as 'precise' | 'period')}
                label="Wybierz sposób określenia terminu rejsu"
                allOptions={[
                  { value: 'precise', inlineLabel: 'Dokładny termin' },
                  { value: 'period', inlineLabel: 'Okres dopuszczalny/optymalny' },
                ]}
                showRequiredAsterisk
                data-testid="form-a-period-selection-type"
                data-testid-button="form-a-period-selection-type-button"
              />
            </div>
          )}
          {periodSelectionType === 'precise' && (
            <>
              <form.Field
                name="precisePeriodStart"
                children={(field) => (
                  <AppDatePickerInput
                    name={field.name}
                    value={field.state.value}
                    onChange={(newValue) => field.handleChange(newValue ?? '')}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                    label="Dokładny termin rozpoczęcia rejsu"
                    type="date"
                    showRequiredAsterisk
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.precisePeriodStart}
                children={(precisePeriodStart) => (
                  <form.Field
                    name="precisePeriodEnd"
                    children={(field) => (
                      <AppDatePickerInput
                        name={field.name}
                        value={field.state.value}
                        onChange={(newValue) => {
                          field.handleChange(newValue ?? '');
                          form.validateField('precisePeriodStart', 'change');
                        }}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                        label="Dokładny termin zakończenia rejsu"
                        type="date"
                        showRequiredAsterisk
                        disabled={isReadonly}
                        selectionStartDate={precisePeriodStart ? new Date(precisePeriodStart) : undefined}
                        minimalDate={precisePeriodStart ? new Date(precisePeriodStart) : undefined}
                      />
                    )}
                  />
                )}
              />
            </>
          )}

          {periodSelectionType === 'period' && (
            <>
              <form.Field
                name="acceptablePeriod"
                children={(field) => (
                  <CruiseApplicationPeriodInput
                    name={field.name}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                    label="Dopuszczalny okres, w którym miałby się odbywać rejs"
                    showRequiredAsterisk
                    disabled={isReadonly}
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.acceptablePeriod}
                children={(acceptablePeriod) => (
                  <form.Field
                    name="optimalPeriod"
                    children={(field) => (
                      <CruiseApplicationPeriodInput
                        name={field.name}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                        maxValues={acceptablePeriod}
                        label="Optymalny okres, w którym miałby się odbywać rejs"
                        showRequiredAsterisk
                        disabled={isReadonly}
                      />
                    )}
                  />
                )}
              />
            </>
          )}

          <form.Subscribe
            selector={(state) => state.values.cruiseHours}
            children={(cruiseHours) => {
              return (
                <form.Field
                  name="cruiseHours"
                  children={(field) => (
                    <AppNumberInput
                      name={field.name}
                      value={parseFloat(cruiseHours) / 24}
                      minimum={0}
                      maximum={60}
                      step={1}
                      type="float"
                      onChange={(x: number) => field.handleChange((x * 24).toString())}
                      onBlur={field.handleBlur}
                      errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                      label="Liczba planowanych dób rejsowych"
                      showRequiredAsterisk
                      disabled={isReadonly}
                      data-testid="form-a-cruise-days"
                      data-testid-input="form-a-cruise-days-input"
                    />
                  )}
                />
              );
            }}
          />

          <form.Subscribe
            selector={(state) => state.values.cruiseHours}
            children={(cruiseHours) => {
              return (
                <form.Field
                  name="cruiseHours"
                  children={(field) => (
                    <AppNumberInput
                      name={field.name}
                      value={parseFloat(cruiseHours)}
                      minimum={0}
                      maximum={1440}
                      onChange={(x: number) => field.handleChange(x.toString())}
                      onBlur={field.handleBlur}
                      errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                      label="Liczba planowanych godzin rejsowych"
                      showRequiredAsterisk
                      disabled={isReadonly}
                      data-testid="form-a-cruise-hours"
                      data-testid-input="form-a-cruise-hours-input"
                      data-testid-errors="form-a-cruise-hours-errors"
                    />
                  )}
                />
              );
            }}
          />

          <form.Field
            name="periodNotes"
            children={(field) => (
              <div className="lg:col-span-2">
                <AppInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Uwagi dotyczące terminu"
                  placeholder='np. "Rejs w okresie wakacyjnym"'
                  disabled={isReadonly}
                  data-testid="form-a-period-notes-input"
                />
              </div>
            )}
          />

          <form.Field
            name="shipUsage"
            children={(field) => (
              <div className="lg:col-span-2">
                <AppDropdownInput
                  name="shipUsage"
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e as string)}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  label="Statek na potrzeby badań będzie wykorzystywany"
                  showRequiredAsterisk
                  allOptions={initValues?.shipUsages.map((shipUsage, i) => ({
                    value: i.toString(),
                    inlineLabel: shipUsage,
                  }))}
                  disabled={isReadonly}
                  data-testid-button="form-a-ship-usage-button"
                />
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => state.values.shipUsage}
            children={(shipUsage) => (
              <div className="lg:col-span-2">
                <AnimatePresence>
                  {shipUsage === '4' && (
                    <motion.div
                      initial={{ opacity: 0, translateY: '-10%' }}
                      animate={{ opacity: 1, translateY: '0' }}
                      exit={{ opacity: 0, translateY: '-10%' }}
                      transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                      <form.Field
                        name="differentUsage"
                        children={(field) => (
                          <AppInput
                            name={field.name}
                            value={field.state.value}
                            onChange={field.handleChange}
                            onBlur={field.handleBlur}
                            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                            label="Inny sposób użycia"
                            placeholder="np. statek badawczy"
                            showRequiredAsterisk
                            disabled={isReadonly}
                            data-testid="form-a-alternative-ship-usage-input"
                          />
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          />
        </div>
      </div>
    </AppAccordion>
  );
}
