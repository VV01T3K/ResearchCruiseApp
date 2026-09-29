type ApplicationForm = {
  state: { isSubmitting: boolean };
  setFieldValue: (name: 'draft', value: boolean) => void;
  handleSubmit: () => Promise<void>;
};

export async function submitApplicationForm(form: ApplicationForm, draft: boolean) {
  if (form.state.isSubmitting) return;
  form.setFieldValue('draft', draft);
  await form.handleSubmit();
}
