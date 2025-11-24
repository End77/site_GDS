import { z } from "zod";

// ====================== HELPERS ======================
const validateResponse = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response;
};

// ====================== TYPES ======================
export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const FetchUserListSchema = z.object({
  id: z.string(),
  email: z.string(),
  username: z.string(),
  company: z.string(),
  role: z.string(),
});
export type FetchUserListResponse = z.infer<typeof FetchUserListSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  text: z.string(),
  fromUserId: z.string(),
  toUserId: z.string(),
  createdAt: z.number(),
  messageType: z.string().optional(),
  fileUrl: z.string().optional(),
  isMedia: z.boolean().optional(),
});
export type Message = z.infer<typeof MessageSchema>;
export const MessageListSchema = z.array(MessageSchema);
export type MessageList = z.infer<typeof MessageListSchema>;

// ====================== USERS ======================

export async function fetchCurrentUser(): Promise<FetchUserListResponse> {
  const res = await fetch("http://localhost:4001/api/me", { credentials: "include" });
  await validateResponse(res);
  const json = await res.json();
  const user = json.user ?? json;
  return FetchUserListSchema.parse(user);
}

export async function fetchAllUsers(): Promise<FetchUserListResponse[]> {
  const res = await fetch("http://localhost:4001/users/all", { credentials: "include" });
  await validateResponse(res);
  const json = await res.json();
  return z.array(FetchUserListSchema).parse(json);
}

// ====================== MESSAGES ======================

export async function fetchMessages(toUserId?: string, all?: boolean): Promise<Message[]> {
  let url = "http://localhost:4001/notes";
  if (all) url += "?all=true";
  else if (toUserId) url += `?toUserId=${toUserId}`;

  const res = await fetch(url, { credentials: "include" });
  await validateResponse(res);
  const json = await res.json();
  return MessageListSchema.parse(json);
}

export async function sendMessage(toUserId: string, text: string): Promise<Message> {
  const res = await fetch("http://localhost:4001/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ toUserId, text }),
  });
  await validateResponse(res);
  const json = await res.json();
  return MessageSchema.parse(json.message ?? json);
}

export async function sendFile(toUserId: string, file: File): Promise<Message> {
  const formData = new FormData();
  formData.append("toUserId", toUserId);
  formData.append("file", file);

  const res = await fetch("http://localhost:4001/notes/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  await validateResponse(res);
  const json = await res.json();
  return MessageSchema.parse(json.message ?? json);
}

// ====================== REQUEST STATES ======================
interface IdleRequest { status: "idle"; }
interface LoadingRequest { status: "pending"; }
interface SuccessRequest<T = User> { status: "success"; data: T; }
interface ErrorRequest { status: "error"; error: unknown; }

export type RequestState<T = User> =
  | IdleRequest
  | LoadingRequest
  | SuccessRequest<T>
  | ErrorRequest;