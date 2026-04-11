import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainApp from "./pages/MainApp";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DocumentsPage from "./pages/DocumentsPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";

const fullAppEnabled = import.meta.env.VITE_ENABLE_FULL_APP === "true";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {fullAppEnabled && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <DocumentsPage />
                </ProtectedRoute>
              }
            />
          </>
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
