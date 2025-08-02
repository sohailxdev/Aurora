"use client";

import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PromoCodeList from "@/app/promoCode/PromoCodeList";

interface CartSummaryProps {
  products: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  promoCodes?: any[];
  onProceed: () => void;
  step: number;
  offerSavings?: number;
  promoDiscount?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  products,
  subtotal,
  shipping,
  tax,
  total,
  promoCodes,
  onProceed,
  step,
  offerSavings = 0,
  promoDiscount = 0,
}) => {
  // ✅ UPDATED: Calculate final total after applying promo discount
  const finalTotal = Math.max(0, total - (promoDiscount || 0));

  // ✅ NEW CHANGE: Calculate promo eligible quantities
  const promoEligibleInfo = products.reduce(
    (acc, product) => {
      if (!product.offer) {
        acc.totalEligible += product.quantity;
      } else if (product.offer_result?.remainingQuantity > 0) {
        acc.totalEligible += product.offer_result.remainingQuantity;
        acc.hasPartialEligible = true;
      }
      return acc;
    },
    { totalEligible: 0, hasPartialEligible: false }
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>
          Subtotal ({products.filter((d) => +d.quantity > 0).length} items)
        </span>
        <span>₹{Math.round(subtotal)}</span>
      </div>

      {offerSavings > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span className="flex items-center gap-2">
            Offer Savings
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 text-xs"
            >
              🎉
            </Badge>
          </span>
          <span>-₹{Math.round(offerSavings)}</span>
        </div>
      )}

      {/* ✅ UPDATED: Enhanced promo discount display with eligibility info */}
      {promoDiscount > 0 && (
        <div className="flex justify-between text-sm text-purple-600">
          <span className="flex items-center gap-2">
            Promo Discount
            <Badge
              variant="secondary"
              className="bg-purple-50 text-purple-700 text-xs"
            >
              🏷️
            </Badge>
          </span>
          <span>-₹{Math.round(promoDiscount)}</span>
        </div>
      )}

      <div className="flex justify-between text-sm">
        <span>Shipping</span>
        <span>₹{Math.round(shipping)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Tax</span>
        <span>₹{Math.round(tax)}</span>
      </div>
      <Separator />

      {/* ✅ UPDATED: Show final total after promo discount */}
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>₹{Math.round(finalTotal)}</span>
      </div>

      {/* ✅ UPDATED: Enhanced savings summary with promo eligibility note */}
      {(offerSavings > 0 || promoDiscount > 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="text-sm text-green-800">
            <div className="font-medium mb-1">You're saving:</div>
            {offerSavings > 0 && (
              <div className="flex justify-between">
                <span>• Offer discounts:</span>
                <span>₹{Math.round(offerSavings)}</span>
              </div>
            )}
            {promoDiscount > 0 && (
              <div className="flex justify-between">
                <span>• Promo discount:</span>
                <span>₹{Math.round(promoDiscount)}</span>
              </div>
            )}
            <Separator className="my-2 bg-green-200" />
            <div className="flex justify-between font-medium">
              <span>Total savings:</span>
              <span>
                ₹{Math.round((offerSavings || 0) + (promoDiscount || 0))}
              </span>
            </div>
            {/* ✅ NEW CHANGE: Show promo eligibility info */}
          </div>
        </div>
      )}

      <Card>
        <CardContent>
          <PromoCodeList
            promoCodes={promoCodes}
            subtotal={subtotal}
            products={products}
          />
        </CardContent>
      </Card>

      {onProceed && step == 0 && (
        <Button className="w-fit" type="button" onClick={onProceed}>
          Proceed to Checkout
        </Button>
      )}
    </div>
  );
};

export default CartSummary;
