import { cn } from '@/lib/utils';

export function PriorityInformationCell({
  children,
  colSpan,
  heading,
}: {
  children: React.ReactNode;
  colSpan?: number;
  heading?: boolean;
}) {
  return (
    <td
      className={cn(
        'border-r border-b border-neutral-600 p-4 first:border-l',
        heading && 'bg-neutral-300 font-semibold'
      )}
      colSpan={colSpan}
    >
      <p className="block text-sm text-neutral-800">{children}</p>
    </td>
  );
}
