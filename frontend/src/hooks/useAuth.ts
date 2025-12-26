import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import type { RootState, AppDispatch } from "../state/store";
import { useEffect } from "react";
import { clearError } from "../state/auth/authSlice";

export default function useAuth() {
    const {
        isLoading,
        error,
        isAuthenticated,
        user
    } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    // get the previous page user was trying to access
    const prev_page = (location.state as any)?.prev_page || '/';

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    useEffect(() => {
        // redirect if already authenticated
        if (isAuthenticated) {
            navigate(prev_page, { replace: true });
        }
    }, [isAuthenticated, navigate, prev_page]);

    return {
        isLoading,
        error, prev_page, user, isAuthenticated
    };
}