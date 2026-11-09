import { Accordion } from '@/components/shared/Accordion';
import { useTypedAppFormContext } from '@/integrations/tanstack/form/hook';
import type { FormCViewModel } from '@/features/applications/models/formC-view-model';
import { formCDefaultValues } from '@/features/applications/schemas/formC.schema';

export function AdditionalDescriptionSection({ context }: { context: FormCViewModel }) {
  const form = useTypedAppFormContext({ defaultValues: formCDefaultValues });
  const { isReadonly } = context;

  return (
    <Accordion title="18. Krótki opis podsumowujący dany rejs" expandedByDefault>
      <header className="mx-auto mb-8 max-w-2xl space-y-4 text-center text-sm">
        Do ewentualnego wykorzystania do celów promocyjnych, na stronie internetowej, FB itp.; można załączyć zdjęcia w
        osobnych plikach
      </header>
      <form.AppField name="additionalDescription">
        {(field) => (
          <field.TextField
            type="textarea"
            className="h-48"
            label="Dodatkowy opis"
            placeholder="Dodatkowy opis"
            disabled={isReadonly}
          />
        )}
      </form.AppField>
      <form.AppField name="photos">
        {(field) => (
          <field.FileField
            label="Załączniki"
            disabled={isReadonly}
            allowMultiple
            maxSizeInMb={10}
            acceptedMimeTypes={['image/jpeg', 'image/png']}
          />
        )}
      </form.AppField>
    </Accordion>
  );
}
