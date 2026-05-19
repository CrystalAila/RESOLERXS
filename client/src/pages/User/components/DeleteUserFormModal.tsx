import { useState, type FC } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import Modal from "../../../components/Modal";
import type { UserColumns } from "../../../Interfaces/UserInterface";
import UserService from "../../../services/UserService";

interface Props {
  user: UserColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (message: string) => void;
}

const DeleteUserFormModal: FC<Props> = ({ user, isOpen, onClose, onDeleted }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await UserService.destroyUser(user.user_id);
      onDeleted(res.data.message);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h2 className="mb-2 text-xl font-bold">Delete User</h2>
      <p className="mb-6 text-rx-muted">
        Remove account for <span className="font-semibold text-white">{user?.name}</span>?
      </p>
      <div className="flex justify-end gap-3">
        <CloseButton onClose={onClose} />
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-rx-accent px-5 py-2.5 text-sm font-bold uppercase text-white hover:bg-rx-accent-hover disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
};

export default DeleteUserFormModal;
