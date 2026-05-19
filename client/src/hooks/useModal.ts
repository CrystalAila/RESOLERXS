import { useCallback, useState } from "react";

export const useModal = <T = null>(initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [selected, setSelected] = useState<T | null>(null);

  const openModal = useCallback((item?: T | null) => {
    setSelected(item ?? null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
    setIsOpen(false);
  }, []);

  return { isOpen, selected, openModal, closeModal };
};
