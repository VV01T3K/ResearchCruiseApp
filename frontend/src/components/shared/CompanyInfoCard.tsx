type Props = {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
};

export function CompanyInfoCard({ title, icon, children }: Props) {
  return (
    <div className="flex gap-4">
      <div className="grid place-items-center">
        <div className="grid aspect-square w-16 place-items-center rounded-xl bg-gray-200 p-4">{icon}</div>
      </div>
      <div>
        <p className="text-lg font-bold">{title}</p>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
    </div>
  );
}
