import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pages/pageSlice";
import queryReducer from "./search/querySlice";
import loginFormReducer from "./auth/loginFormSlice";
import registerFormReducer from "./auth/registerFormSlice";
import fgPassFormReducer from "./auth/fgPassSlice"

export const store = configureStore({
    reducer: {
        page: pageReducer,
        query: queryReducer,
        loginForm: loginFormReducer,
        registerForm: registerFormReducer,
        fgPassForm: fgPassFormReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;