import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  addToWishList,
  fetchWishlistItems,
  removeFromWishList,
} from "./wishlistApi";
import { ProductResponse } from "../Product/type";

export interface WishlistState {
  entity: ProductResponse | null;
  loading: boolean;
  error: any;
}

export interface Wishlist {
  productId: string;
  color: string;
}

const initialState: WishlistState = {
  entity: null,
  loading: true,
  error: {},
};

export const addWishlistAsync = createAsyncThunk(
  "wishlist/addWishlist",
  async (data: Wishlist, { rejectWithValue }) => {
    try {
      const products = await addToWishList(data);
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchWishlistAsync = createAsyncThunk<
  ProductResponse,
  string | undefined
>("wishlist/getWishlist", async (attribute, { rejectWithValue }) => {
  try {
    const products = await fetchWishlistItems(attribute || "");

    return products;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const removeWishlistAsync = createAsyncThunk(
  "wishlist/removeWishlist",
  async (data: Wishlist, { rejectWithValue }) => {
    try {
      const products = await removeFromWishList(data);
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWishlistAsync.fulfilled, (state, action) => {
      // if (!state.entity) {
      state.entity = action.payload; // ✅ First fetch: initialize state
      // }
      state.error = false;
      state.loading = false;
    });
    builder.addCase(addWishlistAsync.rejected, (state, action) => {
      // if (!state.entity) {
      // state.entity = action.payload; // ✅ First fetch: initialize state
      // }
      state.error = action.payload;
      // state.loading = false;
    });
  },
});

export const selectWishlistProducts = (state: RootState) =>
  state.wishlist.entity;

export default WishlistSlice.reducer;
