import { Collapsible } from '@base-ui/react/collapsible';

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
            <Collapsible.Root open={shipUsage === '4'}>
              <Collapsible.Panel className="h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-200 ease-out data-[ending-style]:h-0 data-[ending-style]:opacity-0 data-[starting-style]:h-0 data-[starting-style]:opacity-0">
                <form.AppField name="differentUsage">
                  {(field) => (
                    <field.TextField
                      label="Inny sposób użycia"
                      placeholder="np. statek badawczy"
                      disabled={isReadonly}
                    />
                  )}
                </form.AppField>
              </Collapsible.Panel>
            </Collapsible.Root>
          </div>
        )}
      </form.Subscribe>
    </Accordion>
  );
}
