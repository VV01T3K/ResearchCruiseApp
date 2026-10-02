import { useSelector } from '@tanstack/react-form';
import { AppAlert } from '@/components/shared/AppAlert';
import { useFormContext } from './context';
import { getFormLevelErrors } from './errors';

/** Errors that belong to no visible field, shown after a submit attempt. */
export function FormErrors() {
  const form = useFormContext();
  const submissionAttempts = useSelector(form.store, (state) => state.submissionAttempts);
  const errorMap = useSelector(form.store, (state) => state.errorMap);
  const errors = submissionAttempts > 0 ? getFormLevelErrors(form, errorMap) : [];
  if (errors.length === 0) return null;

  return (
    <div data-error="true" data-testid="form-errors">
      <AppAlert variant="danger">
        {errors.length === 1 ? (
          <p>{errors[0]}</p>
        ) : (
          <ul className="list-disc ps-4">
            {errors.map((error, index) => (
              // oxlint-disable-next-line @eslint-react/no-array-index-key
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </AppAlert>
    </div>
  );
}
