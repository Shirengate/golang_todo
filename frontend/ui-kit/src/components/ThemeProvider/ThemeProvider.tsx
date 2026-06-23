import { useCallback, useState, type FC, type PropsWithChildren } from "react";
import { ThemeContext, type Theme } from "./context.tsx";
import "../../assets/global.scss";
import styles from "./ThemeProvider.module.scss";
import clsx from "clsx";

interface ThemeProviderProps {
  appTheme?: "light" | "dark";
}
export const ThemeProvider: FC<PropsWithChildren<ThemeProviderProps>> = ({
  children,
  appTheme = "light",
}) => {
  const [theme, setTheme] = useState<Theme>(appTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);
  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme, toggleTheme }}>
      <div
        className={clsx("ui-theme-provider", styles.provider)}
        style={{ colorScheme: theme }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
