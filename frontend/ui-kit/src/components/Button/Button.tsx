import clsx from "clsx";
import styles from "./Button.module.scss";
import type { FC, ButtonHTMLAttributes } from "react";
import { createUIComponent } from "../ThemeProvider/utils";
type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface OwnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const Button_: FC<OwnProps> = createUIComponent(
  ({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className,
    children,
    ...rest
  }) => {
    const classes = clsx(
      styles.button,
      styles[variant],
      styles[size],
      { [styles.fullWidth]: fullWidth },
      className,
    );

    return (
      <button {...rest} className={classes}>
        {children}
        gdf
      </button>
    );
  },
);
export const Button = Button_;
