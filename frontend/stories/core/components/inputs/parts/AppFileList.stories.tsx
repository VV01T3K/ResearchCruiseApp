import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppFileList } from '@/components/shared/inputs/parts/AppFileList';

const fileItem = (canvasElement: HTMLElement, name: string) =>
  within(canvasElement).getByRole('button', { name }).closest('li');

const waitForFiles = ({ canvasElement }: { canvasElement: HTMLElement }) =>
  waitFor(() => expect(fileItem(canvasElement, 'File 2')).toHaveStyle({ opacity: '1' }));

const meta = {
  component: AppFileList,
  args: {
    files: [
      {
        name: 'File 1',
        content: 'data:text/plain;base64,Q29udGVudCAx',
      },
      {
        name: 'File 2',
        content: 'data:text/plain;base64,Q29udGVudCAy',
      },
    ],
  },
  play: waitForFiles,
} satisfies Meta<typeof AppFileList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await waitForFiles({ canvasElement });
    await userEvent.click(canvas.getByRole('button', { name: 'Usuń plik File 1' }));
    await expect(fileItem(canvasElement, 'File 2')).toHaveStyle({ opacity: '1' });
    await waitFor(() => expect(canvas.queryByRole('button', { name: 'File 1' })).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'File 2' }));
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole('dialog', { name: 'File 2' });
    await expect(dialog.querySelector('object')).toHaveAttribute('data', 'data:text/plain;base64,Q29udGVudCAy');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Zamknij' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
  },
  render: function Render(args) {
    const [files, setFiles] = useState(args.files);
    return (
      <AppFileList
        {...args}
        files={files}
        onRemove={(file) => {
          args.onRemove?.(file);
          setFiles(files.filter((item) => item !== file));
        }}
      />
    );
  },
  args: {
    onRemove: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
