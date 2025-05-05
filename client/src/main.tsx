import { createRoot } from "react-dom/client";
import { AppRouter } from "./setupRoutes";
import "./index.css";

// Create root and render app with router
createRoot(document.getElementById("root")!).render(<AppRouter />);
