import { FC, useState, useRef } from "react";
import { sendMessage, sendFile } from "../type";

interface NoteFormProps {
  userId: string;
  onSuccess: () => void;
}

export const NoteForm: FC<NoteFormProps> = ({ userId, onSuccess }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!text.trim() && !selectedFile) || loading) return;

    setLoading(true);
    try {
      if (selectedFile) {
        console.log("Отправка файла:", selectedFile.name, selectedFile.type);
        await sendFile(userId, selectedFile);
        setSelectedFile(null);
        setPreview(null);
      } else if (text.trim()) {
        console.log("Отправка текста:", text);
        await sendMessage(userId, text);
      }
      setText("");
      onSuccess();
    } catch (error) {
      console.error("Ошибка отправки (детально):", error);
      alert(`Не удалось отправить сообщение: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setText(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setText(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const cancelPreview = () => {
    setPreview(null);
    setSelectedFile(null);
    setText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
      {preview && (
        <div
          style={{
            marginBottom: "10px",
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              borderRadius: "8px",
            }}
          />
          <button
            type="button"
            onClick={cancelPreview}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "rgba(0,0,0,0.7)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "25px",
              height: "25px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          disabled={loading || !!selectedFile}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #444",
            backgroundColor: "#2a2b2c",
            color: "white",
          }}
        />

        <input
          ref={imageInputRef}
          type="file"
          onChange={handleImageSelect}
          disabled={loading}
          accept="image/*"
          style={{ display: "none" }}
          id={`image-input-${userId}`}
        />

        <label
          htmlFor={`image-input-${userId}`}
          title="Отправить фото"
          style={{
            padding: "10px 15px",
            backgroundColor: "#444",
            color: "white",
            borderRadius: "20px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            fontSize: "20px",
          }}
        >
          🖼️
        </label>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          disabled={loading}
          accept="application/pdf,.doc,.docx,.txt,.zip,.rar,.xls,.xlsx"
          style={{ display: "none" }}
          id={`file-input-${userId}`}
        />

        <label
          htmlFor={`file-input-${userId}`}
          title="Отправить файл"
          style={{
            padding: "10px 15px",
            backgroundColor: "#444",
            color: "white",
            borderRadius: "20px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            fontSize: "20px",
          }}
        >
          📎
        </label>

        <button
          type="submit"
          disabled={(!text.trim() && !selectedFile) || loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0084ff",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: loading || (!text.trim() && !selectedFile) ? "not-allowed" : "pointer",
            opacity: loading || (!text.trim() && !selectedFile) ? 0.5 : 1,
          }}
        >
          {loading ? "⏳" : "Отправить"}
        </button>
      </div>
    </form>
  );
};