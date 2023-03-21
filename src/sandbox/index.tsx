import React from "react";
import ReactDOM from "react-dom/client";
import TranspiledSandboxEnv from "./transpiled-sandbox-env";
import "./index.css";

ReactDOM.createRoot(document.getElementById("sandbox") as HTMLElement).render(
  <React.StrictMode>
    <TranspiledSandboxEnv />
  </React.StrictMode>
);
