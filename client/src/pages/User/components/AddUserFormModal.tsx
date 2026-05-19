import { useState, type FC, type FormEvent } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Modal from "../../../components/Modal";
import type { UserFieldErrors } from "../../../Interfaces/UserInterface";
import UserService from "../../../services/UserService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const AddUserFormModal: FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<UserFieldErrors>({});
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  const reset = () => {
    setName("");
    setUsername("");
    setPassword("");
    setPasswordConfirmation("");
    setRole("staff");
    setErrors({});
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await UserService.storeUser({
        name,
        username,
        password,
        password_confirmation: passwordConfirmation,
        role,
      });
      onSaved(res.data.message);
      reset();
      onClose();
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { errors?: UserFieldErrors } } };
      if (ax.response?.status === 422) setErrors(ax.response.data?.errors ?? {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { reset(); onClose(); }}>
      <h2 className="mb-6 text-xl font-bold">Add User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingLabelInput label="Full Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required errors={errors.name} />
        <FloatingLabelInput label="Username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required errors={errors.username} />
        <FloatingLabelInput label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required errors={errors.password} />
        <FloatingLabelInput label="Confirm Password" name="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required errors={errors.password_confirmation} />
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rx-muted">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className="w-full rounded-lg border border-rx-border bg-rx-bg px-3 py-2 text-white"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="mt-1 text-xs text-rx-accent">{errors.role[0]}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <CloseButton onClose={() => { reset(); onClose(); }} />
          <SubmitButton label="Save User" loading={loading} loadingLabel="Saving..." />
        </div>
      </form>
    </Modal>
  );
};

export default AddUserFormModal;
