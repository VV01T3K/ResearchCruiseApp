import { AnimatePresence, motion } from 'motion/react';

import { Accordion } from '@/components/shared/Accordion';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';

export function ShipUsageSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly, formAInitValues } = context;

  return (
    <Accordion title="3. Sposób wykorzystania statku" expandedByDefault>
      <form.AppField name="shipUsage">
        {(field) => (
          <div className="lg:col-span-2">
            <field.SelectField
              label="Statek na potrzeby badań był wykorzystywany"
              allOptions={formAInitValues?.shipUsages.map((shipUsage, i) => ({
                value: i.toString(),
                inlineLabel: shipUsage,
              }))}
              disabled={isReadonly}
            />
          </div>
        )}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.shipUsage}>
        {(shipUsage) => (
          <div className="lg:col-span-2">
            <AnimatePresence>
              {shipUsage === '4' && (
                <motion.div
                  initial={{ opacity: 0, translateY: '-10%' }}
                  animate={{ opacity: 1, translateY: '0' }}
                  exit={{ opacity: 0, translateY: '-10%' }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                >
                  <form.AppField name="differentUsage">
                    {(field) => (
                      <field.TextField
                        label="Inny sposób użycia"
                        placeholder="np. statek badawczy"
                        disabled={isReadonly}
                      />
                    )}
                  </form.AppField>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </form.Subscribe>
    </Accordion>
  );
}
