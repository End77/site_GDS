export const Posting = async (text: string, userId: string, toUserId: string) => {
  return fetch("http://localhost:4001/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: "Сообщение", // обязательное поле для сервера
      text,
      fromUserId: userId, // 👈 теперь совпадает с Notes.ts и MessageSchema
      toUserId,           // 👈 обязательно передаем получателя
      createdAt: Date.now()
    }),
  });
};
