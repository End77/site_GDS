export interface Message {
  id: string;
  text: string;
  fromUserId: string;
  toUserId: string;
  createdAt: number;
  fromEmail?: string;
  toEmail?: string;
}

export async function fetchAllMessages(): Promise<Message[]> {
  const res = await fetch("/api/admin/messages", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}
