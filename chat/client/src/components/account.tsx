import { FC, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogoutButton } from "./LogoutButton/LogoutButton";
import { NoteForm } from "./NoteForm";
import { NotesListView } from "./NotesListView";
import { fetchMessages, FetchUserListResponse, Message, fetchAllUsers } from "./type";
import { queryClient } from "./queryclient";

import "./NoteForm/NoteForm.css";
import "./accoubt.css";

interface AccountProps {
  note: FetchUserListResponse;
  onLogout: () => Promise<void>;
}

interface DialogInfo {
  user1: FetchUserListResponse;
  user2: FetchUserListResponse;
  key: string;
  lastMessage?: Message;
}

export const Account: FC<AccountProps> = ({ note, onLogout }) => {
  const [users, setUsers] = useState<FetchUserListResponse[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState<FetchUserListResponse | null>(null);
  const [selectedDialog, setSelectedDialog] = useState<DialogInfo | null>(null);
  const [lastChats, setLastChats] = useState<string[]>([]);

  // Если note содержит вложенный объект user, используем его
  const me = 'user' in note ? note.user : note;
  const isAdmin = me.role?.trim() === "admin";

  console.log("Текущий пользователь (JSON):", JSON.stringify(me, null, 2));
  console.log("Роль:", me.role);
  console.log("isAdmin:", isAdmin);

  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        console.log("Загружены пользователи:", data);
        setUsers(data);
      })
      .catch(console.error)
      .finally(() => setLoadingUsers(false));
  }, []);

  const availableUsers = users
    .filter((u) => u.id !== me.id && u.role !== "admin") // Исключаем себя и админа
    .sort((a, b) => {
      const aIndex = lastChats.indexOf(a.id);
      const bIndex = lastChats.indexOf(b.id);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

  useEffect(() => {
    if (!isAdmin && !selectedUser && availableUsers.length > 0) {
      const lastId = lastChats[0];
      const lastUser = availableUsers.find((u) => u.id === lastId);
      setSelectedUser(lastUser || availableUsers[0]);
    }
  }, [availableUsers.length, isAdmin]);

  if (loadingUsers) return <p style={{ color: "gray" }}>Загрузка сотрудников...</p>;

  return (
    <div className="container">
      <div>
        <h4 style={{ color: "white" }}>
          👤 Текущий пользователь: {isAdmin && "🔑 Администратор"}
        </h4>
        <LogoutButton
          onSuccess={async () => {
            setSelectedUser(null);
            setSelectedDialog(null);
            queryClient.clear();
            await onLogout();
          }}
        />
        <button className="list-group-item list-group-item-action bg-dark text-light text-center">
          {me.username} ({me.email})
        </button>

        <div className="flx">
          <div>
            {isAdmin ? (
              <AdminDialogsList
                users={users}
                selectedDialog={selectedDialog}
                onSelectDialog={setSelectedDialog}
              />
            ) : (
              <>
                <h4 style={{ color: "white" }}>👥 Коллеги в {me.company || "компании"}:</h4>
                {availableUsers.length > 0 ? (
                  <ul style={{ listStyle: "none" }} className="list-group list-group-flush">
                    {availableUsers.map((u) => (
                      <li key={u.id}>
                        <button
                          className={`list-group-item list-group-item-action bg-dark text-light ${
                            selectedUser?.id === u.id ? "active" : ""
                          }`}
                          onClick={() => {
                            setSelectedUser(u);
                            setLastChats((prev) => [u.id, ...prev.filter((id) => id !== u.id)]);
                          }}
                        >
                          👤 {u.username}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ color: "white" }}>В компании пока нет других сотрудников</p>
                )}
              </>
            )}
          </div>

          <div style={{ width: "100%" }}>
            {!isAdmin && selectedUser && (
              <UserChat
                currentUser={me}
                selectedUser={selectedUser}
                onNewMessage={(id) =>
                  setLastChats((prev) => [id, ...prev.filter((uid) => uid !== id)])
                }
              />
            )}
            {isAdmin && selectedDialog && <AdminChatView dialog={selectedDialog} />}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AdminDialogsListProps {
  users: FetchUserListResponse[];
  selectedDialog: DialogInfo | null;
  onSelectDialog: (dialog: DialogInfo) => void;
}

const AdminDialogsList: FC<AdminDialogsListProps> = ({ users, selectedDialog, onSelectDialog }) => {
  const { data: allMessages } = useQuery<Message[], Error>({
    queryKey: ["all-messages"],
    queryFn: () => fetchMessages(undefined, true),
  });

  const dialogs: DialogInfo[] = [];
  const dialogMap = new Map<string, Message[]>();

  if (allMessages) {
    allMessages.forEach((msg) => {
      const key1 = `${msg.fromUserId}-${msg.toUserId}`;
      const key2 = `${msg.toUserId}-${msg.fromUserId}`;
      
      if (!dialogMap.has(key1) && !dialogMap.has(key2)) {
        dialogMap.set(key1, [msg]);
      } else {
        const existingKey = dialogMap.has(key1) ? key1 : key2;
        dialogMap.get(existingKey)!.push(msg);
      }
    });

    dialogMap.forEach((messages, key) => {
      const [fromId, toId] = key.split("-");
      const user1 = users.find((u) => u.id === fromId);
      const user2 = users.find((u) => u.id === toId);

      if (user1 && user2) {
        const sortedMessages = messages.sort((a, b) => b.createdAt - a.createdAt);
        dialogs.push({
          user1,
          user2,
          key,
          lastMessage: sortedMessages[0],
        });
      }
    });
  }

  dialogs.sort((a, b) => {
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return b.lastMessage.createdAt - a.lastMessage.createdAt;
  });

  return (
    <>
      <h4 style={{ color: "white" }}>👥 Все переписки:</h4>
      {dialogs.length > 0 ? (
        <ul style={{ listStyle: "none" }} className="list-group list-group-flush">
          {dialogs.map((dialog) => (
            <li key={dialog.key}>
              <button
                className={`list-group-item list-group-item-action bg-dark text-light ${
                  selectedDialog?.key === dialog.key ? "active" : ""
                }`}
                onClick={() => onSelectDialog(dialog)}
                style={{ textAlign: "left" }}
              >
                <div>
                  👤 {dialog.user1.username} → 👤 {dialog.user2.username}
                </div>
                {dialog.lastMessage && (
                  <small style={{ color: "#aaa" }}>
                    {dialog.lastMessage.text.substring(0, 30)}
                    {dialog.lastMessage.text.length > 30 ? "..." : ""}
                  </small>
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "white" }}>Переписок пока нет</p>
      )}
    </>
  );
};

interface UserChatProps {
  currentUser: FetchUserListResponse;
  selectedUser: FetchUserListResponse;
  onNewMessage: (userId: string) => void;
}

const UserChat: FC<UserChatProps> = ({ currentUser, selectedUser, onNewMessage }) => {
  const { data, isLoading, error, refetch } = useQuery<Message[], Error>({
    queryKey: ["messages", selectedUser.id],
    queryFn: () => fetchMessages(selectedUser.id),
  });

  if (isLoading) return <p style={{ color: "white" }}>Загрузка сообщений...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const sortedMessages = [...(data || [])].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div>
      <h5 style={{ color: "white" }}>💬 {selectedUser.username}:</h5>
      <div className="chat">
        <NotesListView note={sortedMessages} users={[currentUser, selectedUser]} />
      </div>
      <NoteForm
        userId={selectedUser.id}
        onSuccess={() => {
          refetch();
          onNewMessage(selectedUser.id);
        }}
      />
    </div>
  );
};

interface AdminChatViewProps {
  dialog: DialogInfo;
}

const AdminChatView: FC<AdminChatViewProps> = ({ dialog }) => {
  const { data, isLoading, error } = useQuery<Message[], Error>({
    queryKey: ["dialog-messages", dialog.key],
    queryFn: () => fetchMessages(undefined, true),
  });

  if (isLoading) return <p style={{ color: "white" }}>Загрузка сообщений...</p>;
  if (error) return <p style={{ color: "red" }}>{error.message}</p>;

  const filteredMessages = (data || []).filter(
    (msg) =>
      (msg.fromUserId === dialog.user1.id && msg.toUserId === dialog.user2.id) ||
      (msg.fromUserId === dialog.user2.id && msg.toUserId === dialog.user1.id)
  );

  const sortedMessages = filteredMessages.sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div>
      <h5 style={{ color: "white" }}>
        👁️ Переписка: {dialog.user1.username} ↔️ {dialog.user2.username}
      </h5>
      <div className="chat">
        {sortedMessages.length > 0 ? (
          <NotesListView note={sortedMessages} users={[dialog.user1, dialog.user2]} />
        ) : (
          <p style={{ color: "gray", textAlign: "center", marginTop: "20px" }}>
            Сообщений пока нет
          </p>
        )}
      </div>
    </div>
  );
};