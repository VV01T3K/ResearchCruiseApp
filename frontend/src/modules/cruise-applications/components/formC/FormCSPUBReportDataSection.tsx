import { AppAccordion } from '@/core/components/AppAccordion';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';

export function FormCSPUBReportDataSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion title="17. Dodatkowe dane do raportu SPUB" expandedByDefault>
      <header className="text-center text-sm space-y-4 mb-8 max-w-2xl mx-auto">
        Wpisać czy podczas rejsu były pozyskane dane do ekspertyzy lub do oceny oddziaływań na środowisko przy
        współpracy z otoczeniem gospodarczym i biznesowym lub w celach popularnonaukowych, edukacyjnych,
        reprezentacyjnych, lub odbywając szkolenie doskonalące z wykonywania prac z wykorzystaniem aparatury
        naukowo-badawczej, itp.
      </header>
      <form.Field
        name="spubReportData"
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value ?? ''}
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            type="textarea"
            className="h-48"
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            placeholder="Wpisz dodatkowe dane do raportu SPUB"
            required
            disabled={isReadonly}
          />
        )}
      />
    </AppAccordion>
  );
}
