type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:opacity-90 disabled:opacity-50 shadow-sm",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-border active:opacity-90 disabled:opacity-50",
  ghost:
    "bg-transparent text-foreground hover:bg-surface active:bg-border",
  danger:
    "border border-danger/30 bg-danger/5 text-danger hover:bg-danger/10 hover:border-danger/50 active:bg-danger/15 disabled:opacity-50 dark:border-danger/30 dark:bg-danger/10 dark:text-danger dark:hover:bg-danger/20",
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
      className={`${fullWidth ? "w-full" : ""} inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
