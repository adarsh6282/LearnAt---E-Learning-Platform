import { Toaster } from "react-hot-toast";
import UserRoutes from "./routes/UserRoutes";
import InstructorRoutes from "./routes/InstructorRoutes";
import { BrowserRouter, Routes } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {AdminRoutes}
        {UserRoutes()}
        {InstructorRoutes()}
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1500,
        }}
        
      />
    </BrowserRouter>
  );
}

export default App;
