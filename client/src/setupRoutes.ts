import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Experience from "./pages/Experience";
import LandingPage from "./pages/LandingPage";
import MessagePage from "./pages/MessagePage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
