import { RefObject } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement | null>;
  title: string;
  children: React.ReactNode;
};
export function PrintingPage({ ref, title, children }: Props) {
  return (
    <div ref={ref} className="mx-auto w-[21cm] bg-white not-print:hidden">
      <h1 className="pt-[1cm] text-center text-3xl">{title}</h1>
      {children}
    </div>
  );
}
