import { FormEventHandler, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { LogIn, LoginResponse } from "../api/login";
import { queryClient } from "../queryclient";
import { Button } from "../Button";
import { FormField } from "../FormField";

interface LoginFormProps {
  onSuccess?: (userData: LoginResponse) => void | Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const loginMutation = useMutation<
    LoginResponse,
    Error,
    { email: string; password: string; company: string }
  >({
    mutationFn: async ({ email, password, company }) =>
      await LogIn(email, password, company),

    onSuccess: async (userData) => {
      queryClient.setQueryData(["users", "me"], userData);

      if (userData.role === "admin") {
        window.location.href = "/admin"; // ⚡ редирект для админа
        return;
      }

      if (onSuccess) await onSuccess(userData);
    },

    onError: (error: any) => {
      setErrorMessage(error.message || "Ошибка входа");
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (email && password && company) {
      loginMutation.mutate({ email, password, company });
    } else {
      setErrorMessage("Введите все данные");
    }
  };

  return (
    <form
      className="login-form"
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "320px", margin: "0 auto" }}
    >
      <FormField label="Email">
        <input
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      <FormField label="Пароль">
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      <FormField label="Company">
        <input
          type="text"
          value={company}
          onChange={(e) => {
            setCompany(e.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      {errorMessage && (
        <span style={{ color: "red", fontSize: "14px" }}>{errorMessage}</span>
      )}

      <Button isLoading={loginMutation.isPending} type="submit" style={{ marginTop: "10px" }}>
        Войти
      </Button>
    </form>
  );
};
