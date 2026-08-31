import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.scss";
// NOTE: AuthProvider is already supplied inside App.jsx (alongside
// InterviewProvider). It used to be duplicated here too, creating two
// nested, unrelated auth contexts — the outer one was dead code that just
// added confusion. Removed in favor of the single provider in App.jsx.

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);