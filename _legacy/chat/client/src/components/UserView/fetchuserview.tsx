import { useQuery } from "@tanstack/react-query";
import { fetchMe, LoginResponse } from "../api/fetchMe";
import { Loader } from "../Loader";
import { AuthForm } from "../AuthForm";
import { Account } from "../account";
import { logOut } from "../api/logout";
import { queryClient } from "../queryclient";

export function FetchUserView() {
  const { data, isFetching, refetch, isError } = useQuery<LoginResponse | null>({
    queryKey: ["users", "me"],
    queryFn: fetchMe,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  // Пока идёт загрузка данных
  if (isFetching) return <Loader />;

  // Если ошибка или пользователь не авторизован
  if (isError || !data) {
    return (
      <AuthForm
        onSuccess={async () => {
          await refetch(); // после успешного логина/регистрации обновляем данные
        }}
      />
    );
  }

  // Рендерим Account напрямую для любого пользователя
  return (
    <Account
      note={data}
      onLogout={async () => {
        await logOut();
        queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      }}
    />
  );
}
