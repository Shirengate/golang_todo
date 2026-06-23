import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
const preview: Preview = {
  decorators: (Story) => {
    return (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    );
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
