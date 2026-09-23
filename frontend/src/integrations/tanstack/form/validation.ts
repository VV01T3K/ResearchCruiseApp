import { revalidateLogic, type ValidationLogicFn } from '@tanstack/react-form';

// Validate on blur initially, then on change while errors are being corrected.
export const formValidationLogic: ValidationLogicFn = (props) =>
  revalidateLogic({
    mode: props.form.state.isValid ? 'blur' : 'change',
    modeAfterSubmission: 'change',
  })(props);
