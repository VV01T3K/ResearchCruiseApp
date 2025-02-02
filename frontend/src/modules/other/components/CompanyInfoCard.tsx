type Props = {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
};

export function CompanyInfoCard({ title, icon, children }: Props) {
  return (
    <div className="flex gap-4">
      <div className="grid place-items-center">
        <div className="bg-gray-200 rounded-xl grid place-items-center p-4 aspect-square w-16">{icon}</div>
      </div>
      <div>
        <p className="font-bold text-lg">{title}</p>
        {children ? <div className="mt-2">{children}</div> : null}
      </div>
    </div>
  );
}
