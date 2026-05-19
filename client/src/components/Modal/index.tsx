import { useEffect, useRef, type FC, type ReactNode } from "react";
import ModalCloseButton from "../Button/ModalCloseButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  className,
  children,
  showCloseButton = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto p-4">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className={`relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl border border-rx-border bg-rx-card shadow-2xl ${className ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && <ModalCloseButton onClose={onClose} />}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
