import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const pages = ["home", "search", "post", "message", "profile"];

interface PageState {
    currentPage: string;
}

const initialState: PageState = {
    currentPage: "home",
}

export const pageSlice = createSlice({
    name: "page",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<string>) => {
            state.currentPage = action.payload;
        }
    }
})

export default pageSlice.reducer;