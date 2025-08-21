import { ToastContainer } from "react-toastify";
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
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
