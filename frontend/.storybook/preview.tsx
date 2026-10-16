import type { Preview } from '@storybook/react-vite';
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/addon-docs/blocks';
import MockDate from 'mockdate';
import { StoryRouterProvider } from '../src/integrations/tanstack/router/StoryRouterProvider';

import '../src/styles/index.css';

const preview: Preview = {
  beforeEach: () => {
    MockDate.set('2026-01-15T12:00:00Z');
    return () => MockDate.reset();
  },
  decorators: [
    (Story) => (
      <StoryRouterProvider>
        <Story />
      </StoryRouterProvider>
    ),
  ],
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
