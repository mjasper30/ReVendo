import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import App from "./App.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Dashboard from "./Dashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);
