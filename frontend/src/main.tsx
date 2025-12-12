import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthPage, PostPage } from "./pages/index";
import { Toaster } from "sonner";
import "./index.css";
import { persistor, store } from "./state/store.ts";
import AuthInitializer from "./components/auth/AuthInit.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <AuthInitializer>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/:user_id" element={<App />} />
              <Route path="/auth/:auth_option" element={<AuthPage />} />
              <Route path="/auth/:auth_option/:token" element={<AuthPage />} />
              <Route
                path="/:user_id/posts/:post_id"
                element={
                  <ProtectedRoute>
                    <PostPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthInitializer>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
