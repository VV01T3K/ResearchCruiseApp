import { useFieldContext } from '@/integrations/tanstack/form/context';

export function HiddenField() {
  const field = useFieldContext<string>();
  const value = field.state.value == null ? '' : String(field.state.value);

  return <input id={field.name} type="hidden" name={field.name} value={value} readOnly />;
}
