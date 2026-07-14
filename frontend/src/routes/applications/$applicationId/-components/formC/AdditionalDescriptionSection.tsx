import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppFileInput } from '@/components/shared/inputs/AppFileInput';
import { AppInput } from '@/components/shared/inputs/AppInput';
import { getErrors } from '@/lib/form-errors';
import { withForm } from '@/lib/form';
import type { FormCViewModel } from '@/routes/applications/$applicationId/-models/formC-view-model';
import { formCDefaultValues } from '@/routes/applications/$applicationId/-schemas/formC.schema';

export const AdditionalDescriptionSection = withForm({
  defaultValues: formCDefaultValues,
  props: {} as { context: FormCViewModel },
  render: function AdditionalDescriptionSection({ form, context }) {
    const { isReadonly } = context;

    return (
      <AppAccordion
        title="18. Krótki opis podsumowujący dany rejs"
        expandedByDefault
        data-testid="form-c-additional-description-section"
      >
        <header className="mx-auto mb-8 max-w-2xl space-y-4 text-center text-sm">
          Do ewentualnego wykorzystania do celów promocyjnych, na stronie internetowej, FB itp.; można załączyć zdjęcia
          w osobnych plikach
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
              errors={getErrors(field.state.meta)}
              label="Dodatkowy opis"
              placeholder="Dodatkowy opis"
              disabled={isReadonly}
              data-testid="form-c-description-input"
              data-testid-errors="form-c-description-errors"
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
              errors={getErrors(field.state.meta)}
              disabled={isReadonly}
              allowMultiple
              maxSizeInMb={10}
              acceptedMimeTypes={['image/jpeg', 'image/png']}
              data-testid-button="form-c-attachment-input-button"
              data-testid-errors="form-c-attachment-input-errors"
            />
          )}
        />
      </AppAccordion>
    );
  },
});
