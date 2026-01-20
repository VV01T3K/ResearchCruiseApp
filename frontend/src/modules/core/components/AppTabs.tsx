import { Tabs } from '@base-ui/react/tabs';

import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode[];
  tabNames: string[];
};
export function AppTabs({ children, tabNames }: Props) {
  if (tabNames.length !== children.length) {
    throw new Error('The number of tab names must match the number of tab children');
  }

  return (
    <Tabs.Root defaultValue={0}>
      <Tabs.List className="mr-2 ml-2 flex gap-8 text-center">
        {tabNames.map((tabName, index) => (
          <Tabs.Tab
            key={tabName}
            value={index}
            className={cn(
              'w-full rounded-full transition-colors duration-300 outline-none',
              'data-[selected]:bg-primary data-[selected]:font-bold data-[selected]:text-white',
              'data-[unselected]:hover:bg-primary-200 data-[unselected]:bg-gray-200'
            )}
          >
            {tabName}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabNames.map((tabName, index) => (
        <Tabs.Panel key={tabName} value={index}>
          {children[index]}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
