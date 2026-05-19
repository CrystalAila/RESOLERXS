import { useEffect, useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import type { UserColumns, UserFieldErrors } from "../../../Interfaces/UserInterface";
import UserService from "../../../services/UserService";

interface Props {
  user: UserColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const EditUserFormModal: FC<Props> = ({ user, isOpen, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setRole(user.role);
      setPassword("");
      setPasswordConfirmation("");
      setErrors({});
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const payload: Record<string, string> = { name, username, role };
      if (password) {
        payload.password = password;
        payload.password_confirmation = passwordConfirmation;
      }
      const res = await UserService.updateUser(user.user_id, payload);
      onSaved(res.data.message);
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { errors?: UserFieldErrors } } };
      if (ax.response?.status === 422) setErrors(ax.response.data?.errors ?? {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-6 text-xl font-bold">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingLabelInput label="Full Name" name="edit_name" value={name} onChange={(e) => setName(e.target.value)} required errors={errors.name} />
        <FloatingLabelInput label="Username" name="edit_username" value={username} onChange={(e) => setUsername(e.target.value)} required errors={errors.username} />
        <FloatingLabelInput label="New Password (optional)" name="edit_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} errors={errors.password} />
        <FloatingLabelInput label="Confirm Password" name="edit_password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} errors={errors.password_confirmation} />
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rx-muted">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as "admin" | "staff")} className="w-full rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-white">
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <CloseButton onClose={onClose} />
          <SubmitButton label="Update User" loading={loading} loadingLabel="Updating..." />
        </div>
      </form>
    </Modal>
  );
};

export default EditUserFormModal;
