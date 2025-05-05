import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Experience from "./pages/Experience";
import LandingPage from "./pages/LandingPage";
import C12Platform from "./pages/C12Platform";
import "./index.css";

// Create root and render app with router
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/news" element={<C12Platform />} />
      <Route path="/c12" element={<C12Platform />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
