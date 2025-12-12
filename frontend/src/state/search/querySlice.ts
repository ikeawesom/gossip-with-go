import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { QueryPeek, queryState } from "../../types/query";
import { TEMP_QUERY_RESULTS } from "../../lib/constants";


const initialState: queryState = {
    query: "",
    results: [],
    isLoading: false,
    isShowResults: false,
}

export const queryAsync = createAsyncThunk(
    "query/fetchQuery",
    async (query: string) => {
        // fetch from backend if needed
        // const data = await fetch(`api/...${query}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const data = TEMP_QUERY_RESULTS;
        return data
    }
)

const querySlice = createSlice({
    name: "query",
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
            if (action.payload !== "") {
                state.isShowResults = true;
            } else {
                state.isShowResults = false;
            }
        },
        hideResults: (state) => {
            state.isShowResults = false;
        },
        showResults: (state) => {
            state.isShowResults = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(queryAsync.pending, (state) => {
            state.isLoading = true; state.results = [];
        })
            .addCase(queryAsync.fulfilled, (state, action: PayloadAction<QueryPeek[]>) => {
                state.results = action.payload;
                state.isLoading = false;
            });
    }
})

export const { setQuery, hideResults, showResults } = querySlice.actions;

export default querySlice.reducer;