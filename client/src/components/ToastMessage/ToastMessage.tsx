import { useEffect, type FC } from "react";

interface ToastMessageProps {
  message: string;
  isFailed: boolean;
  isVisible: boolean;
  onClose: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
  message,
  isFailed,
  isVisible,
  onClose,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [isVisible, onClose]);

  return (
    <div
      className={`fixed top-20 right-4 z-[999999] flex max-w-sm items-center gap-3 rounded-lg border bg-rx-card px-4 py-3 shadow-xl transition-opacity duration-300 ${
        isFailed ? "border-red-500" : "border-emerald-500"
      } ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      role="alert"
    >
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${isFailed ? "bg-red-500" : "bg-emerald-500"}`}
      />
      <p className="text-sm font-medium text-white">{message}</p>
    </div>
  );
};

export default ToastMessage;
