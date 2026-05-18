type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-95 active:opacity-90 disabled:opacity-50",
  secondary:
    "bg-foreground/5 text-foreground hover:bg-foreground/10 active:bg-foreground/15 disabled:opacity-50",
  ghost:
    "bg-transparent text-foreground hover:bg-foreground/5 active:bg-foreground/10",
  danger:
    "border border-red-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-300 active:bg-red-100 disabled:opacity-50 dark:border-red-900/40 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/30",
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  fullWidth = true,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`${fullWidth ? "w-full" : ""} inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
