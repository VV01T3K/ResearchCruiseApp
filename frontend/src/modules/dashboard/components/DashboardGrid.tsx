import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export function DashboardGrid({ children, className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-screen-xl auto-rows-[10rem] grid-cols-2 gap-4 p-8 md:grid-cols-4 lg:grid-cols-6',
        className
      )}
    >
      {children}
    </div>
  );
}
