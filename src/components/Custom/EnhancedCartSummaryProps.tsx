"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { calculateDiscountedPrice } from "@/lib/utils";
import { useOfferCalculation } from "@/hooks/useOfferCalculation";

interface EnhancedCartSummaryProps {
  products: any[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  promoCodes?: any[];
  onProceed: () => void;
  step: number;
  promoDiscount?: number;
}

export default function EnhancedCartSummary({
  products,
  subtotal,
  shipping,
  tax,
  total,
  promoCodes,
  onProceed,
  step,
  promoDiscount = 0,
}: EnhancedCartSummaryProps) {
  const { totalSavings, hasOffers } = useOfferCalculation(products);

  // Calculate subtotal with offer discounts
  const subtotalWithOffers =
    products
      .filter((d) => +d.quantity > 0)
      ?.map((d) => {
        const offerResult = d.offer_result;
        if (offerResult?.hasOfferDiscount) {
          return offerResult.discountedPrice;
        }
        return calculateDiscountedPrice(+d.price, d.discount) * +d.quantity;
      })
      ?.reduce((acc, num) => acc + num, 0) || 0;

  const finalTotal = subtotalWithOffers + shipping + tax - promoDiscount;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Subtotal ({products.filter((d) => +d.quantity > 0).length} items)
            </span>
            <span>₹{Math.round(subtotal)}</span>
          </div>

          {/* Show offer savings */}
          {hasOffers && totalSavings > 0 && (
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
              <span>-₹{Math.round(totalSavings)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>

          {/* Show promo discount if applied */}
          {promoDiscount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo Discount</span>
              <span>-₹{Math.round(promoDiscount)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{Math.round(finalTotal)}</span>
        </div>

        {/* Savings summary */}
        {(hasOffers || promoDiscount > 0) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800">
              <div className="font-medium mb-1">You're saving:</div>
              {hasOffers && (
                <div className="flex justify-between">
                  <span>• Offer discounts:</span>
                  <span>₹{Math.round(totalSavings)}</span>
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
                <span>₹{Math.round(totalSavings + promoDiscount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Promo code section - only show in cart step */}
        {step === 0 && promoCodes && (
          <div className="space-y-2">
            <Separator />
            {/* Add your existing promo code component here */}
          </div>
        )}

        <Button onClick={onProceed} className="w-full" size="lg">
          {step === 0 ? "Proceed to Checkout" : "Continue"}
        </Button>

        {step === 0 && (
          <p className="text-xs text-gray-500 text-center">
            Shipping and taxes calculated at checkout
          </p>
        )}
      </CardContent>
    </Card>
  );
}
