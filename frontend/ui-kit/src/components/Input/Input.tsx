import {
  useId,
  type InputHTMLAttributes,
  type FC,
  type ReactNode,
} from "react";
import clsx from "clsx";
import styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | boolean;
  variant?: "outline" | "filled" | "ghost";
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  variant = "outline",
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  id,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isError = Boolean(error);

  const rootClasses = clsx(
    styles.container,
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    className,
  );

  const inputClasses = clsx(
    styles.input,
    styles[variant],
    isError && styles.error,
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
  );

  return (
    <div className={rootClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}

        <input
          id={inputId}
          className={inputClasses}
          disabled={disabled}
          {...props}
        />

        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>

      {typeof error === "string" && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
};
