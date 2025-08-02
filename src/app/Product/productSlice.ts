import { RootState } from "@/app/store";
import { ProductResponse } from "./type";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface productState {
  entity: ProductResponse | null;
  loading: boolean;
  error: boolean;
}

const initialState: productState = {
  entity: null,
  loading: false,
  error: false,
};

const fetchProduct = async (attribute: string) => {
  try {
    const res = await axios.get(
      attribute
        ? `${BASE_URL}/api/products/6${attribute}`
        : `${BASE_URL}/api/products/6`
    );
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};

export const fetchProductAsync = createAsyncThunk<
  ProductResponse,
  string | undefined
>("product/getProduct", async (attribute) => {
  const res = await fetchProduct(attribute || "");
  return res;
});

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    sortedProduct: (state, action) => {
      state.entity = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductAsync.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProductAsync.fulfilled, (state, action) => {
        if (!state.entity) {
          state.entity = action.payload; // ✅ First fetch: initialize state
        } else {
          state.entity = {
            ...state.entity,
            content: [
              ...(state.entity.content || []),
              ...action.payload.content.filter((item) => {
                return !state.entity?.content?.some(
                  (i) =>
                    i.attributes[0].sku === item.attributes[0].sku &&
                    i.productId === item.productId &&
                    i.defaultSku === item.defaultSku
                );
              }),
            ], // ✅ Append correctly
            last: action.payload.last, // ✅ Update last page indicator
            totalPages: action.payload.totalPages, // ✅ Keep other meta properties updated
            totalElements: action.payload.totalElements,
            numberOfElements: action.payload.numberOfElements,
            pageable: action.payload.pageable,
          };
        }

        state.error = false;
        state.loading = false;
      })

      .addCase(fetchProductAsync.rejected, (state) => {
        state.error = true;
        state.loading = false;
      });
  },
});

export const { sortedProduct } = productSlice.actions;

export const selectProductEntity = (state: RootState) => state.product.entity;
export const selectProductError = (state: RootState) => state.product.error;
export const selectProductLoading = (state: RootState) => state.product.loading;

export default productSlice.reducer;
