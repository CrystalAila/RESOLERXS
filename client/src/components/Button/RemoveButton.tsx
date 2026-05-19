import type { FC } from "react";

interface RemoveButtonProps {
  label: string;
  className?: string;
  newClassName?: string;
  onRemove: () => void;
}

const RemoveButton: FC<RemoveButtonProps> = ({
  label,
  className,
  newClassName,
  onRemove,
}) => {
  return (
    <>
      <button
        type="button"
        className={
          newClassName
            ? newClassName
            : `cursor-pointer rounded-lg border border-rx-border px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-rx-muted transition hover:bg-white/5 hover:text-white ${className ?? ""}`
        }
        onClick={onRemove}
      >
        {label}
      </button>
    </>
  );
};

export default RemoveButton;
