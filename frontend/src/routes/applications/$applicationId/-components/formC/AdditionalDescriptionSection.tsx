import { AppAccordion } from '@/components/shared/AppAccordion';
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
        <form.AppField
          name="additionalDescription"
          children={(field) => (
            <field.TextField
              onChange={field.setValue}
              type="textarea"
              className="h-48"
              label="Dodatkowy opis"
              placeholder="Dodatkowy opis"
              disabled={isReadonly}
              data-testid="form-c-description-input"
              data-testid-errors="form-c-description-errors"
            />
          )}
        />
        <form.AppField
          name="photos"
          children={(field) => (
            <field.FilesField
              label="Załączniki"
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
