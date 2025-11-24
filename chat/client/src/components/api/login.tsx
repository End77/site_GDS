export interface LoginResponse {
  id: string;
  email: string;
  username: string;
  company: string;
  role: "user" | "admin"; // ⚡ обязательно role
}

export async function LogIn(
  email: string,
  password: string,
  company: string
): Promise<LoginResponse> {
  const response = await fetch("http://localhost:4001/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, company }),
    credentials: "include", // для cookie
  });

  if (!response.ok) {
    let message = "Ошибка входа";
    try {
      const err = await response.json();
      message = err?.error ?? JSON.stringify(err);
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }

  const data: LoginResponse = await response.json();
  return data;
}

export async function logOut() {
  await fetch("http://localhost:4001/api/logout", {
    method: "POST",
    credentials: "include",
  });
}
