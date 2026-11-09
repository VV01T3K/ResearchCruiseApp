import { useAppForm, withFieldGroup } from '@/integrations/tanstack/form/hook';
import { getTaskTypeFields } from '@/features/applications/components/research-tasks/taskTypeFields';
import type { ResearchTaskValues } from '@/features/applications/schemas/types/ResearchTaskValues';

export const ResearchTaskDetails = withFieldGroup({
  defaultValues: {} as ResearchTaskValues,
  props: { type: '', rowLabel: '', disabled: false as boolean | undefined },
  render: function Render({ group, type, rowLabel, disabled }) {
    const { fields } = getTaskTypeFields(type);
    const ariaLabel = (label: string) => `${label}${label.endsWith('?') ? ' ' : ', '}${rowLabel}`;
    return (
      <div className={fields.length > 1 ? 'grid grid-cols-1 gap-4 lg:grid-cols-2' : undefined}>
        {fields.map(({ name, label, kind, placeholder, wide }) => (
          <group.AppField key={name} name={name}>
            {(field) => {
              switch (kind) {
                case 'text':
                  return (
                    <field.TextField
                      aria-label={ariaLabel(label)}
                      label={label}
                      placeholder={placeholder}
                      containerClassName={wide ? 'lg:col-span-2' : undefined}
                      disabled={disabled}
                    />
                  );
                case 'date':
                  return <field.DateField label={label} disabled={disabled} />;
                case 'month':
                  return <field.MonthField label={label} disabled={disabled} />;
                case 'points':
                  return (
                    <field.NumberField
                      nullable
                      aria-label={ariaLabel(label)}
                      minimum={0}
                      step={10}
                      label={label}
                      disabled={disabled}
                    />
                  );
                case 'amount':
                  return (
                    <field.NumberField
                      nullable
                      aria-label={ariaLabel(`${label} [zł]`)}
                      type="float"
                      minimum={0}
                      label={`${label} [zł]`}
                      disabled={disabled}
                    />
                  );
                case 'yesNo':
                  return (
                    <field.SelectField
                      value={String(field.state.value)}
                      onChange={(value) => field.handleChange(value === 'true')}
                      aria-label={ariaLabel(label)}
                      allOptions={[
                        { value: 'true', inlineLabel: 'Tak' },
                        { value: 'false', inlineLabel: 'Nie' },
                      ]}
                      label={label}
                      disabled={disabled}
                    />
                  );
              }
            }}
          </group.AppField>
        ))}
      </div>
    );
  },
});

export function ReadonlyResearchTaskDetails({ data }: { data: ResearchTaskValues }) {
  const form = useAppForm({ defaultValues: { researchTasks: [data] } });
  return (
    <ResearchTaskDetails
      form={form}
      fields="researchTasks[0]"
      type={data.type}
      rowLabel={'title' in data ? data.title : data.description}
      disabled
    />
  );
}
