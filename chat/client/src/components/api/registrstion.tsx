async function validateResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
}

export function Registration(
  username: string,
  email: string,
  password: string,
  company: string
): Promise<void> {
  return fetch("http://localhost:4001/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, company }),
    credentials: "include", // если сервер возвращает cookie
  })
    .then((response) => validateResponse(response))
    .then(() => undefined);
}
