import React, { FC, ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

import "./Button.less";

type Variant =
  | "ghost"
  | "dark"
  | "link"
  | "critical"
  | "rounded"
  | "light"
  | "cancel";

type Size = "small" | "";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  disabled?: boolean;
  variant?: Variant | Variant[];
  size?: Size;
  className?: string;
}

const Button: FC<ButtonProps> = ({
  disabled = false,
  size = "",
  children,
  variant,
  className,
  ...restProps
}) => {
  const variantClasses = Array.isArray(variant) ? variant : [variant];

  return (
    <button
      className={classNames("Button", className, ...variantClasses, {
        [size]: !!size
      })}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
