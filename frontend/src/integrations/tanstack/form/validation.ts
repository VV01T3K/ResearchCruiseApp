import { revalidateLogic, type ValidationLogicFn } from '@tanstack/react-form';

// TanStack's default logic clears server errors on every change, blur and submit. revalidateLogic
// skips fields without their own validators, so add that reset back for them.
const clearServerErrors = { fn: () => undefined, cause: 'server' as const };

// Validate on blur initially, then on change while errors are being corrected.
export const formValidationLogic: ValidationLogicFn = (props) =>
  revalidateLogic({
    mode: props.form.state.isValid ? 'blur' : 'change',
    modeAfterSubmission: 'change',
  })({
    ...props,
    runValidation: ({ validators, form }) =>
      props.runValidation({
        validators:
          props.event.async || props.event.type === 'mount' || validators.some((v) => v?.cause === 'server')
            ? validators
            : [...validators, clearServerErrors],
        form,
      }),
  });
