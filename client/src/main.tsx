import { createRoot } from "react-dom/client";
import Experience from "./pages/Experience";
import "./index.css";

// Create root and render app directly without router
createRoot(document.getElementById("root")!).render(<Experience />);
