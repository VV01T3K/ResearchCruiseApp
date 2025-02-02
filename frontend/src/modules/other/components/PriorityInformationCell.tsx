import { cn } from '@/core/lib/utils';

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
    <td className={cn('p-4 border-b border-r first:border-l border-slate-600', className)} colSpan={colSpan}>
      <p className="block text-sm text-slate-800">{children}</p>
    </td>
  );
}
