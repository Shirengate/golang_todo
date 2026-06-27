"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const create_component_1 = require("../src/rules/create-component");
const vitest_1 = require("vitest");
const rule_tester_1 = require("@typescript-eslint/rule-tester");
rule_tester_1.RuleTester.describe = vitest_1.describe;
rule_tester_1.RuleTester.afterAll = vitest_1.afterAll;
rule_tester_1.RuleTester.it = vitest_1.it;
const ruleTester = new rule_tester_1.RuleTester({
    languageOptions: {
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
});
ruleTester.run("create-component", create_component_1.createComponent, {
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
//# sourceMappingURL=create-component.test.js.map