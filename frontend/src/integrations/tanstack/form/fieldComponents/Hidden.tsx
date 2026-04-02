import { useNormalizedFieldErrors } from './shared';

export function HiddenField() {
  const { field } = useNormalizedFieldErrors<string>();
  const value = field.state.value == null ? '' : String(field.state.value);

  return <input id={field.name} type="hidden" name={field.name} value={value} readOnly />;
}
