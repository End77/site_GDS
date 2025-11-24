// NotesListView.tsx
import { Message, FetchUserListResponse } from "../type";

interface NotesListViewProps {
  note: Message[];
  users: FetchUserListResponse[];
}

export function NotesListView({ note, users }: NotesListViewProps) {
  const currentUserId = users[0].id;

  return (
    <ul style={{ listStyle: "none", padding: "10px", margin: 0 }}>
      {note.map((msg) => {
        const isCurrentUser = msg.fromUserId === currentUserId;
        const sender = users.find((u) => u.id === msg.fromUserId);
        const isImage = msg.messageType === "image";
        const isFile = msg.messageType === "file";

        return (
          <li
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: isCurrentUser ? "flex-end" : "flex-start",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "10px 15px",
                borderRadius: "12px",
                backgroundColor: isCurrentUser ? "#0084ff" : "#3a3b3c",
                color: "white",
                wordWrap: "break-word",
                borderBottomRightRadius: isCurrentUser ? "4px" : "12px",
                borderBottomLeftRadius: isCurrentUser ? "12px" : "4px",
              }}
            >
              {!isCurrentUser && sender && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    opacity: 0.8,
                  }}
                >
                  {sender.username}
                </div>
              )}

              {isImage && msg.fileUrl ? (
                <div>
                  <img
                    src={`http://localhost:4001${msg.fileUrl}`}
                    alt={msg.text}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "8px",
                      marginBottom: "5px",
                    }}
                  />
                  <div style={{ fontSize: "12px", opacity: 0.8 }}>{msg.text}</div>
                </div>
              ) : isFile && msg.fileUrl ? (
                <a
                  href={`http://localhost:4001${msg.fileUrl}`}
                  download
                  style={{
                    color: "white",
                    textDecoration: "underline",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  📄 {msg.text}
                </a>
              ) : (
                <div>{msg.text}</div>
              )}

              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.7,
                  marginTop: "4px",
                  textAlign: isCurrentUser ? "right" : "left",
                }}
              >
                {new Date(msg.createdAt).toLocaleTimeString("ru-RU", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}