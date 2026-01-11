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
import ProfilePage from "./pages/ProfilePage.tsx";
import NavSection from "./components/nav/NavSection.tsx";
import NotFound from "./pages/NotFound.tsx";
import TopicPage from "./pages/TopicPage.tsx";
import TrendingPostsPage from "./pages/TrendingPostsPage.tsx";
import FollowingPage from "./pages/FollowingPage.tsx";
import { registerSW } from "virtual:pwa-register";
// import ProtectedRoute from "./routes/ProtectedRoute.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster richColors position="top-center" />
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <AuthInitializer>
            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/trending" element={<TrendingPostsPage />} />
              <Route path="/following" element={<FollowingPage />} />
              <Route path="/topics/:topic_id" element={<TopicPage />} />
              <Route path="/auth/:auth_option" element={<AuthPage />} />
              <Route path="/auth/:auth_option/:token" element={<AuthPage />} />
              <Route path="/:user_id/posts/:post_id" element={<PostPage />} />
              <Route path="/:user_id" element={<ProfilePage />} />
              <Route
                path="*"
                element={
                  <NavSection>
                    <NotFound />
                  </NavSection>
                }
              />
            </Routes>
          </AuthInitializer>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);

registerSW({
  immediate: true,
  onNeedRefresh() {
    window.location.reload();
  },
});
