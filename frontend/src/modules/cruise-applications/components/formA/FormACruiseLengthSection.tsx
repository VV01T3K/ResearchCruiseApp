import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';

import { CruiseApplicationPeriodInput } from '../common/CruiseApplicationPeriodInput';
import { FormABlockadeWarning } from './FormABlockadeWarning';

export function FormACruiseLengthSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted, blockades } = useFormA();

  const [firstInteractionFields, setFirstInteractionFields] = useState<Set<string>>(() => new Set());

  const periodSelectionType = form.state.values.periodSelectionType ?? 'period';

  function handlePeriodFieldClick() {
    if (!firstInteractionFields.has('acceptablePeriod') || !firstInteractionFields.has('optimalPeriod')) {
      if (!firstInteractionFields.has('acceptablePeriod')) {
        form.setFieldValue('acceptablePeriod', ['0', '24']);
        form.validateField('acceptablePeriod', 'change');
      }
      if (!firstInteractionFields.has('optimalPeriod')) {
        form.setFieldValue('optimalPeriod', ['0', '24']);
        form.validateField('optimalPeriod', 'change');
      }
      setFirstInteractionFields(new Set(['acceptablePeriod', 'optimalPeriod']));
    }
  }

  function handlePeriodSelectionChange(value: 'precise' | 'period') {
    form.setFieldValue('periodSelectionType', value);
    setFirstInteractionFields(new Set());

    if (value === 'precise') {
      form.setFieldValue('acceptablePeriod', '');
      form.setFieldValue('optimalPeriod', '');
      form.setFieldMeta('acceptablePeriod', (prev) => ({ ...prev, errors: [] }));
      form.setFieldMeta('optimalPeriod', (prev) => ({ ...prev, errors: [] }));
      form.validateField('acceptablePeriod', 'change');
      form.validateField('optimalPeriod', 'change');
      form.validateField('precisePeriodStart', 'change');
      form.validateField('precisePeriodEnd', 'change');
    } else {
      form.setFieldValue('precisePeriodStart', '');
      form.setFieldValue('precisePeriodEnd', '');
      form.setFieldMeta('precisePeriodStart', (prev) => ({ ...prev, errors: [] }));
      form.setFieldMeta('precisePeriodEnd', (prev) => ({ ...prev, errors: [] }));

      form.setFieldValue('acceptablePeriod', '');
      form.setFieldValue('optimalPeriod', '');
      form.setFieldMeta('acceptablePeriod', (prev) => ({ ...prev, errors: [] }));
      form.setFieldMeta('optimalPeriod', (prev) => ({ ...prev, errors: [] }));
      form.validateField('precisePeriodStart', 'change');
      form.validateField('precisePeriodEnd', 'change');
      form.validateField('acceptablePeriod', 'change');
      form.validateField('optimalPeriod', 'change');
    }
  }

  return (
    <AppAccordion title="2. Czas trwania zgłaszanego rejsu" expandedByDefault>
      <div className="space-y-4">
        <FormABlockadeWarning year={+form.state.values.year} blockades={blockades} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                  <div onClick={handlePeriodFieldClick}>
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
                  </div>
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.acceptablePeriod}
                children={(acceptablePeriod) => (
                  <form.Field
                    name="optimalPeriod"
                    children={(field) => (
                      <div onClick={handlePeriodFieldClick}>
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
                      </div>
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
                      value={parseInt(cruiseHours) / 24}
                      minimum={0}
                      maximum={60}
                      onChange={(x: number) => field.handleChange((x * 24).toString())}
                      onBlur={field.handleBlur}
                      errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                      label="Liczba planowanych dób rejsowych"
                      showRequiredAsterisk
                      disabled={isReadonly}
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
                      value={parseInt(cruiseHours)}
                      minimum={0}
                      maximum={1440}
                      onChange={(x: number) => field.handleChange(x.toString())}
                      onBlur={field.handleBlur}
                      errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                      label="Liczba planowanych godzin rejsowych"
                      showRequiredAsterisk
                      disabled={isReadonly}
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
