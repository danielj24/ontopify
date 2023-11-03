import React from "react";
import ReactDOM from "react-dom/client";
import "@renderer/globals.css";
import App from "@renderer/App";

const root = document.getElementById("root") as Element;

ReactDOM.createRoot(root).render(<App />);
