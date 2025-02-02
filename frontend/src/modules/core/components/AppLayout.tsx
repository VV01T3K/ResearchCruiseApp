import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;

  description?: string;
  variant?: keyof typeof variants;
};

export function AppLayout({ title, children, description, variant = 'default' }: Props) {
  return (
    <div className="p-8 w-full min-h-[calc(100vh-var(--header-height))] backdrop-blur-md relative">
      <div className={cn('mx-auto p-8 bg-gray-50 rounded-xl', variants[variant])}>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
          {description ? <p className="text-gray-600 font-semibold text-center">{description}</p> : null}
        </header>
        {children}
      </div>
    </div>
  );
}

const variants = {
  default: 'max-w-screen-2xl mt-[10vh] md:mt-[20vh]',
  narrow: 'max-w-2xl mt-[10vh] md:mt-[25zvh]',
  defaultWithoutCentering: 'max-w-screen-2xl',
};
