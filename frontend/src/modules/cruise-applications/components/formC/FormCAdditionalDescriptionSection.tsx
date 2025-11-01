import { AppAccordion } from '@/core/components/AppAccordion';
import { AppFileInput } from '@/core/components/inputs/AppFileInput';
import { AppInput } from '@/core/components/inputs/AppInput';
import { getErrors } from '@/core/lib/utils';
import { useFormC } from '@/cruise-applications/contexts/FormCContext';

export function FormCAdditionalDescriptionSection() {
  const { form, hasFormBeenSubmitted, isReadonly } = useFormC();

  return (
    <AppAccordion title="18. Krótki opis podsumowujący dany rejs" expandedByDefault>
      <header className="text-center text-sm space-y-4 mb-8 max-w-2xl mx-auto">
        Do ewentualnego wykorzystania do celów promocyjnych, na stronie internetowej, FB itp.; można załączyć zdjęcia w
        osobnych plikach
      </header>
      <form.Field
        name="additionalDescription"
        children={(field) => (
          <AppInput
            name={field.name}
            value={field.state.value ?? ''}
            onChange={field.setValue}
            onBlur={field.handleBlur}
            type="textarea"
            className="h-48"
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            label="Dodatkowy opis"
            placeholder="Dodatkowy opis"
            required
            disabled={isReadonly}
          />
        )}
      />
      <form.Field
        name="photos"
        children={(field) => (
          <AppFileInput
            name="photos"
            value={field.state.value}
            label="Załączniki"
            onChange={field.handleChange}
            onBlur={field.handleBlur}
            errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
            disabled={isReadonly}
            allowMultiple
            maxSizeInMb={10}
            acceptedMimeTypes={['image/jpeg', 'image/png']}
          />
        )}
      />
    </AppAccordion>
  );
}
