import type { Preview } from '@storybook/react';
import React from 'react';
import { OverlayProvider } from '../src/providers/OverlayProvider';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
  },
  decorators: [
    (Story) => (
      <OverlayProvider>
        <div
          style={{
            fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          <Story />
        </div>
      </OverlayProvider>
    ),
  ],
};

export default preview;
