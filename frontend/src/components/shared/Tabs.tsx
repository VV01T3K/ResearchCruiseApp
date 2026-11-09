import { Tabs as BaseTabs } from '@base-ui/react/tabs';

type Props = {
  children: React.ReactNode[];
  tabNames: string[];
};
export function Tabs({ children, tabNames }: Props) {
  if (tabNames.length !== children.length) {
    throw new Error('The number of tab names must match the number of tab children');
  }

  return (
    <BaseTabs.Root defaultValue={0}>
      <BaseTabs.List className="mr-2 ml-2 flex gap-8 text-center">
        {tabNames.map((tabName, index) => (
          <BaseTabs.Tab
            key={tabName}
            value={index}
            className="w-full rounded-full bg-neutral-200 px-5 py-2.5 transition-[color,background-color] duration-150 ease-out hover:cursor-pointer hover:not-data-active:bg-primary-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden active:not-data-active:bg-primary-300 data-active:bg-primary data-active:font-bold data-active:text-inverse-foreground"
          >
            {tabName}
          </BaseTabs.Tab>
        ))}
      </BaseTabs.List>
      {children.map((child, index) => (
        <BaseTabs.Panel key={tabNames[index]} value={index}>
          {child}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
}
