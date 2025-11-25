import { FormField } from "../FormField";
import { Button } from "../Button";
import "./RegisterForm.css";
import { Registration } from "../api/registrstion";
import { FormEventHandler, useState } from "react";
import { queryClient } from "../queryclient";
import { useMutation } from "@tanstack/react-query";

interface RegisterFormProps {
  onSuccess?: () => void | Promise<void>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const RegMutation = useMutation({
    mutationFn: () => Registration(username, email, password, company),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      if (onSuccess) await onSuccess(); // вызываем коллбек после успешной регистрации
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (
      username.length > 5 &&
      password.length >= 8 &&
      email.includes("@") &&
      email.includes(".")
    ) {
      RegMutation.mutate();
    } else {
      setErrorMessage("Вы ввели неверные данные");
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <FormField label="Имя">
        <input
          type="text"
          value={username}
          onChange={(event) => {
            setUsername(event.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      <FormField label="Email">
        <input
          type="text"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
      </FormField>

      <FormField label="Company">
        <input
          type="text"
          value={company}
          onChange={(event) => setCompany(event.currentTarget.value)}
        />
      </FormField>

      <FormField label="Пароль">
        <input
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.currentTarget.value);
            setErrorMessage(undefined);
          }}
        />
      </FormField>

      {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}
      <span style={{ color: "red" }}>{RegMutation.error?.message}</span>

      <Button isLoading={RegMutation.isPending}>Зарегистрироваться</Button>
    </form>
  );
};
