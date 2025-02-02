import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export function DashboardGrid({ children, className }: Props) {
  return (
    <div
      className={cn(
        'grid max-w-screen-xl mx-auto grid-cols-2 md:grid-cols-4 lg:grid-cols-6 auto-rows-[10rem] gap-4 p-8',
        className
      )}
    >
      {children}
    </div>
  );
}
