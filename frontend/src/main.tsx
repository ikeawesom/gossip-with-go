import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { store } from "./state/store.ts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import PostPage from "./components/posts/PostPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/:author_id/posts/:post_id" element={<PostPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
