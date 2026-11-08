import { cn } from '@/lib/utils';

type Props = {
  children: React.ReactNode;
  className?: string;
};
export function Grid({ children, className }: Props) {
  return (
    <div className={cn('mx-auto grid max-w-screen-xl auto-rows-[10rem] grid-cols-6 gap-4 p-8', className)}>
      {children}
    </div>
  );
}
