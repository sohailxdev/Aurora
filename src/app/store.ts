import {
  UnknownAction,
  combineReducers,
  configureStore,
  Reducer,
} from "@reduxjs/toolkit";
import { productSlice } from "./Product/productSlice";
import { attributeSlice } from "./attribute/attributeSlice";
import { CartSlice } from "./cart/cartSlice";
import { userSlice } from "./User/userSlice";
import { WishlistSlice } from "./wishList/wishlistSlice";
import { OrdersSlice } from "./orders/ordersSlice";
import { reasonSlice } from "./reasonMaster/reasonsMasterSlice";
import { collectionSlice } from "./collection/collectionSlice";
import { promoCodeSlice } from "./promoCode/promoSlice";

const reducers = {
  product: productSlice.reducer,
  attribute: attributeSlice.reducer,
  cart: CartSlice.reducer,
  user: userSlice.reducer,
  wishlist: WishlistSlice.reducer,
  order: OrdersSlice.reducer,
  collection: collectionSlice.reducer,
  reasons: reasonSlice.reducer,
  promoCode: promoCodeSlice.reducer,
};

const rootReducer = combineReducers(reducers);

export type RootState = ReturnType<typeof rootReducer>;

const resettableRootReducer: Reducer<RootState, UnknownAction> = (
  state,
  action
) => {
  if (action.type === "store/reset") {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer: resettableRootReducer,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
