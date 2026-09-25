import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';
import { AppMonthPickerInput } from '@/components/shared/inputs/dates/AppMonthPickerInput';

describe.each([AppDatePickerInput, AppMonthPickerInput])('%s accessibility', (Picker) => {
  it('connects the visible button to its label, helper and validation error', () => {
    const html = renderToStaticMarkup(
      <Picker name="date" value={undefined} label="Termin" helper="Wybierz termin" errors={['Wymagana data']} />
    );
    const labelId = html.match(/<label[^>]*for="([^"]+)"/)?.[1];
    expect(labelId).toBeTruthy();
    const button = html.match(/<button\b[^>]*>/)?.[0];
    expect(button).toContain(`id="${labelId}"`);
    expect(button).toContain('aria-invalid="true"');
    expect(button).toContain(`aria-describedby="${labelId}-helper ${labelId}-errors"`);
    expect(html).toContain(`id="${labelId}-helper"`);
    expect(html).toContain(`id="${labelId}-errors"`);
  });

  it('disables the visible button when the field is disabled', () => {
    const html = renderToStaticMarkup(<Picker name="date" value={undefined} disabled />);
    expect(html.match(/<button\b[^>]*>/)?.[0]).toContain('disabled=""');
  });
});
