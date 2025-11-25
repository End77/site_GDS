export interface LoginResponse {
  id: string;
  email: string;
  username: string;
  company: string;
  role: "user" | "admin";
}

export async function fetchMe(): Promise<LoginResponse | null> {
  const res = await fetch("http://localhost:4001/api/me", { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}
