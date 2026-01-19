import { createFormHook, createFormHookContexts, ReactFormExtendedApi } from '@tanstack/react-form';

/**
 * Form hook contexts for type-safe form composition.
 * Based on TanStack Form's recommended approach:
 * https://tanstack.com/form/latest/docs/framework/react/guides/form-composition
 *
 * - useFormContext: Access the current form from any nested component
 * - useFieldContext: Access the current field from custom field components
 */
export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

/**
 * Custom form hook with pre-bound contexts.
 *
 * Usage:
 * 1. Use `useAppForm` instead of `useForm` to create forms
 * 2. Wrap form content with `form.AppForm` to provide context
 * 3. Use `useFormContext()` in nested components to access the form
 *
 * Example:
 * ```tsx
 * const form = useAppForm({ defaultValues: { name: '' } });
 * return (
 *   <form.AppForm>
 *     <NestedComponent />
 *   </form.AppForm>
 * );
 * ```
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {},
  formComponents: {},
});

/**
 * Type alias for React form API with relaxed validator types.
 * This type includes Field, Subscribe, and other React-specific components.
 * Use this when you need to pass forms around without strict validator type checking.
 *
 * The validator type parameters use `any` to allow forms with any validator configuration
 * to be assignable to this type. This is intentional for form composition patterns
 * where components don't need to know the specific validator types.
 *
 * @template TFormData - The type of the form's data/values
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type AnyReactFormApi<TFormData> = ReactFormExtendedApi<
  TFormData,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
/* eslint-enable @typescript-eslint/no-explicit-any */
