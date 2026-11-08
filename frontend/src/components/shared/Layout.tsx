import { PreviousPageButton } from '@/components/shared/PreviousPageButton';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;

  description?: string;
  variant?: keyof typeof variants;
  disableBackButton?: boolean;
};

export function Layout({ title, children, description, variant = 'default', disableBackButton = false }: Props) {
  const useWidePadding = variant === 'wide';
  return (
    <div
      className={cn(
        'relative min-h-[calc(100vh-var(--header-height))] w-full will-change-transform has-data-actions-section:pb-0',
        useWidePadding ? outerPaddingVariants[variant] : 'md:p-8'
      )}
    >
      <div
        className={cn(
          'mx-auto rounded-xl bg-surface-muted has-data-actions-section:pb-0',
          useWidePadding ? innerPaddingVariants[variant] : 'pb-4 md:p-8',
          variants[variant]
        )}
      >
        <header className="mb-8">
          {!disableBackButton && (
            <div className="p-4 md:p-0">
              <PreviousPageButton />
            </div>
          )}
          <h1 className="mb-2 pt-8 text-center text-3xl font-bold md:pt-0">{title}</h1>
          {description ? <p className="text-center font-semibold text-neutral-600">{description}</p> : null}
        </header>
        {children}
      </div>
    </div>
  );
}

const variants = {
  default: 'max-w-screen-2xl',
  narrow: 'max-w-2xl mt-[10vh] md:mt-[25zvh]',
  defaultWithCentering: 'max-w-screen-2xl mt-[10vh] md:mt-[20vh]',
  wide: 'max-w-full',
};

const outerPaddingVariants = {
  default: '',
  narrow: '',
  defaultWithCentering: '',
  wide: 'px-2 py-4 md:px-4 md:py-8 2xl:px-16',
};

const innerPaddingVariants = {
  default: '',
  narrow: '',
  defaultWithCentering: '',
  wide: 'px-2 py-4 md:px-4 md:py-8 2xl:px-16',
};
