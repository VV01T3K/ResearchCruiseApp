import type { Decorator } from '@storybook/react-vite';
import { useState } from 'react';

export const withControlledValue: Decorator = (Story, context) => (
  <ControlledValueStory key={JSON.stringify(context.args.value)} Story={Story} args={context.args} />
);

function ControlledValueStory({
  Story,
  args,
}: {
  Story: Parameters<Decorator>[0];
  args: Parameters<Decorator>[1]['args'];
}) {
  const [value, setValue] = useState(args.value);

  return (
    <Story
      args={{
        ...args,
        value,
        onChange: (nextValue: unknown) => {
          if (typeof args.onChange === 'function') args.onChange(nextValue);
          setValue(nextValue);
        },
      }}
    />
  );
}
