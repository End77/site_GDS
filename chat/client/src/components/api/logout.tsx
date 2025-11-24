// src/api/logout.ts
export const logOut = async (): Promise<void> => {
  await fetch("http://localhost:4001/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};
