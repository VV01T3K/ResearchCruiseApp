import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

import { AppButton } from '@/core/components/AppButton';
import { AppInput } from '@/core/components/inputs/AppInput';
import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';
import { getErrors } from '@/core/lib/utils';

// Zod validation schema
const validationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
});

type FormData = z.infer<typeof validationSchema>;

function ValidationForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      age: 0,
    } as FormData,
    validators: {
      onChange: validationSchema,
    },
    onSubmit: ({ value }) => {
      alert(`Form submitted successfully!\n${JSON.stringify(value, null, 2)}`);
    },
  });

  return (
    <div className="max-w-md space-y-4">
      <h2 className="text-lg font-semibold">Zod Validation Demo</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="name"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta)}
              label="Name"
              placeholder="Enter your name"
            />
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <AppInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta)}
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
          )}
        />

        <form.Field
          name="age"
          children={(field) => (
            <AppNumberInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta)}
              label="Age"
              minimum={0}
            />
          )}
        />

        <AppButton type="submit" variant="primary">
          Submit
        </AppButton>
      </form>
    </div>
  );
}

const meta = {
  title: 'Validation/Zod Form Validation',
  component: ValidationForm,
  parameters: {
    docs: {
      description: {
        component:
          'Demonstrates Zod validation working with TanStack React Form. Try submitting with empty fields or invalid data to see validation in action.',
      },
    },
  },
} satisfies Meta<typeof ValidationForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInvalidData: Story = {
  play: async () => {
    // This would require playwright interaction to fill and submit the form
    // For now, this is just a placeholder showing the story exists
  },
};
