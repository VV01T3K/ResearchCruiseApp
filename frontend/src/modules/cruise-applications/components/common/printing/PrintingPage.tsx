import { RefObject } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement | null>;
  title: string;
  children: React.ReactNode;
};
export function PrintingPage({ ref, title, children }: Props) {
  return (
    <div ref={ref} className="not-print:hidden bg-white mx-auto w-[21cm]">
      <h1 className="text-3xl text-center pt-[1cm]">{title}</h1>
      {children}
    </div>
  );
}
