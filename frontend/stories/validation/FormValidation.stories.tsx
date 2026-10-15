import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor } from 'storybook/test';
import { z } from 'zod';

import { AppButton } from '@/components/shared/AppButton';
import { useAppForm } from '@/integrations/tanstack/form/hook';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
});

function FormValidation({ onSubmit }: { onSubmit: (value: z.infer<typeof schema>) => void }) {
  const [submitted, setSubmitted] = useState(false);
  const form = useAppForm({
    defaultValues: { name: '', email: '' },
    validators: { onChange: schema },
    onSubmit: ({ value }) => {
      onSubmit(value);
      setSubmitted(true);
    },
  });

  return (
    <form.AppForm>
      <form
        noValidate
        className="max-w-md space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />
        <form.AppField name="email" children={(field) => <field.TextField label="Email" type="email" />} />
        <AppButton type="submit">Submit</AppButton>
        {submitted && <p role="status">Form submitted</p>}
      </form>
    </form.AppForm>
  );
}

const meta = {
  title: 'Validation/Form Validation',
  component: FormValidation,
  args: { onSubmit: fn() },
  parameters: {
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Exercises the same useAppForm and field components as the application. Errors appear after blur or submission, and clear when corrected. Schema rules are tested separately in the unit suite.',
      },
    },
  },
} satisfies Meta<typeof FormValidation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInvalidData: Story = {
  parameters: { a11y: { test: 'todo' } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email'), 'invalid');
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(await canvas.findByText('Name is required')).toBeVisible();
    await expect(await canvas.findByText('Invalid email address')).toBeVisible();
    await expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

export const CorrectedData: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(await canvas.findByText('Name is required')).toBeVisible();
    await userEvent.type(canvas.getByLabelText('Name'), 'Ada');
    await userEvent.type(canvas.getByLabelText('Email'), 'ada@example.com');
    await waitFor(() => expect(canvas.queryByText('Invalid email address')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
    await expect(await canvas.findByRole('status')).toHaveTextContent('Form submitted');
    await expect(args.onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com' });
  },
};
