import "./App.css";
import {FetchUserView} from "./components/UserView/fetchuserview"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
function App() {
 
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
      <FetchUserView/>
      </QueryClientProvider>
    </div>
    
  );
  
}

export default App;
