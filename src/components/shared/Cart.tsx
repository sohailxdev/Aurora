import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { fetchCartAsync, selectCartProducts } from "@/app/cart/cartSlice";
import { ShoppingBag } from "lucide-react";
import CartDetails from "./CartDetails";
import { useEffect, useState } from "react";

const Cart = () => {
  const cartProducts = useAppSelector(selectCartProducts);
  const [openCartSheet, setOpenCartSheet] = useState<boolean>(false);

  const data = (() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch (e) {
      console.error("Error parsing cart data from localStorage", e);
      return [];
    }
  })();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!cartProducts && data.length != 0) {
      dispatch(fetchCartAsync(data));
    }
  }, [cartProducts, dispatch]);

  return (
    <Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
      <SheetTrigger
        asChild
        onClick={() => {
          setOpenCartSheet(true);
        }}
      >
        <div className="relative flex items-center hover:text-gray-600 cursor-pointer">
          <ShoppingBag className="" />
          <span className="text-xs h-5 w-5 items-center justify-center text-center flex absolute bottom-3 left-3 bg-[#f0e7d7] text-black font-medium p-1 rounded-full">
            {cartProducts?.length || 0}
          </span>
        </div>
      </SheetTrigger>
      <SheetContent className="w-full overflow-auto max-w-sm p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 h-[7%]">
          <div className="flex items-center justify-center h-full">
            <SheetTitle>Cart</SheetTitle>
          </div>
        </SheetHeader>
        <CartDetails
          cartProducts={cartProducts}
          desc={false}
          handleOpenCartSheet={setOpenCartSheet}
        />
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
