import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export function Grid({ children, className }: Props) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-screen-xl auto-rows-[10rem] grid-cols-6 gap-4 p-8 phone:auto-rows-[7.5rem] phone:grid-cols-2 phone:gap-3 phone:p-4',
        className
      )}
    >
      {children}
    </div>
  );
}
