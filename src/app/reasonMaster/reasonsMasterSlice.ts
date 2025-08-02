import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ReturnExchangeReasons } from "./types";
import { fetchReasons } from "./reasonsApi";
import { RootState } from "../store";

export interface reasonsState {
  reasons: ReturnExchangeReasons[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: reasonsState = {
  reasons: null,
  loading: true,
  error: false,
};

export const fetchReaonsAsync = createAsyncThunk(
  "reasons/getCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const products = await fetchReasons();
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const reasonSlice = createSlice({
  name: "reasons",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReaonsAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.reasons = action.payload;
    });
    builder.addCase(fetchReaonsAsync.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const selectReasonsEntity = (state: RootState) => state.reasons.reasons;
export const selectReasonsLoading = (state: RootState) => state.reasons.loading;

export default reasonSlice.reducer;
