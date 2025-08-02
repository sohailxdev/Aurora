import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchOrders } from "./ordersAPI";
import { Order, OrderResponse } from "./types";

export interface OrderSlice {
  entity: OrderResponse | null;
  loading: boolean;
  error: any;
}

export interface Wishlist {
  productId: string;
}

const initialState: OrderSlice = {
  entity: null,
  loading: true,
  error: {},
};

export const fetchOrdersAsync = createAsyncThunk(
  "order/fetchOrder",
  async (page: number, { rejectWithValue }) => {
    try {
      const products = await fetchOrders(page || 0);
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const OrdersSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrdersAsync.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(fetchOrdersAsync.fulfilled, (state, action) => {
      if (!state.entity) {
        state.entity = action.payload; // first fetch
      } else {
        const existingOrders = state.entity.content ?? [];

        const updatedOrders = action.payload.content.map((newOrder:Order) => {
          const existingOrderIndex = existingOrders.findIndex(
            (o) => o.orderId === newOrder.orderId
          );

          if (existingOrderIndex !== -1) {
            // Merge returns for matching orderId
            const updatedItems = newOrder.items.map((newItem) => {
              const existingItem = existingOrders[
                existingOrderIndex
              ].items.find((item) => item.productId === newItem.productId);
              if (existingItem) {
                // replace returns, keep other fields same
                return { ...existingItem, returns: newItem.returns };
              }
              return newItem; // new product in existing order
            });

            // update the order in place
            return {
              ...existingOrders[existingOrderIndex],
              items: updatedItems,
            };
          } else {
            // New order not present before, add it
            return newOrder;
          }
        });

        // Combine updated orders and orders not in the payload
        const mergedOrders = [
          ...existingOrders.filter(
            (o) => !action.payload.content.find((n:Order) => n.orderId === o.orderId)
          ),
          ...updatedOrders,
        ];

        state.entity = {
          ...state.entity,
          content: mergedOrders,
          last: action.payload.last,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          numberOfElements: action.payload.numberOfElements,
          pageable: action.payload.pageable,
        };
      }

      state.error = false;
      state.loading = false;
    });
    builder.addCase(fetchOrdersAsync.rejected, (state) => {
      state.loading = false;
      state.error = true;
    });
  },
});

export const selectOrdersProducts = (state: RootState) => state.order.entity;
export const selectOrdersLoading = (state: RootState) => state.order.loading;

export default OrdersSlice.reducer;
