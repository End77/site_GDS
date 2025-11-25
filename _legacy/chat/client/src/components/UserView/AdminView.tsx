import { useQuery } from "@tanstack/react-query";
import { fetchAllMessages, Message } from "../api/fetchAllMessages";
import { Loader } from "../Loader";
import { LogoutView } from "../LogoutButton/logoutView";

export function AdminView() {
  const { data, isFetching } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: fetchAllMessages,
    retry: 0,
  });

  if (isFetching) return <Loader />;

  if (!data || data.length === 0) return( 
  <div className="">

     <p>Сообщений нет.</p>   
              <LogoutView/>
  </div>
  )
;

  return (
    <div>
              <LogoutView/>

      <h1>Все переписки пользователей</h1>
    {data?.map((msg: Message) => (
  <div key={msg.id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
    <p>
      <b>{msg.fromEmail}</b> → <b>{msg.toEmail}</b>: {msg.text}
    </p>
  </div>
))}
    </div>
  );
}
