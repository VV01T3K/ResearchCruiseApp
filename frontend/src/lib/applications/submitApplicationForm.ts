type ApplicationForm = {
  state: { isSubmitting: boolean };
  setFieldValue: (name: 'draft', value: boolean) => void;
  handleSubmit: () => Promise<void>;
};

export async function submitApplicationForm(form: ApplicationForm, draft: boolean) {
  if (form.state.isSubmitting) return;
  form.setFieldValue('draft', draft);
  // onSubmit reports request errors and rethrows so TanStack records a failed submission.
  await form.handleSubmit().catch(() => {});
}
