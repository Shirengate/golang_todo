import type { Preview } from "@storybook/react-vite";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { Theme } from "../src/components/ThemeProvider/context";

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const currentTheme: Theme = context.globals.theme;

      return (
        <ThemeProvider key={currentTheme} appTheme={currentTheme}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", icon: "circlehollow", title: "light" },
          { value: "dark", icon: "circle", title: "dark" },
        ],
      },
    },
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
