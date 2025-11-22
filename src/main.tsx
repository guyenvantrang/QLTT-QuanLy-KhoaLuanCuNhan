import React  from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./style/css/index.css";
import AppRoutes from "./routes/AppRoutes"
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from "./models/model-all";


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);