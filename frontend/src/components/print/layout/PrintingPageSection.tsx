type Props = {
  title: string;
  children: React.ReactNode;
};
export function PrintingPageSection({ title, children }: Props) {
  return (
    <section style={{ pageBreakInside: 'avoid' }} className="space-y-4 px-[1cm] pt-[1cm]">
      <h2 className="mb-4 text-2xl">{title}</h2>
      {children}
    </section>
  );
}
