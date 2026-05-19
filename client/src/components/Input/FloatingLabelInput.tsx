import type { ChangeEvent, FC } from "react";

interface FloatingLabelInputProps {
  label: string;
  type?: "text" | "date" | "password" | "number";
  name: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  errors?: string[];
  min?: number;
  step?: string;
}

const FloatingLabelInput: FC<FloatingLabelInputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
  autoFocus,
  disabled,
  readOnly,
  errors,
  min,
  step,
}) => (
  <div>
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        step={step}
        className="peer block w-full rounded-lg border border-rx-border bg-rx-card px-3 pt-5 pb-2 text-sm text-white placeholder-transparent focus:border-rx-accent focus:outline-none focus:ring-1 focus:ring-rx-accent disabled:opacity-50"
        placeholder=" "

        autoFocus={autoFocus}
        disabled={disabled}
        readOnly={readOnly}
      />
      <label
        htmlFor={name}
        className="absolute start-3 top-4 z-10 origin-left -translate-y-3 scale-75 text-xs font-medium uppercase tracking-wider text-rx-muted transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75 peer-focus:text-rx-accent"
      >
        {label}
        {required && <span className="ml-1 text-rx-accent">*</span>}
      </label>
    </div>
    {errors && errors.length > 0 && (
      <p className="mt-1 text-xs text-rx-accent">{errors[0]}</p>
    )}
  </div>
);

export default FloatingLabelInput;
