import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline";

interface DuoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

// Each variant sets --duo-shadow to its own "pressable" depth color; the
// shadow/translate mechanics themselves live once in the base className below.
const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-duo-green text-white [--duo-shadow:var(--color-duo-green-dark)] disabled:bg-duo-gray-200 disabled:text-duo-gray-400 disabled:[--duo-shadow:var(--color-duo-gray-300)]",
  secondary:
    "bg-duo-blue text-white [--duo-shadow:var(--color-duo-blue-dark)] disabled:bg-duo-gray-200 disabled:text-duo-gray-400 disabled:[--duo-shadow:var(--color-duo-gray-300)]",
  danger: "bg-duo-red text-white [--duo-shadow:var(--color-duo-red-dark)]",
  outline:
    "bg-white text-duo-blue border-2 border-duo-gray-200 [--duo-shadow:var(--color-duo-gray-200)] disabled:text-duo-gray-400",
};

export function DuoButton({
  variant = "primary",
  className = "",
  disabled,
  children,
  ...props
}: DuoButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`rounded-2xl px-6 py-4 text-sm font-extrabold uppercase tracking-wide transition-all duration-100 shadow-[0_4px_0_var(--duo-shadow)] active:translate-y-[3px] active:shadow-[0_1px_0_var(--duo-shadow)] disabled:cursor-not-allowed disabled:active:translate-y-0 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
