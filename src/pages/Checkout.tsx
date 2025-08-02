"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Check, Circle, Minus, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";

import axios from "axios";
import { BASE_URL, RAZORPAY_KEY } from "@/lib/constant";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getUserDetails, selectUser } from "@/app/User/userSlice";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  addToCart,
  fetchCartAsync,
  removeCart,
  removeFromCart,
  selectCartProducts,
} from "@/app/cart/cartSlice";
import { TextLoader } from "@/components/Custom/TextLoader";
import type { ProductType } from "@/app/Product/type";
import { Link } from "react-router-dom";
import { calculateDiscountedPrice } from "@/lib/utils";
import type { PromoCode } from "@/app/promoCode/type";
import AddressSelector from "@/components/Custom/AddressSelector";
import UserInfoForm from "@/components/Custom/UserInfoForm";
import OrderReview from "@/components/Custom/OrderReview";
import CartSummary from "@/components/Custom/CartSummary";
import InsufficientQuantityModal, {
  type InsufficientProduct,
} from "@/components/Custom/InsufficientQuantityModal";
import {
  applyPromoCode,
  clearPromoCode,
  fetchPromoCodes,
  selectDiscountedProducts,
  selectPromoCodes,
  selectPromoDiscount,
  selectSelectedPromo,
  validatePromoWithOffers,
} from "@/app/promoCode/promoSlice";
import { fetchCartItems } from "@/app/cart/cartApi";
import { fetchOrdersAsync } from "@/app/orders/ordersSlice";
import { getTotalOfferSavings, getTotalFreeItems } from "@/app/cart/cartApi";
import OfferSummary from "@/components/Custom/OfferSummary";

export interface FinalOrderData {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  order_amount?: number;
  amount?: number;
  currency?: string;
  name?: string;
  email?: string;
  number?: string;
  local_address?: string;
  items: {
    productId: number;
    quantity: number;
    price: number;
    sku: string;
  }[];
  city: string;
  country: string;
  state: string;
  landmark?: string | null;
  localAddress?: string;
  district: string;
  pincode: string;
  promoCode?: {
    id: number;
    name: string;
    discount: number;
  };
}

