import "./NoteView.css";
import {Note} from "../type"
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Notes{
  note:Note[]
}



export const NoteView = ({note}:Notes) => {
 
  return (
    <div className="note-view">
      {note.map((item)=>(
        <div>
              <div className="note-view__head">
              <p className="note-view__datetime">{formatDate(Date.now())}</p>
            </div>
      
            <p className="note-view__text">
              {item.text}
             
            </p>
            </div>
            ))}
  
    </div>
  );
};
