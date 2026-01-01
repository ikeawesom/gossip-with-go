import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./pages/pageSlice";
import authReducer from "./auth/authSlice"
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// persist configuration
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
    reducer: {
        page: pageReducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;