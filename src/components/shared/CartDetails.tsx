import {
  addToCart,
  fetchCartAsync,
  removeCart,
  removeFromCart,
} from "@/app/cart/cartSlice";
import { CartProductDetails } from "@/app/cart/types";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { Circle, Dot, Heart, Minus, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Separator } from "../ui/separator";
import { openLoginModal } from "@/lib/utils";
import {
  addWishlistAsync,
  fetchWishlistAsync,
  removeWishlistAsync,
} from "@/app/wishList/wishlistSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { selectUser } from "@/app/User/userSlice";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Discount } from "@/app/Product/type";

export const calculateDiscountedPrice = (price: number, discount: Discount) => {
  if (!discount) return price;
  if (discount.valueType === "PERCENTAGE") {
    return Math.ceil(price - (price * discount.discountValue) / 100);
  } else if (discount.valueType === "AMOUNT") {
    return Math.ceil(price - discount.discountValue);
  }
  return price;
};

const CartDetails = ({
  cartProducts,
  desc,
  handleOpenCartSheet,
}: {
  cartProducts: CartProductDetails[] | null;
  desc: boolean;
  handleOpenCartSheet: Dispatch<SetStateAction<boolean>>;
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectUser);

  const [openPopovers, setOpenPopovers] = useState<{ [key: string]: boolean }>(
    {}
  );
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();

  const togglePopover = (productId: string, skuId: string, isOpen: boolean) => {
    const key = `${productId}-${skuId}`;
    setOpenPopovers((prev) => ({ ...prev, [key]: isOpen }));
  };

  const isPopoverOpen = (productId: string, skuId: string) => {
    const key = `${productId}-${skuId}`;
    return openPopovers[key] || false;
  };

  const handleRemoveFromCart = async (productId: string, skuId: string) => {
    dispatch(
      removeFromCart({
        productId: productId,
        skuId: skuId,
        quantity: 0,
      })
    );
    if (
      localStorage.getItem("cart") == null ||
      localStorage.getItem("cart") == "[]"
    ) {
      localStorage.removeItem("cart");
      dispatch(removeCart());
    } else {
      dispatch(
        fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]"))
      );
    }
  };

  const handleIncrease = (
    productId: string,
    skuId: string,
    quantity: string
  ) => {
    dispatch(
      addToCart({
        productId: productId,
        skuId: skuId,
        quantity: +1,
        sku_quantity: +quantity,
      })
    );
    dispatch(fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]")));
  };

  const handleDecrease = (
    productId: string,
    skuId: string,
    quantity: string
  ) => {
    if (+quantity < 1) return;
    dispatch(
      addToCart({
        productId: productId,
        skuId: skuId,
        quantity: -1,
        sku_quantity: +quantity,
      })
    );
    dispatch(fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]")));
  };

  const handleWishList = async (
    val: string,
    productId: string,
    color: string
  ) => {
    try {
      if (!token || token.length == 0) {
        handleOpenCartSheet(false);
        openLoginModal("/category");
      } else if (val == "add") {
        await dispatch(
          addWishlistAsync({
            productId,
            color,
          })
        ).unwrap();
        await dispatch(fetchWishlistAsync()).unwrap();
      } else {
        await dispatch(
          removeWishlistAsync({
            productId,
            color,
          })
        ).unwrap();
        await dispatch(fetchWishlistAsync()).unwrap();
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleCartCheckout = () => {
    const urlObject = new URL(window.location.href);
    urlObject.searchParams.set("source", "cart");
    try {
      const checkoutData = localStorage.getItem("cart") || "[]";

      if (JSON.parse(checkoutData).length === 0) {
        toast.info("Cart is empty", { duration: 1000 });
        return;
      }

      const urlObject = new URL(window.location.href);
      urlObject.searchParams.set("source", "cart");
      window.history.replaceState(null, "", urlObject.toString());

      if (isAuthenticated) {
        navigate("/user/checkout?source=cart");
        return;
      }

      openLoginModal("/user/checkout?source=cart");
    } catch (error) {
    } finally {
      handleOpenCartSheet(false);
    }
  };

  return (
    <div className="flex h-[93%] flex-col overflow-y-scroll bg-white shadow-xl">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mt-8">
          <div className="flow-root">
            <ul role="list" className="-my-6 divide-y divide-gray-200">
              {cartProducts && cartProducts.length > 0 ? (
                cartProducts.map((product, i) => {
                  const { name, product_id, attributes, description, sku_id } =
                    product;
                  const {
                    imgs,
                    sku,
                    price,
                    quantity,
                    cart_quantity,
                    size,
                    color,
                    discount,
                    title,
                    fit,
                  } = attributes?.find((a) => a.sku == sku_id) || ([] as any);

                  const discountedPrice = calculateDiscountedPrice(
                    price,
                    discount
                  );

                  return (
                    <div key={i}>
                      <li
                        className={`flex py-6 ${
                          quantity > 0 ? "opacity-100" : "opacity-60"
                        }`}
                      >
                        <div className="">
                          <img
                            onClick={() =>
                              navigate(
                                `/category/products/${product_id}/${sku}`
                              )
                            }
                            alt={imgs[0]?.img_name || "No Image"}
                            src={imgs[0]?.img_url}
                            className="object-cover rounded-md w-[33dvw] h-[20dvh] sm:w-[150px] sm:h-[150px] shadow cursor-pointer"
                          />
                        </div>
                        {desc && (
                          <div>
                            <p>{description}</p>
                          </div>
                        )}
                        <div className="ml-4 flex flex-col gap-5 w-full">
                          <div>
                            <div className="grid grid-cols-5 text-base font-medium text-gray-900">
                              <h3 className="col-span-4 flex flex-col">
                                {title || name} - {fit}
                              </h3>
                              <div className="flex justify-end">
                                <p className=" font-medium">
                                  ₹{+cart_quantity * +discountedPrice}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-end justify-between h-full text-sm">
                            <div className="flex flex-col items-start gap-2">
                              <div>
                                <div className="flex gap-3 items-center">
                                  <Circle
                                    className="h-4 w-4"
                                    fill={`#${color?.split("-")[1]}`}
                                  />
                                  <span className="py-1 px-2 bg-black text-white rounded-md">
                                    {size}
                                  </span>
                                </div>
                              </div>
                              {discount && (
                                <div className="flex items-center gap-2">
                                  <span className="line-through">₹{price}</span>
                                  <span>₹{discountedPrice}</span>
                                  <span className="text-green-500">
                                    {discount.valueType === "PERCENTAGE"
                                      ? `${discount.discountValue}% off`
                                      : `₹${discount.discountValue} off`}
                                  </span>
                                </div>
                              )}
                              {!discount && <span>₹{price}</span>}

                              {quantity != 0 ? (
                                <div className="flex items-center gap-2">
                                  {
                                    <>
                                      <Button
                                        onClick={() => {
                                          if (+cart_quantity > 1) {
                                            handleDecrease(
                                              product_id,
                                              sku,
                                              quantity
                                            );
                                          }
                                        }}
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        disabled={+cart_quantity <= 1}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <span>{cart_quantity}</span>
                                    </>
                                  }
                                  {cart_quantity <= quantity ? (
                                    <Button
                                      onClick={() => {
                                        handleIncrease(
                                          product_id,
                                          sku,
                                          quantity
                                        );
                                      }}
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      disabled={+quantity <= +cart_quantity}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  ) : cart_quantity > quantity ? (
                                    <span className="text-xs text-destructive font-medium">
                                      Available Qty. {quantity}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              ) : (
                                <span className="text-destructive font-medium ">
                                  Out of stock
                                </span>
                              )}
                            </div>

                            <div className="flex">
                              <Popover
                                open={isPopoverOpen(product_id, sku)}
                                onOpenChange={(isOpen) =>
                                  togglePopover(product_id, sku, isOpen)
                                }
                              >
                                <PopoverTrigger>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      togglePopover(product_id, sku, true);
                                    }}
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                  >
                                    Remove
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent className="mr-5 bg-white rounded shadow z-10 border p-2 flex gap-2 justify-between">
                                  <button
                                    className="flex items-center flex-row gap-1"
                                    onClick={async () => {
                                      try {
                                        await handleWishList(
                                          "add",
                                          product_id,
                                          color
                                        );
                                        await handleRemoveFromCart(
                                          product_id,
                                          sku
                                        );
                                        togglePopover(product_id, sku, false);
                                      } catch (error) {
                                        toast.error("Something went wrong.");
                                      }
                                    }}
                                  >
                                    <Heart className="h-4 w-4" />
                                    <span>Move to wishlist</span>
                                  </button>
                                  <Separator
                                    orientation="vertical"
                                    className="h-5 bg-black"
                                  />
                                  <button
                                    onClick={async () => {
                                      dispatch(
                                        addToCart({
                                          productId: product_id,
                                          skuId: sku,
                                          quantity: 1,
                                          sku_quantity: +quantity,
                                        })
                                      );
                                      await dispatch(
                                        fetchCartAsync(
                                          JSON.parse(
                                            localStorage.getItem("cart") || ""
                                          )
                                        )
                                      );
                                      handleRemoveFromCart(product_id, sku);
                                      togglePopover(product_id, sku, false);
                                    }}
                                  >
                                    Delete
                                  </button>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          {+quantity == +cart_quantity && +quantity != 0 && (
                            <p className="text-destructive text-sm font-medium">
                              Can't add more!
                            </p>
                          )}
                        </div>
                      </li>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <DotLottieReact
                    className="w-60 mx-auto my-auto h-60"
                    src="/bnjWHaOEjk.lottie"
                    loop
                    autoplay
                  />
                  <p className="text-xl font-bold">No items in cart</p>
                  <p className="text-balance text-gray-500">
                    Add some items to your cart
                  </p>
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div className="">
          <Button
            onClick={handleCartCheckout}
            className="flex w-full items-center justify-center rounded-md border border-transparent px-6 py-3 h-10 text-base font-medium text-white shadow-xs"
          >
            Checkout <Dot /> ₹
            {cartProducts
              ? cartProducts
                  .filter(
                    (d) =>
                      +d.attributes.find((a) => a.sku == d.sku_id)?.quantity > 0
                  )
                  ?.map(
                    (d) =>
                      +d.attributes.map(
                        (a) =>
                          +calculateDiscountedPrice(+a.price, a.discount) *
                          +a.cart_quantity
                      )
                  )
                  ?.reduce((acc, num) => acc + num, 0) || 0
              : 0}
          </Button>
        </div>
        <p className="text-gray-400 text-center mt-2 mb-4">
          Shipping and taxes calculated at checkout
        </p>
      </div>
    </div>
  );
};

export default CartDetails;
