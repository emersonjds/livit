import { forwardRef } from "react";

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
          <span className="mb-1 block text-sm font-medium text-foreground/90">{label}</span>
        )}
        <input
          ref={ref}
          {...props}
          className={`w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
        />
        {hint && !error && <span className="mt-1 block text-xs text-muted">{hint}</span>}
        {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
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
        <span className="mb-1 block text-sm font-medium text-foreground/90">{label}</span>
      )}
      <select
        {...props}
        className={`w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
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
        <span className="mb-1 block text-sm font-medium text-foreground/90">{label}</span>
      )}
      <textarea
        {...props}
        className={`w-full rounded-xl border border-border bg-card px-3 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${className}`}
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
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-3 text-left"
    >
      <span className="text-sm font-medium">{label}</span>
      <span
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-foreground/15"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
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
      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground/80 hover:border-foreground/30"
      }`}
    >
      {children}
    </button>
  );
}
