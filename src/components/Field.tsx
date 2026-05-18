import { forwardRef } from "react";

const inputBase =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-card dark:border-border dark:text-foreground";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export const Field = forwardRef<HTMLInputElement, InputProps>(
  function Field({ label, hint, error, className = "", ...props }, ref) {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
        )}
        <input
          ref={ref}
          {...props}
          className={`${inputBase} ${className}`}
        />
        {hint && !error && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
        {error && <span className="mt-1.5 block text-xs text-danger">{error}</span>}
      </label>
    );
  }
);

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { value: string; label: string }[];
};

export function Select({ label, options, className = "", ...props }: SelectProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <select
        {...props}
        className={`${inputBase} ${className}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      )}
      <textarea
        {...props}
        className={`${inputBase} ${className}`}
      />
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-left dark:bg-card dark:border-border"
    >
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-border-strong"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : "border-border bg-surface text-foreground hover:border-primary/50 dark:bg-card"
      }`}
    >
      {children}
    </button>
  );
}
