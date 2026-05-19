import type { FC } from "react";

interface CloseButtonProps {
  label?: string;
  onClose: () => void;
  className?: string;
}

const CloseButton: FC<CloseButtonProps> = ({
  label = "Cancel",
  onClose,
  className = "",
}) => (
  <button
    type="button"
    className={`cursor-pointer rounded-lg border border-rx-border px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-rx-muted transition hover:bg-white/5 hover:text-white ${className}`}
    onClick={onClose}
  >
    {label}
  </button>
);

export default CloseButton;