const addressSchema = z.object({
  id: z.string().optional(),
  addressName: z.string().min(1, "Address name is required"),
  local_address: z.string().min(1, "Local address is required"),
  landmark: z.string().optional(),
  district: z.string().min(1, "District is required"),
  pincode: z.string().min(1, "Pincode is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

// User Info Schema
const formSchema = z.object({
  firstname: z.string().min(2, "First name is required"),
  lastname: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  number: z.string().min(10, "Phone number is required"),
});

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [orderData, setOrderData] = useState<FinalOrderData>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [selectAddress, setSelectAddress] =
    useState<z.infer<typeof addressSchema>>();

  const [openInsufficientQuantityModal, setOpenInsufficientQuantityModal] =
    useState(false);
  const [insufficientProducts, setInsufficientProducts] = useState<
    InsufficientProduct[]
  >([]);
  const [isPlaceOrderLoading, setIsPlaceOrderLoading] = useState(false);

  // Get promo code state from Redux
  const promoCodes = useAppSelector(selectPromoCodes);
  const selectedPromo = useAppSelector(selectSelectedPromo);
  const promoDiscount = useAppSelector(selectPromoDiscount);
  const discountedProducts = useAppSelector(selectDiscountedProducts);

  // Add this at the top of your component
  const lastAppliedProductsRef = useRef("");
  const lastOfferStateRef = useRef("");
  const applyingPromoRef = useRef(false);

  // Fetch promo codes on component mount
  useEffect(() => {
    !promoCodes && dispatch(fetchPromoCodes());
  }, [dispatch, promoCodes]);

  useEffect(() => {
    dispatch(clearPromoCode());
  }, []);

  // Update products when discounted products change
  useEffect(() => {
    if ((discountedProducts?.length ?? 0) > 0) {
      // Map the discounted products back to the original products array
      // while preserving the original products that don't have promo discounts
      const updatedProducts = products.map((product) => {
        const discountedProduct = discountedProducts?.find(
          (dp) => dp.sku === product.sku
        );
        return discountedProduct || product;
      });

      setProducts(updatedProducts);
    }
  }, [discountedProducts]);

  // New effect to validate promo when offers change
  useEffect(() => {
    if (selectedPromo && products.length > 0) {
      // Create a signature of current offer state
      const currentOfferState = JSON.stringify(
        products.map((p) => ({
          sku: p.sku,
          hasOffer: p.offer_result?.hasOfferDiscount,
          freeQuantity: p.offer_result?.freeQuantity || 0,
          remainingQuantity: p.offer_result?.remainingQuantity || 0,
        }))
      );

      // Only validate if offer state has changed
      if (currentOfferState !== lastOfferStateRef.current) {
        dispatch(
          validatePromoWithOffers({
            products,
            currentPromo: selectedPromo,
            currentPromoDiscount: promoDiscount || 0,
          })
        );
        lastOfferStateRef.current = currentOfferState;
      }
    }
  }, [products, selectedPromo, promoDiscount, dispatch]);

  const address = useAppSelector(selectUser);

  const { error, Razorpay } = useRazorpay();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      number: "",
    },
  });

  const updateUser = async (details: any) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/updateDetails`, details);
      if (res.status === 200) {
        //* Do nothing or fetch userdata again to store the latest data in redux store
      }
    } catch (error) {
      toast.error("Failed to process checkout");
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const response = await dispatch(getUserDetails());

      if (response.meta.requestStatus === "rejected") {
        toast.error("Failed to fetch your profile information");
      }

      const data = response.payload;

      if (data) {
        form.reset({
          firstname: data?.firstname,
          lastname: data.lastname,
          email: data.email,
          number: data.number,
        });
      }
    };
    loadUserData();
  }, [dispatch, form]);

  if (error) {
    toast.error("Failed to load Razorpay");
  }

  // ✅ UPDATED: Calculate order summary with proper promo discount application
  const summary = {
    subtotal:
      products
        .filter((d) => +d.quantity > 0)
        ?.map((d) => {
          // Check if product has offer discount
          const offerResult = d.offer_result;
          if (offerResult?.hasOfferDiscount) {
            return offerResult.discountedPrice;
          }
          // If product has offer object but no free items, use original price
          if (d.offer && offerResult) {
            return d.price * d.quantity;
          }
          // Otherwise use regular discount calculation (only if no offer object)
          if (!d.offer) {
            return calculateDiscountedPrice(+d.price, d.discount) * +d.quantity;
          }
          // Default to original price
          return d.price * d.quantity;
        })
        ?.reduce((acc, num) => acc + num, 0) || 0,
    shipping: 0,
    tax: 0,
    get total() {
      // ✅ NEW CHANGE: Apply promo discount to the final total
      const baseTotal = this.subtotal + this.shipping + this.tax;
      return Math.max(0, baseTotal - (promoDiscount || 0));
    },
    // ✅ NEW CHANGE: Add separate getter for total before promo discount
    get totalBeforePromo() {
      return this.subtotal + this.shipping + this.tax;
    },
  };

  // Product handlers
  const handleQuantityChange = (
    productId: string,
    skuId: string,
    oldQty: number,
    newQty: number,
    availableQty: number
  ) => {
    const diff = newQty - oldQty;
    if (diff === 0) return;

    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get("source");

    if (source === "direct") {
      const sessionData = JSON.parse(
        sessionStorage.getItem("checkoutProduct") || "[]"
      );

      const updatedSessionData = sessionData.map((item: any) => {
        if (item.productId === productId && item.skuId === skuId) {
          return {
            ...item,
            quantity: newQty, // <-- update with the new quantity
          };
        }
        return item;
      });

      sessionStorage.setItem(
        "checkoutProduct",
        JSON.stringify(updatedSessionData)
      );
    } else {
      dispatch(
        addToCart({
          productId,
          skuId,
          quantity: diff,
          sku_quantity: availableQty,
        })
      );
    }
    dispatch(fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]")));
  };

  const handleRemoveItem = (sku: string) => {
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
    //* Also remove from localStorage
    const storedProduct = localStorage.getItem("cart");
    if (!storedProduct) return;

    const parsedProducts = JSON.parse(storedProduct);
    const updatedProducts = parsedProducts.filter(
      (product: any) => product.skuId !== sku
    );

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
        sessionStorage.removeItem("checkoutProduct");
        dispatch(removeCart());
      } else {
        dispatch(
          fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]"))
        );
      }
    };

    const parsedCartData = JSON.parse(storedProduct);
    const itemToRemove = parsedCartData.find((item: any) => item.skuId === sku);
    handleRemoveFromCart(itemToRemove?.productId, itemToRemove?.skuId);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  //* Function to submit form data and directly proceed to online payment
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // ✅ UPDATED: Use the correct total that includes promo discount
    const total = Math.round(summary.total * 100);

    const initialOrderData: FinalOrderData = {
      amount: total,
      currency: "INR",
      name: `${data.firstname} ${data.lastname}`,
      email: data.email,
      number: data.number,
      items: products?.map((product) => {
        // Calculate the new price after discounts and promo codes
        let newPrice = product.price;

        // Check if product has offer discount first
        const offerResult = product.offer_result;
        if (offerResult?.hasOfferDiscount) {
          newPrice = offerResult.discountedPrice / product.quantity;
        } else if (product.offer && offerResult) {
          // Has offer object but no free items - use original price
          newPrice = product.price;
        } else {
          // Apply regular discount if present (only if no offer object)
          if (!product.offer && product.discount) {
            if (product.discount.valueType === "PERCENTAGE") {
              newPrice =
                product.price -
                (product.price * product.discount.discountValue) / 100;
            } else {
              newPrice = product.price - product.discount.discountValue;
            }
          }

          // Apply promo discount if present (only for eligible items)
          if (product.promoDiscount) {
            newPrice =
              product.promoDiscount.discountedPrice /
              (product.promoDiscount.eligibleQuantity || product.quantity);
          }
        }

        return {
          productId: Number(product.id),
          quantity: product.quantity,
          sku: product.sku,
          price: Math.round(newPrice), // Send the calculated price to the API
        };
      }),
      city: selectAddress?.city || "",
      country: selectAddress?.country || "",
      state: selectAddress?.state || "",
      district: selectAddress?.district || "",
      pincode: selectAddress?.pincode || "",
      localAddress: selectAddress?.local_address || "",
      landmark: selectAddress?.landmark || null,
      promoCode: selectedPromo
        ? {
            id: Number(selectedPromo.id),
            name: selectedPromo.promoName,
            discount: promoDiscount,
          }
        : undefined,
    };

    setOrderData(initialOrderData);

    // Check quantity before proceeding to payment
    try {
      const quantityResponse = await axios.post(
        `${BASE_URL}/api/products/check-quantity`,
        initialOrderData.items
      );

      if (quantityResponse.status === 200) {
        const insufficientItems = quantityResponse.data.filter(
          (item: any) => item.availableQuantity < item.requestedQuantity
        );

        if (insufficientItems.length > 0) {
          // Prepare data for the modal
          const insufficientProductsData = insufficientItems?.map(
            (item: any) => {
              const productDetails = products.find((p) => p.sku === item.sku);
              return {
                ...item,
                name: productDetails?.name || "",
                image: productDetails?.image || "/placeholder.svg",
                price: productDetails?.price || 0,
                requestedQuantity: productDetails?.quantity || 0,
              };
            }
          );

          setInsufficientProducts(insufficientProductsData);
          setOpenInsufficientQuantityModal(true);
        } else {
          // All quantities are sufficient, proceed directly with online payment
          handleOnlinePayment(initialOrderData);
        }
      }
    } catch (error) {
      console.error("Error checking product quantities:", error);
      toast.error("Failed to check product availability");
    }
  };

  //* Function to handle online payment with Razorpay
  const handleOnlinePayment = async (orderData: FinalOrderData) => {
    try {
      //* 1. Create Razorpay order
      const response = await axios.post(
        `${BASE_URL}/api/payment/create`,
        orderData
      );

      const { id: orderId } = response.data;

      if (!orderId) {
        throw new Error("Failed to create order Id");
      }

      //* 2. Initialize Razorpay
      const razorpayOptions: RazorpayOrderOptions = {
        key: RAZORPAY_KEY,
        amount: orderData?.amount ?? 1,
        currency: "INR",
        name: "House Of Valor",
        description: "Transaction for Products",
        image: "/LOGO.png",
        order_id: orderId,
        handler: async (response) => {
          //* 3. Make Order Data With Payment Details
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            paymentMethod: "ONLINE",
            paymentStatus: "SUCCESSFUL",
            order_amount: orderData.amount
              ? Math.round(orderData.amount) / 100
              : 1,
            items: orderData?.items?.map(({ productId, ...rest }) => ({
              productId: productId,
              ...rest,
            })),
            city: orderData.city,
            country: orderData.country,
            state: orderData.state,
            landmark: orderData.landmark,
            localAddress: selectAddress?.local_address || "",
            district: orderData.district,
            pincode: orderData.pincode,
            promoCode: orderData.promoCode,
          };

          await placeOrder(verificationData);
        },

        prefill: {
          name: orderData?.name,
          email: orderData?.email,
          contact: orderData?.number,
        },
        theme: {
          color: "#777047",
        },
      };

      //* 4. Initialize Razorpay instance
      const razorpayInstance = new Razorpay(razorpayOptions);
      razorpayInstance.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        toast.error(response.error.description || "Payment failed");
      });

      //* 5. Open Razorpay
      razorpayInstance.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout");
    }
  };

  //* Function to place order after a successful payment
  const placeOrder = async (finalOrderData: FinalOrderData) => {
    if (sessionStorage.getItem("orderData")) {
      sessionStorage.removeItem("orderData");
    }
    setIsPlaceOrderLoading(true);
    try {
      const orderResponse = await axios.post(
        `${BASE_URL}/api/orders/place`,
        finalOrderData
      );

      if (orderResponse.status === 200) {
        toast.success("Order placed successfully!", {
          duration: 1000,
          position: "top-center",
        });

        sessionStorage.setItem("orderData", JSON.stringify(orderResponse.data));
        // Clear cart from localStorage
        localStorage.removeItem("cart");
        sessionStorage.removeItem("checkoutProduct");
        dispatch(removeCart());
        dispatch(fetchOrdersAsync(0));
        navigate("/user/placed");
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      console.error("Error while placing order:", error);
      toast.error("Failed to place order");
      sessionStorage.setItem("orderData", JSON.stringify(finalOrderData));
      navigate("/user/failed");
    } finally {
      setIsPlaceOrderLoading(false);
    }
  };

  const applyPromo = async (promoCode: PromoCode | null) => {
    try {
      if (!promoCode) {
        return;
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      toast.error("Failed to apply promo code");
    }
  };

  // Update this useEffect to prevent infinite re-renders
  useEffect(() => {
    const handlePromoApplication = async () => {
      if (selectedPromo && products.length > 0 && !applyingPromoRef.current) {
        applyingPromoRef.current = true;

        // Calculate subtotal directly here instead of using summary dependency
        const currentSubtotal =
          products
            .filter((d) => +d.quantity > 0)
            ?.map((d) => {
              const offerResult = d.offer_result;
              if (offerResult?.hasOfferDiscount) {
                return offerResult.discountedPrice;
              }
              if (d.offer && offerResult) {
                return d.price * d.quantity;
              }
              if (!d.offer) {
                return (
                  calculateDiscountedPrice(+d.price, d.discount) * +d.quantity
                );
              }
              return d.price * d.quantity;
            })
            ?.reduce((acc, num) => acc + num, 0) || 0;

        const currentProductsKey = JSON.stringify(
          products.map((p) => ({
            id: p.id,
            sku: p.sku,
            quantity: p.quantity.toString(),
            price: p.price,
          }))
        );

        // Only re-apply if products have actually changed
        if (currentProductsKey !== lastAppliedProductsRef.current) {
          dispatch(
            applyPromoCode({
              promoCode: selectedPromo,
              products,
              subtotal: currentSubtotal,
            })
          );
          lastAppliedProductsRef.current = currentProductsKey;
        }
        applyingPromoRef.current = false;
      }
    };

    handlePromoApplication();
  }, [products, selectedPromo, dispatch]);

  const cartProducts = useAppSelector(selectCartProducts);

  const urlParams = new URLSearchParams(window.location.search);
  const source = urlParams.get("source");

  useEffect(() => {
    if (source === "direct") {
      const sessionData = JSON.parse(
        sessionStorage.getItem("checkoutProduct") || "[]"
      );

      if (sessionData.length === 0) {
        setIsProductsLoading(false);
        return;
      }

      const cartData = sessionData.map((item: any) => ({
        productId: item.productId,
        skuId: item.skuId,
        quantity: item.quantity.toString(),
      }));

      fetchCartItems(cartData, "direct")
        .then((fetchedProducts) => {
          const mappedProducts = fetchedProducts.map((item: any) => {
            const storedItem = sessionData.find(
              (p: any) => p.skuId === item?.attributes[0]?.sku
            );
            return {
              id: item?.product_id,
              name: item?.attributes[0]?.title || item?.name,
              price: item?.attributes[0]?.price,
              quantity: Number.parseInt(storedItem?.quantity),
              sku_quantity: Number.parseInt(storedItem?.sku_quantity),
              image:
                item?.attributes[0]?.imgs[0]?.img_url || "/placeholder.svg",
              sku: item?.attributes[0]?.sku,
              size: item?.attributes[0]?.size,
              fit: item?.attributes[0]?.fit,
              color: item?.attributes[0]?.color,
              discount: item?.attributes[0]?.discount,
              offer: item?.attributes[0]?.offer,
              offer_result: item?.attributes[0]?.offer_result,
              is_offer_eligible: item?.attributes[0]?.is_offer_eligible,
              has_offer_applied: item?.attributes[0]?.has_offer_applied,
            };
          });
          setProducts(mappedProducts || []);
          setIsProductsLoading(false);
        })
        .catch((error) => {
          toast.error("Failed to fetch product details.");
          setIsProductsLoading(false);
        });
    } else {
      // Handling regular cart logic when source is not "direct"
      if (!cartProducts) {
        setIsProductsLoading(false);
        return;
      }

      const mergedProducts = cartProducts.map((item) => {
        const storedItem = JSON.parse(
          localStorage.getItem("cart") || "[]"
        ).find((p: any) => p.skuId === item?.attributes[0]?.sku);

        return {
          id: item?.product_id,
          name: item?.attributes[0]?.title || item?.name,
          price: item?.attributes[0]?.price,
          quantity: Number.parseInt(storedItem?.quantity),
          sku_quantity: Number.parseInt(storedItem?.sku_quantity),
          image: item?.attributes[0]?.imgs[0]?.img_url || "/placeholder.svg",
          sku: item?.attributes[0]?.sku,
          fit: item?.attributes[0]?.fit,
          size: item?.attributes[0]?.size,
          color: item?.attributes[0]?.color,
          discount: item?.attributes[0]?.discount,
          offer: item?.attributes[0]?.offer,
          offer_result: item?.attributes[0]?.offer_result,
          is_offer_eligible: item?.attributes[0]?.is_offer_eligible,
          has_offer_applied: item?.attributes[0]?.has_offer_applied,
        };
      });

      setProducts(mergedProducts || []);
      setIsProductsLoading(false);
    }
  }, [cartProducts, source]);

  const renderCheckoutStep = () => {
    switch (checkoutStep) {
      case 0:
        return (
          <AddressSelector
            addresses={address?.user?.addresses || []}
            selectedAddress={selectAddress}
            setSelectedAddress={setSelectAddress}
            onNext={() => setCheckoutStep(1)}
            onBack={() => {
              setStep(0);
              form.reset();
            }}
          />
        );
      case 1:
        return (
          <UserInfoForm
            form={form}
            onBack={() => setCheckoutStep(0)}
            onNext={async () => {
              const isValid = await form.trigger([
                "firstname",
                "lastname",
                "email",
                "number",
              ]);

              if (isValid) {
                try {
                  await updateUser(form.getValues());
                  setCheckoutStep(2);
                } catch (error) {
                  console.error("Failed to update user:", error);
                }
              }
            }}
          />
        );
      case 2:
        return (
          <OrderReview
            products={
              (discountedProducts?.length ?? 0) > 0
                ? discountedProducts
                : products
            }
            userInfo={form.getValues()}
            address={selectAddress}
            summary={summary}
            onBack={() => setCheckoutStep(1)}
            onSubmit={form.handleSubmit(onSubmit)}
            placeOrderLoading={isPlaceOrderLoading}
          />
        );
    }
  };

  return (
    <div className="container max-w-7xl mt-4 mx-auto py-8 px-4">
      {/* Checkout Steps */}
      <div className="mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          {products.length > 0 &&
            ["Cart", "Checkout"].map((_, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors duration-300 ${
                    step >= index
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted text-muted-foreground"
                  }`}
                >
                  {step > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index < 1 && (
                  <div
                    className={`h-px w-20 mx-2 transition-colors duration-300 ${
                      step > index ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="cart"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`grid ${
              products.length > 0 ? "lg:grid-cols-3" : "lg:grid-cols-1"
            }  gap-8`}
          >
            {products.length > 0 ? (
              <>
                <div className="lg:col-span-2 space-y-6">
                  {/* Offer Summary Banner */}

                  {/* Product List */}
                  {products?.map((product, i) => {
                    const offerResult = product.offer_result;
                    const hasOfferDiscount = offerResult?.hasOfferDiscount;
                    const hasOfferObject =
                      product.offer && product.offer.status;

                    return (
                      <div
                        key={i}
                        className="flex border gap-4 p-2 rounded-md relative"
                      >
                        {/* Free item indicator */}
                        {hasOfferDiscount && offerResult.freeQuantity > 0 && (
                          <div className="absolute -top-2 -right-2 z-10">
                            <Badge className="bg-orange-500 text-white shadow-lg">
                              {offerResult.freeQuantity} FREE
                            </Badge>
                          </div>
                        )}

                        <div className="relative w-24 h-34 sm:w-28 sm:h-28 flex">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain "
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-medium capitalize">
                            {product.name}-{product.fit}
                            <small> {product.quantity}x</small>
                          </h3>
                          <div className="flex flex-row gap-4 p-1">
                            <Circle
                              className="text-gray-50 border rounded-full"
                              fill={`#${product?.color?.split("-")[1]}`}
                            />
                            <Badge className="min-w-10">
                              <p className="w-fit mx-auto">{product.size}</p>
                            </Badge>
                          </div>

                          {/* Offer and discount badges */}
                          <div className="flex flex-wrap gap-2">
                            {product.offer && (
                              <Badge
                                variant="secondary"
                                className="bg-green-50 shadow-sm border-green-200 text-green-700 hover:bg-green-100"
                              >
                                {product.offer.name}
                              </Badge>
                            )}

                            {hasOfferDiscount &&
                              offerResult.freeQuantity > 0 && (
                                <Badge
                                  variant="secondary"
                                  className="bg-orange-50 shadow-sm border-orange-200 text-orange-700"
                                >
                                  {offerResult.freeQuantity} item
                                  {offerResult.freeQuantity !== 1
                                    ? "s"
                                    : ""}{" "}
                                  free
                                </Badge>
                              )}

                            {/* Only show discount badge if no offer object exists */}
                            {product.discount && !hasOfferObject && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 shadow-sm border-blue-200 text-blue-700"
                              >
                                {product.discount.valueType === "PERCENTAGE"
                                  ? `${product.discount.discountValue}% off`
                                  : `₹${product.discount.discountValue} off`}
                              </Badge>
                            )}

                            {selectedPromo && product.promoDiscount && (
                              <Badge
                                variant="secondary"
                                className="bg-purple-50 shadow-sm border-purple-200 text-purple-700"
                              >
                                Promo Applied
                              </Badge>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.sku,
                                    product.quantity,
                                    product.quantity - 1,
                                    product.sku_quantity
                                  )
                                }
                                disabled={product?.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {product.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={
                                  product?.sku_quantity <= product.quantity
                                }
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    product.sku,
                                    product.quantity,
                                    product.quantity + 1,
                                    product.sku_quantity
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                          <div className="text-right">
                            {(() => {
                              const offerResult = product.offer_result;
                              const hasOfferDiscount =
                                offerResult?.hasOfferDiscount;
                              const hasOfferObject =
                                product.offer && product.offer.status;
                              const hasPromoDiscount =
                                selectedPromo && product.promoDiscount;

                              // ✅ NEW LOGIC: Simplified pricing display for better UX
                              if (hasPromoDiscount) {
                                // When promo is applied, show original price vs final promo price (no double strikes)
                                const originalPrice = hasOfferDiscount
                                  ? offerResult.originalPrice
                                  : product.price * product.quantity;

                                return (
                                  <>
                                    <p className="font-medium text-gray-500 line-through">
                                      ₹{Math.round(originalPrice)}
                                    </p>
                                    <p className="font-medium">
                                      ₹
                                      {Math.round(
                                        product.promoDiscount.discountedPrice
                                      )}
                                    </p>
                                    <small className="text-purple-600">
                                      {product.promoDiscount.type ===
                                      "PERCENTAGE"
                                        ? `${product.promoDiscount.value}% off`
                                        : `₹${Math.round(
                                            originalPrice -
                                              product.promoDiscount
                                                .discountedPrice
                                          )} off`}
                                    </small>
                                    {hasOfferDiscount &&
                                      offerResult.freeQuantity > 0 && (
                                        <div className="text-xs text-orange-600 mt-1">
                                          {offerResult.freeQuantity} free +
                                          promo
                                        </div>
                                      )}
                                  </>
                                );
                              } else if (hasOfferDiscount) {
                                // Show offer pricing when no promo is applied
                                return (
                                  <>
                                    <p className="font-medium text-gray-500 line-through">
                                      ₹{Math.round(offerResult.originalPrice)}
                                    </p>
                                    <p className="font-medium text-green-600">
                                      ₹{Math.round(offerResult.discountedPrice)}
                                    </p>
                                    <small className="text-green-600">
                                      ₹{Math.round(offerResult.offerSavings)}{" "}
                                      saved
                                    </small>
                                    {offerResult.freeQuantity > 0 && (
                                      <div className="text-xs text-orange-600 mt-1">
                                        {offerResult.freeQuantity} free
                                      </div>
                                    )}
                                  </>
                                );
                              } else if (hasOfferObject) {
                                // Product with offer object but no free items - show original price only
                                return (
                                  <>
                                    <p className="font-medium">
                                      ₹
                                      {Math.round(
                                        product.price * product.quantity
                                      )}
                                    </p>
                                  </>
                                );
                              } else if (product.discount) {
                                // Product with regular discount (only if no offer object)
                                return (
                                  <>
                                    <p className="font-medium text-gray-500 line-through">
                                      ₹
                                      {Math.round(
                                        product.price * product.quantity
                                      )}
                                    </p>
                                    {product.discount.valueType ===
                                    "PERCENTAGE" ? (
                                      <>
                                        <p className="font-medium">
                                          ₹
                                          {Math.round(
                                            product.price * product.quantity -
                                              (product.price *
                                                product.quantity *
                                                product.discount
                                                  .discountValue) /
                                                100
                                          )}
                                        </p>
                                        <small className="text-green-600">
                                          {product.discount.discountValue}% off
                                        </small>
                                      </>
                                    ) : (
                                      <>
                                        <p className="font-medium">
                                          ₹
                                          {Math.round(
                                            product.price * product.quantity -
                                              product.discount.discountValue *
                                                product.quantity
                                          )}
                                        </p>
                                        <small className="text-green-600">
                                          {product.quantity > 1 && (
                                            <span>{product.quantity} x </span>
                                          )}
                                          ₹{product.discount.discountValue} off{" "}
                                        </small>
                                      </>
                                    )}
                                  </>
                                );
                              } else {
                                // Regular product with no discount
                                return (
                                  <p className="font-medium">
                                    ₹
                                    {Math.round(
                                      product.price * product.quantity
                                    )}
                                  </p>
                                );
                              }
                            })()}
                          </div>
                          <div className="">
                            <Button
                              className="w-full"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(product.sku)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>
                <div className="lg:col-span-1">
                  <CartSummary
                    products={products}
                    subtotal={summary.subtotal}
                    shipping={summary.shipping}
                    tax={summary.tax}
                    total={summary.totalBeforePromo} // ✅ UPDATED: Pass total before promo for display
                    promoCodes={promoCodes}
                    onProceed={() => setStep(1)}
                    step={step}
                    offerSavings={getTotalOfferSavings(products)}
                    promoDiscount={promoDiscount}
                  />
                </div>
              </>
            ) : (
              <>
                {isProductsLoading ? (
                  <div className="flex items-center justify-center min-h-[60vh] h-max">
                    <TextLoader
                      messages={["Just a moment", "Almost there"]}
                      dotCount={3}
                      direction="vertical"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center min-h-[60vh] h-max">
                    <DotLottieReact
                      className="w-60 h-60"
                      src="/bnjWHaOEjk.lottie"
                      loop
                      autoplay
                    />
                    <p className="text-3xl font-bold">No items in cart</p>
                    <p className="text-lg text-gray-500">
                      Add some items to your cart
                    </p>
                    <Link
                      to="/category"
                      className="mt-4 text-primary hover:underline"
                    >
                      <Button variant={"secondary"} className="hover:invert">
                        Continue shopping
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutStep >= 0
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {checkoutStep > 0 ? <Check className="w-4 h-4" /> : "1"}
                      </div>
                      <h2 className="text-lg font-semibold">
                        Shipping Address
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutStep >= 1
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {checkoutStep > 1 ? <Check className="w-4 h-4" /> : "2"}
                      </div>
                      <h2 className="text-lg font-semibold">
                        User Information
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          checkoutStep >= 2
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        3
                      </div>
                      <h2 className="text-lg font-semibold">Review Order</h2>
                    </div>
                  </div>
                  <Separator className="my-6" />
                  {renderCheckoutStep()}
                </form>
              </Form>
            </div>
            <div className="lg:col-span-1">
              <CartSummary
                products={products}
                subtotal={summary.subtotal}
                shipping={summary.shipping}
                tax={summary.tax}
                total={summary.totalBeforePromo} // ✅ UPDATED: Pass total before promo for display
                promoCodes={promoCodes}
                onProceed={() => setStep(1)}
                step={step}
                offerSavings={getTotalOfferSavings(products)}
                promoDiscount={promoDiscount}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <InsufficientQuantityModal
        isOpen={openInsufficientQuantityModal}
        insufficientProducts={insufficientProducts}
        onClose={setOpenInsufficientQuantityModal}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleQuantityChange}
        setInsufficientProducts={setInsufficientProducts}
        orderData={orderData}
        setOrderData={setOrderData}
      />
    </div>
  );
}
