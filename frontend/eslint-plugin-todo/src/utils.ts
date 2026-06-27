import { ESLintUtils } from "@typescript-eslint/utils";

export const createRules = ESLintUtils.RuleCreator((name) => {
  return `https://github.com/Shirengate/golang_todo/tree/main/frontend/eslint-plugin-todo/docs/${name}.md`;
});
