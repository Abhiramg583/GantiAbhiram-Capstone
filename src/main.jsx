import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // adjust path if needed
import "./index.css";    // Tailwind or your CSS

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
