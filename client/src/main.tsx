import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Experience from "./pages/Experience";
import LandingPage from "./pages/LandingPage";
import KloudBugsCafe from "./pages/C12Platform"; // Component name remains C12Platform, but we're using it for KloudBugs Cafe
import "./index.css";

// Create root and render app with router
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/news" element={<KloudBugsCafe />} />
      <Route path="/c12" element={<KloudBugsCafe />} />
      <Route path="/cafe" element={<KloudBugsCafe />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
