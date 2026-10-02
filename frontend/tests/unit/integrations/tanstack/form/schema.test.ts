import { formValidationLogic } from '@/integrations/tanstack/form/validation';
import { describe, expect, it, vi } from 'vitest';
import { FieldApi, FormApi } from '@tanstack/react-form';
import { z } from 'zod';

import { submissionSchema } from '@/integrations/tanstack/form/schema';
import { submitApplicationForm } from '@/integrations/tanstack/form/submitApplicationForm';
import { getErrors } from '@/integrations/tanstack/form/errors';
import {
  formBDefaultValues,
  getFormBSubmissionSchema,
} from '@/routes/applications/$applicationId/-schemas/formB.schema';

describe('form submission contracts', () => {
  it('waits for blur and clears errors while correcting before the first submission', async () => {
    const form = new FormApi({
      defaultValues: { name: '', other: '' },
      validationLogic: formValidationLogic,
      validators: { onDynamic: z.object({ name: z.string().min(3), other: z.string().min(3) }) },
    });
    const unmount = form.mount();
    const field = new FieldApi({ form, name: 'name' });
    const unmountField = field.mount();
    const other = new FieldApi({ form, name: 'other' });
    const unmountOther = other.mount();
    try {
      field.handleChange('a');
      expect(field.state.meta.errors).toEqual([]);
      field.handleBlur();
      expect(field.state.meta.errors.length).toBeGreaterThan(0);
      other.handleChange('a');
      expect(getErrors(other.state.meta)).toBeUndefined();
      field.handleChange('abc');
      await field.validate('change');
      expect(field.state.meta.errors).toEqual([]);
      expect(form.state.submissionAttempts).toBe(0);
    } finally {
      unmountOther();
      unmountField();
      unmount();
    }
  });

  it('prevents duplicate saves and preserves input after a failed request', async () => {
    let rejectRequest!: (error: Error) => void;
    let requests = 0;
    const reported: unknown[] = [];
    const form = new FormApi({
      defaultValues: { draft: false, name: 'Unfinished research' },
      canSubmitWhenInvalid: true,
      onSubmit: async () => {
        requests++;
        try {
          await new Promise<void>((_, reject) => {
            rejectRequest = reject;
          });
        } catch (error) {
          reported.push(error);
        }
      },
    });
    const unmount = form.mount();
    try {
      const save = submitApplicationForm(form, true);
      await Promise.resolve();
      await Promise.resolve();
      await submitApplicationForm(form, false);
      expect(form.state.values.draft).toBe(true);
      await vi.waitFor(() => expect(requests).toBe(1));
      rejectRequest(new Error('Request failed'));
      await save;
      expect(reported).toHaveLength(1);
      expect(form.state.isSubmitting).toBe(false);
      expect(form.state.values.name).toBe('Unfinished research');
    } finally {
      unmount();
    }
  });
  it('reports generated constraints at the editable nested field, in Polish', () => {
    const result = getFormBSubmissionSchema().safeParse({
      ...formBDefaultValues,
      draft: true,
      cruiseDaysDetails: [{ number: 1, hours: 1, taskName: 'x'.repeat(1025), region: '', position: '', comment: '' }],
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.issues).toContainEqual(expect.objectContaining({ path: ['cruiseDaysDetails', 0, 'taskName'] }));
    expect(result.error.issues[0].message).not.toMatch(/Too big|Invalid input/);
  });

  it('converts draft values to API fields and strips UI submission state', () => {
    const fields = getFormBSubmissionSchema().parse({ ...formBDefaultValues, draft: true });
    expect(fields.isCruiseManagerPresent).toBe('true');
    expect(fields).not.toHaveProperty('draft');
    expect(getFormBSubmissionSchema().safeParse({ ...formBDefaultValues, draft: false }).success).toBe(false);
  });

  it('revalidates a failed final submission as a draft through the native lifecycle', async () => {
    const input = z.object({ draft: z.boolean(), name: z.string() });
    const schema = submissionSchema(input.extend({ name: z.string().min(1) }), input);
    const saved: z.input<typeof input>[] = [];
    const form = new FormApi({
      defaultValues: { draft: false, name: '' },
      canSubmitWhenInvalid: true,
      validationLogic: formValidationLogic,
      validators: { onDynamic: schema },
      onSubmit: async ({ value }) => {
        saved.push(schema.parse(value));
      },
    });
    const unmount = form.mount();
    const field = new FieldApi({ form, name: 'name' });
    const unmountField = field.mount();
    try {
      await form.handleSubmit();
      expect(saved).toHaveLength(0);
      expect(field.state.meta.errors.length).toBeGreaterThan(0);
      form.setFieldValue('draft', true);
      await form.handleSubmit();
      expect(saved).toEqual([{ draft: true, name: '' }]);
      expect(field.state.meta.errors).toEqual([]);
      expect(form.state.isSubmitSuccessful).toBe(true);
      expect(form.state.isSubmitting).toBe(false);
      form.setFieldValue('draft', false);
      await form.handleSubmit();
      expect(saved).toHaveLength(1);
      expect(form.state.isSubmitSuccessful).toBe(false);
    } finally {
      unmountField();
      unmount();
    }
  });
});
