import { AppLink } from '@/core/components/AppLink';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  className?: string;
  background: React.ReactNode;
  Icon: React.ElementType;
  description: string;
  href: string;
  enabled?: () => boolean;
};
export function DashboardGridCard({ name, className, background, Icon, description, href, enabled }: Props) {
  if (enabled && !enabled()) {
    return null;
  }

  return (
    <div
      key={name}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl',
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        className
      )}
    >
      <AppLink href={href} className="h-full w-full relative flex flex-col justify-between overflow-hidden rounded-xl">
        <div>{background}</div>
        <div className="h-full z-10 flex transform-gpu flex-col gap-1 p-4 transition-all duration-300 group-hover:-translate-y-10">
          <Icon className="w-16 aspect-square flex-1 origin-left transform-gpu self-center text-primary transition-all duration-300 ease-in-out group-hover:scale-75" />
          <h3 className="text-md md:text-lg xl:text-xl font-semibold text-primary self-center md:self-auto">{name}</h3>
        </div>

        <div
          className={cn(
            'absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'
          )}
        >
          <div>
            <p className="max-w-lg text-neutral-600 text-sm">{description}</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03]" />
      </AppLink>
    </div>
  );
}
