import type { Preview } from '@storybook/react-vite';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import { sb } from 'storybook/test';
import MockDate from 'mockdate';
import { withRouter } from '../stories/decorators/withRouter';

import '../src/styles/index.css';

sb.mock(import('../src/api/fetch.ts'));

const preview: Preview = {
  beforeEach: () => {
    MockDate.set('2026-01-15T12:00:00Z');
    return () => MockDate.reset();
  },
  decorators: [withRouter],
  parameters: {
    a11y: { test: 'todo' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories />
        </>
      ),
    },
  },
  tags: ['autodocs'],
};

export default preview;
