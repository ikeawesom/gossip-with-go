import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthPage, PostPage } from "./pages/index";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/auth/:auth_option" element={<AuthPage />} />
          <Route path="/:author_id/posts/:post_id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
