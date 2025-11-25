import { useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { AuthForm } from "../AuthForm";

export function LogoutView() {
  const [loggedOut, setLoggedOut] = useState(false);

  if (loggedOut) {
    return <AuthForm />; // показываем форму авторизации после выхода
  }

  return <LogoutButton onSuccess={() => setLoggedOut(true)} />;
}
