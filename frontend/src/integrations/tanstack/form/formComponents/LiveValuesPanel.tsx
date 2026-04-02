import { useFormContext } from '../context';

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
        <p className="mb-2 text-sm font-medium text-gray-700">{title}</p>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <pre className={preClassName ?? 'overflow-x-auto whitespace-pre-wrap break-words text-xs text-gray-600'}>
              {JSON.stringify(values, null, 2)}
            </pre>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}
