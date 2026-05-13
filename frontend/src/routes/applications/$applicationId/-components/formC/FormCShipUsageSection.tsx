import { AnimatePresence, motion } from 'motion/react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppDropdownInput } from '@/components/shared/inputs/AppDropdownInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { getErrors } from '@/lib/utils';
import { useFormC } from '@/contexts/applications/FormCContext';

export function FormCShipUsageSection() {
  const { form, isReadonly, formAInitValues, hasFormBeenSubmitted } = useFormC();

  return (
    <AppAccordion title="3. Sposób wykorzystania statku" expandedByDefault data-testid="form-c-ship-usage-section">
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
              label="Statek na potrzeby badań był wykorzystywany"
              allOptions={formAInitValues?.shipUsages.map((shipUsage, i) => ({
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
    </AppAccordion>
  );
}
