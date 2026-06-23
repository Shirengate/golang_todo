import type { Meta, StoryObj } from "@storybook/react-vite";
import { RxHalf2 } from "react-icons/rx";
import { Button } from "./Button";

const meta = {
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Hello",
  },
};

export const WithIcon: Story = {
  args: {
    children: <RxHalf2 />,
  },
};
