import { AppAccordion } from '@/core/components/AppAccordion';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { useFormB } from '@/cruise-applications/contexts/FormBContext';

export function FormBCruiseManagerInfoSection() {
  const { form, formA, formAInitValues, hasFormBeenSubmitted, isReadonly } = useFormB();

  return (
    <AppAccordion title="2. Kierownik zgłaszanego rejsu" expandedByDefault>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <AppDropdownInput
            name="cruiseManager"
            value={formA.cruiseManagerId}
            allOptions={formAInitValues.cruiseManagers.map((cruiseManager) => ({
              inlineLabel: `${cruiseManager.firstName} ${cruiseManager.lastName} (${cruiseManager.email})`,
              value: cruiseManager.id,
            }))}
            label="Kierownik rejsu"
            disabled
          />
        </div>
        <div>
          <AppDropdownInput
            name="deputyManager"
            value={formA.deputyManagerId}
            allOptions={formAInitValues.deputyManagers.map((deputyManager) => ({
              inlineLabel: `${deputyManager.firstName} ${deputyManager.lastName} (${deputyManager.email})`,
              value: deputyManager.id,
            }))}
            label="Zastępca kierownika rejsu"
            disabled
          />
        </div>
        <div className="grid place-items-center">
          <form.Field
            name="isCruiseManagerPresent"
            children={(field) => (
              <AppCheckbox
                size="md"
                name={field.name}
                checked={field.state.value === 'true'}
                onChange={(value) => field.handleChange(value ? 'true' : 'false')}
                onBlur={field.handleBlur}
                errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
                label="Czy kierownik jest obecny na rejsie?"
                disabled={isReadonly}
              />
            )}
          />
        </div>
      </div>
    </AppAccordion>
  );
}
