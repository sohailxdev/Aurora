import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { attributeType } from "./type";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";

export interface attributestate {
  entity: attributeType[] | null;
  loading: boolean;
  error: boolean;
}

const initialState: attributestate = {
  entity: null,
  loading: true,
  error: false,
};

export const fetchAttributeAsync = createAsyncThunk(
  "attribute/getattribute",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        BASE_URL + "/api/getKeyValueByGroupCompanyId?groupCompanyId=6"
      );
      return res.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    // addAttribute: (state, action) => {
    //   state.attribute = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributeAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.entity = action.payload;
        state.error = false;
      })
      .addCase(fetchAttributeAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const selectAttributeData = (state: RootState) => state.attribute.entity;
export const selectAttributeLoading = (state: RootState) =>
  state.attribute.loading;
export const selectAttributeError = (state: RootState) => state.attribute.error;

export default attributeSlice.reducer;
