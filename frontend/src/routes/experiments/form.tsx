import { useAppForm } from '@/integrations/tanstack/form';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/experiments/form')({
  component: ExperimentForm,
});

const destinationOptions: Array<{ label: string; value: string }> = [
  { label: 'Product Discovery', value: 'product-discovery' },
  { label: 'Customer Research', value: 'customer-research' },
  { label: 'Growth Experiment', value: 'growth-experiment' },
];

const experimentSchema = z.object({
  title: z.string().trim().min(3, 'Enter at least 3 characters'),
  email: z.email('Enter a valid email address'),
  destination: z.string().min(1, 'Choose a track'),
  participants: z.number().int().min(1, 'At least 1 participant is required').max(20, 'Maximum is 20 participants'),
  notes: z.string().trim().min(10, 'Add at least 10 characters'),
  wantsFollowUp: z.boolean(),
});

function ExperimentForm() {
  const form = useAppForm({
    defaultValues: {
      title: '',
      email: '',
      destination: '',
      participants: 3,
      notes: '',
      wantsFollowUp: false,
    },
    validators: {
      onBlur: experimentSchema,
      onSubmit: experimentSchema,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      alert(`Form submitted for ${value.title}`);
    },
  });

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
      className="mx-auto mt-16 max-w-2xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <form.AppForm>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Experiment intake form</h1>
          <p className="text-sm text-gray-600">Simple example built from the shared TanStack form inputs.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <form.AppField name="title">
            {(field) => <field.Text label="Experiment title" placeholder="Pricing page test" />}
          </form.AppField>

          <form.AppField name="email">
            {(field) => <field.Email label="Owner email" placeholder="owner@company.com" autoComplete="email" />}
          </form.AppField>
        </div>

        <div className="grid gap-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form.AppField name="destination">
            {(field) => <field.Select label="Track" values={destinationOptions} placeholder="Select a track" />}
          </form.AppField>

          <form.AppField name="participants">
            {(field) => <field.Integer label="Participants" minimum={1} maximum={20} />}
          </form.AppField>
        </div>

        <form.AppField name="notes">{(field) => <field.TextArea label="Notes" rows={4} />}</form.AppField>

        <form.AppField name="wantsFollowUp">
          {(field) => <field.Checkbox label="I want a follow-up after submission" />}
        </form.AppField>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Live values</p>
          <form.Subscribe selector={(state) => state.values}>
            {(values) => <pre className="overflow-x-auto text-xs text-gray-600">{JSON.stringify(values, null, 2)}</pre>}
          </form.Subscribe>
        </div>

        <div className="flex justify-end">
          <form.SubscribeButton label="Submit" />
        </div>
      </form.AppForm>
    </form>
  );
}
