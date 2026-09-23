import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "outline";

interface DuoButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-duo-green text-white shadow-[0_4px_0_var(--color-duo-green-dark)] active:shadow-[0_1px_0_var(--color-duo-green-dark)] disabled:bg-duo-gray-200 disabled:text-duo-gray-400 disabled:shadow-[0_4px_0_var(--color-duo-gray-300)]",
  secondary:
    "bg-duo-blue text-white shadow-[0_4px_0_var(--color-duo-blue-dark)] active:shadow-[0_1px_0_var(--color-duo-blue-dark)] disabled:bg-duo-gray-200 disabled:text-duo-gray-400 disabled:shadow-[0_4px_0_var(--color-duo-gray-300)]",
  danger:
    "bg-duo-red text-white shadow-[0_4px_0_var(--color-duo-red-dark)] active:shadow-[0_1px_0_var(--color-duo-red-dark)]",
  outline:
    "bg-white text-duo-blue border-2 border-duo-gray-200 shadow-[0_4px_0_var(--color-duo-gray-200)] active:shadow-[0_1px_0_var(--color-duo-gray-200)] disabled:text-duo-gray-400",
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
      className={`rounded-2xl px-6 py-4 text-sm font-extrabold uppercase tracking-wide transition-all duration-100 active:translate-y-[3px] disabled:cursor-not-allowed disabled:active:translate-y-0 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
