import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SocialPreviewPage } from "./SocialPreviewPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocialPreviewPage />
  </StrictMode>,
);
