type Props = {
  title: string;
  children: React.ReactNode;

  footer?: React.ReactNode;
};

export function AuthCard({ title, children, footer }: Props) {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full px-4 py-[8vh]">
      <div className="mx-auto max-w-2xl rounded-xl bg-surface-muted p-6 md:p-8">
        <header className="mb-6 flex flex-col items-center gap-4">
          <img src="/icon.svg" alt="" className="size-12" />
          <h1 className="text-center text-2xl font-bold">{title}</h1>
        </header>
        {children}
        {footer && <p className="mt-6 text-center text-sm">{footer}</p>}
      </div>
    </div>
  );
}
