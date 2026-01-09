import NavSection from "./components/nav/NavSection";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./state/store";
import { useEffect } from "react";
import SpinnerPrimary from "./components/spinner/SpinnerPrimary";

function App() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/following", { replace: true });
    } else {
      navigate("trending", { replace: true });
    }
  }, [isAuthenticated]);

  return (
    <NavSection className="flex flex-col items-center justify-center w-full gap-4">
      <SpinnerPrimary />
    </NavSection>
  );
}

export default App;
