import type { FC, PropsWithChildren } from "react";
import { useTheme } from "./context";

export const ThemeGuard: FC<PropsWithChildren> = ({ children }) => {
  useTheme();

  return <>{children}</>;
};

export function createUIComponent<T>(Component: FC<T>) {
  return (props: T) => (
    <ThemeGuard>
      <Component {...props} />
    </ThemeGuard>
  );
}
