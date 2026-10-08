import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@/app";
import { enableMocking } from "@/mocks/enable";

import "./index.css";

const root = createRoot(document.getElementById("root")!);

enableMocking().then(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
