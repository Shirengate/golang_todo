import { createComponent } from "../src/rules/create-component";
import { afterAll, describe, it } from "vitest";
import { RuleTester } from "@typescript-eslint/rule-tester";

RuleTester.describe = describe;
RuleTester.afterAll = afterAll;
RuleTester.it = it;
const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run("create-component", createComponent, {
  // Список случаев, которые НЕ ДОЛЖНЫ вызывать ошибок
  valid: [
    // Прямое использование
    `
    const MyComponent = createUIComponent(() => <div />);
    export { MyComponent };
    `,
    // Ваша схема с переприсваиванием
    `
    const Button_ = createUIComponent(() => <button />);
    export const Button = Button_;
    `,
    // Игнорирование обычных переменных (не PascalCase)
    `
    export const themeConfig = { color: 'red' };
    `,
    // Экспорт не-компонентов
    `
    export function helper() { return 1; }
    `,
  ],

  // Список случаев, которые ДОЛЖНЫ вызвать ошибку
  invalid: [
    {
      // Ошибка: экспорт PascalCase переменной без обертки
      code: `export const MyComponent = () => <div />;`,
      errors: [
        {
          messageId: "mustUseCreateComponent",
          data: { name: "MyComponent" },
        },
      ],
    },
    {
      // Ошибка: переприсваивание из "плохой" переменной
      code: `
        const Internal = () => <div />;
        export const External = Internal;
      `,
      errors: [
        {
          messageId: "mustUseCreateComponent",
          data: { name: "External" },
        },
      ],
    },
    {
      // Ошибка в дефолтном экспорте ( не работает)
      code: `export default function App() { return <div />; }`,
      errors: [
        {
          messageId: "mustUseCreateComponent",
          data: { name: "App" },
        },
      ],
    },
  ],
});
