import { FC, useState } from "react";

interface LogoutButtonProps {
  onSuccess: () => Promise<void>;
}

export const LogoutButton: FC<LogoutButtonProps> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4001/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Ошибка при выходе");
      }

      // Вызываем onSuccess для очистки состояния
      await onSuccess();
      
      // Принудительно перезагружаем страницу для полного сброса состояния
      window.location.href = "/";
    } catch (error) {
      console.error("Ошибка logout:", error);
      alert("Не удалось выйти из системы");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="btn btn-danger"
      style={{ marginBottom: "10px", width: "100%" }}
    >
      {loading ? "Выход..." : "Выйти"}
    </button>
  );
};