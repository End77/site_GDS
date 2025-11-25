import { useQuery } from "@tanstack/react-query";
import { fetchMessages, Message } from "../type";

export function useMessageList(url: string, queryKeys: (string | number)[]) {
  const messageListQuery = useQuery<Message[]>({
    queryKey: queryKeys,
    queryFn: () => fetchMessages(url),
  });

  return { messageListQuery };
}
