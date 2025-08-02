import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
// import { CartItems } from "./types";
import { fetchCartItems } from "./cartApi";
import { CartProductDetails } from "./types";

export interface cartState {
  product: CartProductDetails[] | null;
}

export interface AddToCartI {
  productId: string;
  skuId: string;
  quantity: string;
  sku_quantity: string;
}

const initialState: cartState = {
  product: null,
};

const saveToLocalStorage = async (products: AddToCartI[]) => {
  try {
    localStorage.setItem("cart", JSON.stringify(products));
    // sessionStorage.setItem("checkoutProduct", JSON.stringify(products));
    // thunkAPI.dispatch(fetchCartAsync(products));
  } catch (error) {}
};

const getFromLocalStorage = (): AddToCartI[] => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const fetchCartAsync = createAsyncThunk(
  "cart/getCartItems",
  async (data: AddToCartI[], { rejectWithValue }) => {
    try {
      const products = await fetchCartItems(data);
      return products;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (_, action) => {
      const { productId, skuId, quantity, sku_quantity } = action.payload;
      const products = getFromLocalStorage();
      const existingProduct = products.length>0 && products.find(
        (item) => item.productId == productId && item.skuId == skuId
      );
      if (existingProduct) {
        if (existingProduct.sku_quantity > quantity) {
          existingProduct.quantity =
            existingProduct.quantity && +existingProduct.quantity + quantity;
          existingProduct.sku_quantity = sku_quantity;
        }
      } else {
        products.push(action.payload);
      }
      saveToLocalStorage(products);
    },
    removeFromCart: (_, action) => {
      const { productId, skuId } = action.payload;
      let products = getFromLocalStorage();
      const updatedProducts = products.filter(
        (item) =>
          !(item.productId == productId && `${item.skuId}` == `${skuId}`)
      );
      saveToLocalStorage(updatedProducts);

      // state.product = products;
    },
    removeCart: (state) => {
      state.product = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartAsync.fulfilled, (state, action) => {
      state.product = action.payload;
    });
  },
});

export const { addToCart, removeFromCart, removeCart } = CartSlice.actions;

export const selectCartProducts = (state: RootState) => state.cart.product;

export default CartSlice.reducer;
