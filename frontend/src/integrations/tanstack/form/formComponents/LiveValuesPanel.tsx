import { useFormContext } from '../context';
import { getFieldErrorMessages } from '../newFieldComponets/shared';

function getAllErrors(fieldMeta: Record<string, { errors?: unknown[] }>) {
  return Object.entries(fieldMeta).flatMap(([fieldName, meta]) =>
    getFieldErrorMessages({ errors: meta.errors ?? [] }, true).map((message) => ({
      field: fieldName,
      message,
    }))
  );
}

export function LiveValuesPanel({
  title = 'Live values',
  className,
  panelClassName,
  preClassName,
  testId,
}: {
  title?: string;
  className?: string;
  panelClassName?: string;
  preClassName?: string;
  testId?: string;
}) {
  const form = useFormContext();

  return (
    <div className={className}>
      <div
        className={panelClassName ?? 'rounded-xl border border-gray-200 bg-white p-4 shadow-sm'}
        data-testid={testId}
      >
        <form.Subscribe selector={(state) => ({ values: state.values, fieldMeta: state.fieldMeta })}>
          {({ values, fieldMeta }) => (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
                <pre
                  className={preClassName ?? 'overflow-x-auto text-xs break-words whitespace-pre-wrap text-gray-600'}
                >
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-700">All errors</p>
                <pre
                  className={preClassName ?? 'overflow-x-auto text-xs break-words whitespace-pre-wrap text-gray-600'}
                >
                  {JSON.stringify(getAllErrors(fieldMeta as Record<string, { errors?: unknown[] }>), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
