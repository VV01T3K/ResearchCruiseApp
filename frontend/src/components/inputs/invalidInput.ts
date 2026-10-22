export function hasErrors(errors: string[] | undefined): errors is string[] {
  return !!errors?.length;
}

export const invalidInputClassName =
  'border-danger text-danger hover:border-danger focus:border-danger focus:text-danger focus:ring-1 focus:ring-danger';
