"use client";

import { useAppSelector } from "@/app/hooks";
import type { ProductType } from "@/app/Product/type";
import {
  selectPromoDiscount,
  selectSelectedPromo,
} from "@/app/promoCode/promoSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import { useMemo } from "react";

interface OrderReviewProps {
  products: ProductType[] | undefined;
  userInfo: {
    firstname: string;
    lastname: string;
    email: string;
    number: string;
  };
  address: any;
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  onBack: () => void;
  onSubmit: () => void;
  placeOrderLoading: boolean;
}

export default function OrderReview({
  products,
  userInfo,
  address,
  summary,
  onBack,
  onSubmit,
  placeOrderLoading,
}: OrderReviewProps) {
  const selectedPromo = useAppSelector(selectSelectedPromo);
  const promoDiscount = useAppSelector(selectPromoDiscount);
  const displayProducts = useMemo(() => products, [products]);

  // ✅ NEW CHANGE: Calculate final total with promo discount
  const finalTotal = Math.max(0, summary.total);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review Order</h2>
      <div className="space-y-2">
        <h3 className="font-medium">User Information</h3>
        <p>
          Name: {userInfo.firstname} {userInfo.lastname}
        </p>
        <p>Email: {userInfo.email}</p>
        <p>Phone No: {userInfo.number}</p>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium">Shipping Address</h3>
        {address ? (
          <>
            <p>Name: {address.addressName}</p>
            <p>Local Address: {address.local_address}</p>
            <p>Landmark: {address.landmark || "Not added"}</p>
            <p className="capitalize">
              City: {address.district}, {address.city}
            </p>
            <p className="capitalize">
              State: {address.state}, {address.country} - {address.pincode}
            </p>
          </>
        ) : (
          <p>No address selected</p>
        )}
      </div>
      <div className="space-y-4">
        <h3 className="font-medium">Order Summary</h3>
        <div className="divide-y">
          {displayProducts?.map((product, i) => {
            const offerResult = product.offer_result;
            const hasOfferDiscount = offerResult?.hasOfferDiscount;
            const hasOfferObject = product.offer && product.offer.status;

            return (
              <div key={i} className="py-4 flex gap-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-24 w-24 object-contain rounded-lg border"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium capitalize">
                    {product.name} - {product.fit}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Circle
                        className="h-4 w-4"
                        fill={`#${product.color.split("-")[1]}`}
                      />
                      <span>Color: {product.color.split("-")[0]}</span>
                    </div>
                    <span>•</span>
                    <span>Size: {product.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Quantity: {product.quantity}</span>
                    <span>x</span>
                    <span>₹{Math.round(product.price)}</span>
                  </div>

                  {/* ✅ NEW CHANGE: Enhanced offer and discount display */}
                  <div className="flex flex-wrap gap-2">
                    {hasOfferObject && (
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700"
                      >
                        {product.offer.name}
                        {hasOfferDiscount &&
                          ` (${offerResult.freeQuantity} free)`}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {(() => {
                    const offerResult = product.offer_result;
                    const hasOfferDiscount = offerResult?.hasOfferDiscount;
                    const hasOfferObject =
                      product.offer && product.offer.status;
                    const hasPromoDiscount =
                      selectedPromo && product.promoDiscount;

                    // ✅ NEW LOGIC: Simplified pricing display
                    if (hasPromoDiscount) {
                      // When promo is applied, show original price (before any discounts) vs final promo price
                      const originalPrice = hasOfferDiscount
                        ? offerResult.originalPrice
                        : product.price * product.quantity;

                      return (
                        <>
                          <p className="font-medium text-gray-500 line-through">
                            ₹{Math.round(originalPrice)}
                          </p>
                          <p className="font-medium text-purple-600">
                            ₹{Math.round(product.promoDiscount.discountedPrice)}
                          </p>
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
                            ₹{Math.round(offerResult.offerSavings)} saved
                          </small>
                          {offerResult.freeQuantity > 0 && (
                            <div className="text-xs text-orange-600 mt-1">
                              {offerResult.freeQuantity} free
                            </div>
                          )}
                        </>
                      );
                    } else if (hasOfferObject) {
                      // Product with offer object but no free items - just show regular price
                      return (
                        <p className="font-medium">
                          ₹
                          {Math.round(
                            (product.price || 0) * (product.quantity || 1)
                          )}
                        </p>
                      );
                    } else if (product.discount) {
                      // Product with regular discount (only if no offer object)
                      return (
                        <>
                          <p className="font-medium text-gray-500 line-through">
                            ₹
                            {Math.round(
                              (product.price || 0) * (product.quantity || 1)
                            )}
                          </p>
                          {product.discount.valueType === "PERCENTAGE" ? (
                            <>
                              <p className="font-medium">
                                ₹
                                {Math.round(
                                  product.price * product.quantity -
                                    (product.price *
                                      product.quantity *
                                      product.discount.discountValue) /
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
                                ₹{product.discount.discountValue} off
                              </small>
                            </>
                          )}
                        </>
                      );
                    } else {
                      // Regular product with no discount
                      return (
                        <p className="font-medium">
                          ₹{Math.round(product.price * product.quantity)}
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            );
          })}
        </div>
        <Separator />

        {/* ✅ UPDATED: Show total with proper promo discount application */}
        <div className="flex justify-between font-medium">
          <span>Subtotal:</span>
          <span>₹{Math.round(summary.subtotal)}</span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Promo Discount ({selectedPromo?.promoName}):</span>
            <span>-₹{Math.round(promoDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>₹{Math.round(finalTotal)}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" type="button" onClick={onBack}>
          Back
        </Button>
        <Button type="button" disabled={placeOrderLoading} onClick={onSubmit}>
          {placeOrderLoading ? "Submitting..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
