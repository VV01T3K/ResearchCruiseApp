import { AnimatePresence, motion } from 'motion/react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { getErrors } from '@/core/lib/utils';
import { useFormA } from '@/cruise-applications/contexts/FormAContext';

import { FormAPeriodInput } from '../FormAPeriodInput';

export function FormACruiseLengthSection() {
  const { form, isReadonly, initValues, hasFormBeenSubmitted } = useFormA();

  return (
    <AppAccordion title="2. Czas trwania zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <form.Field
          name="acceptablePeriod"
          children={(field) => (
            <FormAPeriodInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              label="Dopuszczalny okres, w którym miałby się odbywać rejs"
              required
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
                <FormAPeriodInput
                  name={field.name}
                  value={field.state.value}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                  maxValues={acceptablePeriod}
                  label="Optymalny okres, w którym miałby się odbywać rejs"
                  required
                  disabled={isReadonly}
                />
              )}
            />
          )}
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
                    value={parseInt(cruiseHours) / 24}
                    minimum={0}
                    maximum={60}
                    onChange={(x: number) => field.handleChange((x * 24).toString())}
                    onBlur={field.handleBlur}
                    errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                    label="Liczba planowanych dób rejsowych"
                    required
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
                    required
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
                value={field.state.value as string | number}
                onChange={(e) => field.handleChange(e as string)}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Statek na potrzeby badań będzie wykorzystywany"
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
                          required
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
    </AppAccordion>
  );
}
