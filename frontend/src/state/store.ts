import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pages/pageSlice";
import queryReducer from "./search/querySlice";

export const store = configureStore({
    reducer: {
        page: pageReducer,
        query: queryReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;