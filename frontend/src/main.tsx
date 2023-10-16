import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App.tsx";
import Login from "./Login.tsx";
import SignUp from "./SignUp.tsx";
import Dashboard from "./Dashboard.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
