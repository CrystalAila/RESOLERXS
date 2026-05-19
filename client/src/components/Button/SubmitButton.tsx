import type { FC } from "react";

interface SubmitButtonProps {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  className?: string;
  disabled?: boolean;
}

const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  loading,
  loadingLabel,
  className = "",
  disabled,
}) => (
  <button
    type="submit"
    disabled={loading || disabled}
    className={`rounded-lg bg-rx-accent px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-rx-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {loading ? loadingLabel ?? "Loading..." : label}
  </button>
);

export default SubmitButton;
