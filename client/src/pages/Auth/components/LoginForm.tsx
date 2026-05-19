import { useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import type { LoginCredentialsErrorFields } from "../../../Interfaces/AuthInterface";
import { useAuth } from "../../../contexts/AuthContext";

interface LoginFormProps {
  onMessage: (message: string, isFailed?: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = ({ onMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginCredentialsErrorFields>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await login(username, password);
      navigate("/dashboard");
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; data?: { message?: string; errors?: LoginCredentialsErrorFields } } };
      if (err.response?.status === 401) {
        setErrors({});
        onMessage(err.response.data?.message ?? "Invalid credentials", true);
      } else if (err.response?.status === 422) {
        setErrors(err.response.data?.errors ?? {});
      } else {
        onMessage("Unable to sign in. Please try again.", true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      <FloatingLabelInput
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
        errors={errors.username}
      />
      <FloatingLabelInput
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        errors={errors.password}
      />
      <SubmitButton
        className="w-full"
        label="Sign In"
        loading={isLoading}
        loadingLabel="Signing In..."
      />
    </form>
  );
};

export default LoginForm;
