import { Loader } from "../Loader";
import { NotesListView } from "../NotesListView";
import { Message, fetchMessages, fetchUserListResponse } from "../type";
import { useQuery } from "@tanstack/react-query";
import { NoteForm } from "./NoteForm";

interface PostViewProps {
  userId: string;
  currentUser: fetchUserListResponse;
  selectedUser: fetchUserListResponse;
}

export function PostView({ userId, currentUser, selectedUser }: PostViewProps) {
  const { data, error, refetch } = useQuery<Message[], Error>({
    queryKey: ["messages", userId],
    queryFn: () => fetchMessages(userId),
  });

  if (!data) return <Loader />;
  if (error) return <h1>{error.message}</h1>;

  const sortedMessages = [...data].sort((a, b) => a.createdAt - b.createdAt);

  return (
    <div>
      <NotesListView note={sortedMessages} users={[currentUser, selectedUser]} />
      <NoteForm
        userId={userId}
        onSuccess={() => refetch()} // обновляем сообщения после отправки
      />
    </div>
  );
}
