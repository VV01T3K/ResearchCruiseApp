import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { useState } from 'react';

import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';

const meta = {
  component: AppCheckbox,
  args: {
    name: 'Checkbox',
    'aria-label': 'Checkbox',
    checked: true,
    errors: undefined,
    label: undefined,
    helper: undefined,
    onBlur: fn(),
    onChange: fn(),
  },
  render: (props) => <CheckboxExamples {...props} key={String(props.checked)} />,
} satisfies Meta<typeof AppCheckbox>;

function CheckboxExamples(props: React.ComponentProps<typeof AppCheckbox>) {
  const [firstChecked, setFirstChecked] = useState(props.checked);
  const [secondChecked, setSecondChecked] = useState(false);
  return (
    <div className="flex gap-4">
      <AppCheckbox
        {...props}
        checked={firstChecked}
        onChange={(checked) => {
          props.onChange?.(checked);
          setFirstChecked(checked);
        }}
      />
      <AppCheckbox
        {...props}
        checked={secondChecked}
        onChange={(checked) => {
          props.onChange?.(checked);
          setSecondChecked(checked);
        }}
      />
      <AppCheckbox {...props} checked={true} disabled />
      <AppCheckbox {...props} checked={false} disabled />
    </div>
  );
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const [first, second, disabledChecked, disabledUnchecked] = canvas.getAllByRole('checkbox');
    await userEvent.click(first);
    await expect(first).not.toBeChecked();
    await userEvent.click(second);
    await expect(second).toBeChecked();
    await expect(disabledChecked).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledUnchecked).toHaveAttribute('aria-disabled', 'true');
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
};

export const WithErrors: Story = {
  args: {
    label: 'Label',
    errors: ['Error message'],
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Label',
    helper: 'Helper message',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
  },
};

export const Plain: Story = {
  args: {
    variant: 'plain',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};
