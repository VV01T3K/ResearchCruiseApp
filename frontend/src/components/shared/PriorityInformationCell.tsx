import { cn } from '@/lib/utils';

export function PriorityInformationCell({
  children,
  colSpan,
  className,
}: {
  children: React.ReactNode;
  colSpan?: number;
  className?: string;
}) {
  return (
    <td className={cn('border-r border-b border-neutral-600 p-4 first:border-l', className)} colSpan={colSpan}>
      <p className="block text-sm text-neutral-800">{children}</p>
    </td>
  );
}
