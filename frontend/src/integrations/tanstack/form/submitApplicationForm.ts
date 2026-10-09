type ApplicationForm = {
  state: { isSubmitting: boolean };
  setFieldValue: (name: 'draft', value: boolean) => void;
  handleSubmit: () => Promise<void>;
};

export async function submitApplicationForm(form: ApplicationForm, draft: boolean) {
  if (form.state.isSubmitting) return;
  form.setFieldValue('draft', draft);
  try {
    await form.handleSubmit();
  } catch {
    // A failed save rethrows so the form records the failure; onSubmit has already shown the error.
  }
}
