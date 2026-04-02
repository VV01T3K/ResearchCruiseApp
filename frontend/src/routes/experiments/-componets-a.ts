import { createElement, type ReactNode } from 'react';

export function SectionCard({
  number,
  title,
  description,
  children,
  testId,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
  testId?: string;
}) {
  return createElement(
    'section',
    {
      className: 'rounded-3xl border border-gray-200 bg-white/95 p-6 shadow-sm ring-1 ring-black/3 backdrop-blur-sm',
      'data-testid': testId,
    },
    createElement(
      'div',
      { className: 'mb-5 space-y-1' },
      createElement(
        'p',
        { className: 'text-sm font-semibold tracking-[0.18em] text-primary uppercase' },
        `Sekcja ${number}`
      ),
      createElement('h2', { className: 'text-2xl font-semibold text-gray-900' }, title),
      createElement('p', { className: 'max-w-3xl text-sm text-gray-600' }, description)
    ),
    children
  );
}
