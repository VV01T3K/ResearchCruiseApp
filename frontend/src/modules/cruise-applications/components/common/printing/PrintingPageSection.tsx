type Props = {
  title: string;
  children: React.ReactNode;
};
export function PrintingPageSection({ title, children }: Props) {
  return (
    <section style={{ pageBreakInside: 'avoid' }} className="px-[1cm] pt-[1cm] space-y-4">
      <h2 className="text-2xl mb-4">{title}</h2>
      {children}
    </section>
  );
}
