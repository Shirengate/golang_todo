import { createRules } from "../utils";
import { AST_NODE_TYPES } from "@typescript-eslint/utils";

export const createComponent = createRules({
  name: "create-component",
  meta: {
    type: "problem",
    messages: {
      mustUseCreateComponent:
        "Компонент '{{name}}' должен быть создан через функцию createUIComponent.",
    },
    docs: {
      description:
        "Запрещает экспорт компонентов, созданных без createUIComponent",
    },
    schema: [],
  },

  create(context) {
    // Множество имен переменных, которые были инициализированы через createUIComponent
    const validIdentifiers = new Set<string>();

    // Список всех экспортированных имен и их узлов для проверки в конце
    const exportsToCheck: { name: string; node: any }[] = [];

    // Хелпер для проверки, является ли имя "Компонентом" (PascalCase)
    const isPascalCase = (name: string) => /^[A-Z]/.test(name);

    return {
      // 1. Отслеживаем создание переменных
      VariableDeclarator(node) {
        if (!node.init) return;

        let isFromCreateUI = false;

        // Случай A: Прямой вызов const B = createUIComponent(...)
        if (
          node.init.type === AST_NODE_TYPES.CallExpression &&
          node.init.callee.type === AST_NODE_TYPES.Identifier &&
          node.init.callee.name === "createUIComponent"
        ) {
          isFromCreateUI = true;
        }

        // Случай B: Переприсваивание const B = B_ (где B_ уже валиден)
        if (
          node.init.type === AST_NODE_TYPES.Identifier &&
          validIdentifiers.has(node.init.name)
        ) {
          isFromCreateUI = true;
        }

        if (isFromCreateUI && node.id.type === AST_NODE_TYPES.Identifier) {
          validIdentifiers.add(node.id.name);
        }
      },

      // 2. Собираем именованные экспорты: export const Button = ...
      ExportNamedDeclaration(node) {
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            if (
              decl.id.type === AST_NODE_TYPES.Identifier &&
              isPascalCase(decl.id.name)
            ) {
              exportsToCheck.push({ name: decl.id.name, node: decl.id });
            }
          }
        }

        // Случай: export { Button, App as Main }
        if (node.specifiers.length > 0) {
          for (const spec of node.specifiers) {
            if (
              spec.exported.type === AST_NODE_TYPES.Identifier &&
              isPascalCase(spec.exported.name)
            ) {
              // Здесь мы проверяем локальное имя (local.name), которое ссылается на переменную в файле
              exportsToCheck.push({
                //@ts-ignore
                name: spec.local.name,
                node: spec.exported,
              });
            }
          }
        }
      },

      // 3. Собираем дефолтные экспорты: export default Button
      ExportDefaultDeclaration(node) {
        if (node.declaration.type === AST_NODE_TYPES.Identifier) {
          if (isPascalCase(node.declaration.name)) {
            exportsToCheck.push({
              name: node.declaration.name,
              node: node.declaration,
            });
          }
        }
        // Если экспорт сразу вызовом: export default createUIComponent(...)
        if (node.declaration.type === AST_NODE_TYPES.CallExpression) {
          if (
            node.declaration.callee.type === AST_NODE_TYPES.Identifier &&
            node.declaration.callee.name !== "createUIComponent"
          ) {
            context.report({
              node: node.declaration,
              messageId: "mustUseCreateComponent",
              data: { name: "Default Export" },
            });
          }
        }
      },

      // 4. В самом конце обхода файла проверяем всё, что собрали
      "Program:exit"() {
        for (const { name, node } of exportsToCheck) {
          if (!validIdentifiers.has(name)) {
            context.report({
              node,
              messageId: "mustUseCreateComponent",
              data: { name },
            });
          }
        }
      },
    };
  },
});
