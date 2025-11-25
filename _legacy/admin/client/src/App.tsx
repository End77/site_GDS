import "./App.css";
import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ===== QueryClient =====
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// ===== TYPES =====
interface User {
  id: string;
  email: string;
  username: string;
  company: string;
  role: string;
}

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  messageType?: string;
  mediaFileId?: string;
  isMedia?: boolean;
  isBot?: boolean;
  direction?: string;
  createdAt: number;
}

// ===== API Functions =====
const API_URL = "http://localhost:4001";

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users/all`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const fetchMessages = async (toUserId: string | null, all = false): Promise<Message[]> => {
  const params = new URLSearchParams();
  if (toUserId) params.append("toUserId", toUserId);
  if (all) params.append("all", "true");

  const response = await fetch(`${API_URL}/notes?${params}`, { credentials: "include" });
  if (!response.ok) throw new Error("Failed to fetch messages");
  return response.json();
};

const sendMessage = async (data: { toUserId: string; text: string }) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

// ===== COMPONENTS =====

// Компонент чата - без авторизации
function ChatView() {
  const qc = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [viewMode, setViewMode] = useState<"users" | "all">("all"); // По умолчанию показываем все сообщения

  // Получаем список пользователей
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Получаем сообщения с выбранным пользователем
  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["messages", selectedUserId],
    queryFn: () => fetchMessages(selectedUserId, false),
    enabled: !!selectedUserId && viewMode === "users",
    refetchInterval: 3000, // автообновление каждые 3 секунды
  });

  // Получаем все сообщения
  const { data: allMessages = [], isLoading: allMessagesLoading } = useQuery<Message[]>({
    queryKey: ["messages", "all"],
    queryFn: () => fetchMessages(null, true),
    enabled: viewMode === "all",
    refetchInterval: 3000,
  });

  console.log("Users:", users);
  console.log("All messages:", allMessages);
  console.log("Selected messages:", messages);

  // Отправка сообщения
  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["messages", selectedUserId] });
      setMessageText("");
    },
  });

  const handleSendMessage = () => {
    if (!selectedUserId || !messageText.trim()) return;
    sendMutation.mutate({ toUserId: selectedUserId, text: messageText });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Левая панель - список пользователей */}
      <div style={{ width: 300, borderRight: "1px solid #ccc", padding: 10, overflowY: "auto" }}>
        <h2>Просмотр сообщений</h2>

        <button
          onClick={() => {
            setViewMode("all");
            setSelectedUserId(null);
          }}
          style={{
            width: "100%",
            padding: 10,
            marginBottom: 20,
            background: viewMode === "all" ? "#0084ff" : "#e0e0e0",
            color: viewMode === "all" ? "white" : "black",
            border: "none",
            cursor: "pointer",
            borderRadius: 5,
          }}
        >
          Все сообщения ({allMessages.length})
        </button>

       
      </div>

      {/* Правая панель - чат */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Область сообщений */}
        <div style={{ flex: 1, padding: 20, overflowY: "auto", background: "#f5f5f5" }}>
          {viewMode === "all" ? (
            // Показываем все сообщения
            <div>
              <h2>Все сообщения в системе ({allMessages.length})</h2>
              {allMessagesLoading ? (
                <p>Загрузка...</p>
              ) : allMessages.length === 0 ? (
                <p>Нет сообщений в базе данных</p>
              ) : (
                allMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: 15,
                      margin: "10px 0",
                      background: "white",
                      borderRadius: 8,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div style={{ marginBottom: 5, color: "#666", fontSize: 12 }}>
                      <strong>От:</strong> {msg.fromUserId} → <strong>Кому:</strong> {msg.toUserId}
                    </div>
                    <p style={{ margin: "10px 0", fontSize: 14 }}>{msg.text}</p>
                    <div style={{ fontSize: 11, color: "#999" }}>
                      {new Date(msg.createdAt).toLocaleString()}
                      {msg.isMedia && " 📎 Медиа"}
                      {msg.isBot && " 🤖 Бот"}
                      {msg.messageType && ` | Тип: ${msg.messageType}`}
                      {msg.direction && ` | ${msg.direction}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : selectedUserId ? (
            // Показываем диалог с выбранным пользователем
            <>
              <h2>Сообщения пользователя {selectedUserId}</h2>
              {messagesLoading ? (
                <p>Загрузка...</p>
              ) : messages.length === 0 ? (
                <p>Нет сообщений</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: "flex",
                      justifyContent: msg.direction === "outgoing" ? "flex-end" : "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: 12,
                        borderRadius: 12,
                        background: msg.direction === "outgoing" ? "#0084ff" : "white",
                        color: msg.direction === "outgoing" ? "white" : "black",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 5 }}>
                        От: {msg.fromUserId} → Кому: {msg.toUserId}
                      </div>
                      <p style={{ margin: "5px 0" }}>{msg.text}</p>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 5 }}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                        {msg.isMedia && " 📎"}
                        {msg.isBot && " 🤖"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <p style={{ color: "#666" }}>Выберите пользователя или просмотрите все сообщения</p>
            </div>
          )}
        </div>

        {/* Поле ввода сообщения */}
        {selectedUserId && viewMode === "users" && (
          <div style={{ borderTop: "1px solid #ccc", padding: 10, display: "flex", background: "white" }}>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Введите сообщение..."
              style={{ 
                flex: 1, 
                padding: 10, 
                marginRight: 10, 
                border: "1px solid #ddd",
                borderRadius: 20,
                outline: "none"
              }}
            />
            <button 
              onClick={handleSendMessage} 
              style={{ 
                padding: "10px 20px",
                background: "#0084ff",
                color: "white",
                border: "none",
                borderRadius: 20,
                cursor: "pointer"
              }}
            >
              Отправить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Главный компонент приложения
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatView />
    </QueryClientProvider>
  );
}

export default App;