import { createComponent } from "./rules/create-component";

const plugin = {
  meta: {
    name: "eslint-plugin-todo",
    version: "1.0.0",
  },
  rules: {
    "create-component": createComponent,
  },
};

export default plugin;
