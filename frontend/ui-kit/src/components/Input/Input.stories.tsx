import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  argTypes: {
    variant: {
      control: "select",
      options: ["outline", "filled", "ghost"],
    },
    onChange: { action: "changed" },
  },
  args: {
    placeholder: "Type something...",
    fullWidth: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Outline: Story = {
  args: {
    variant: "outline",
    label: "Username",
  },
};

export const Filled: Story = {
  args: {
    variant: "filled",
    label: "Email",
    type: "email",
  },
};

export const WithError: Story = {
  args: {
    label: "Password",
    error: "Password is too short",
    defaultValue: "123",
  },
};

export const Icons: Story = {
  args: {
    label: "Search",
    leftIcon: <span>🔍</span>,
    rightIcon: <span>❌</span>,
  },
};
