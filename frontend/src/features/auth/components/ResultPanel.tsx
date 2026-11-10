import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react';

import { ButtonLink } from '@/components/shared/Button';

type Props = {
  variant: 'success' | 'danger';
  title: string;
  children: React.ReactNode;

  loginLink?: boolean;
};

export function ResultPanel({ variant, title, children, loginLink }: Props) {
  const Icon = variant === 'success' ? CheckCircleIcon : XCircleIcon;
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div role="status" className="flex flex-col items-center gap-4">
        <Icon weight="fill" className={variant === 'success' ? 'size-16 text-success' : 'size-16 text-danger'} />
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{children}</p>
      </div>
      {loginLink && (
        <ButtonLink to="/login" className="mt-2 w-full">
          Wróć do logowania
        </ButtonLink>
      )}
    </div>
  );
}
