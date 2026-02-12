import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
