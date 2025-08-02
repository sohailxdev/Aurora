"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, Minus, Plus, Trash2 } from "lucide-react";

interface EnhancedCartItemProps {
  product: any;
  onQuantityChange: (
    productId: string,
    skuId: string,
    oldQty: number,
    newQty: number,
    availableQty: number
  ) => void;
  onRemove: (sku: string) => void;
}

export default function EnhancedCartItem({
  product,
  onQuantityChange,
  onRemove,
}: EnhancedCartItemProps) {
  const offerResult = product.offer_result;
  const hasOffer = offerResult?.hasOfferDiscount;

  return (
    <div className="flex border gap-4 p-4 rounded-md">
      <div className="relative w-24 h-34 sm:w-28 sm:h-28 flex">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-contain"
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

        {/* Offer badges */}
        <div className="flex flex-wrap gap-2">
          {product.offer && (
            <Badge
              variant="secondary"
              className="bg-green-50 shadow-sm border-green-200 text-green-700 hover:bg-green-100"
            >
              {product.offer.name}
            </Badge>
          )}

          {hasOffer && offerResult.freeQuantity > 0 && (
            <Badge
              variant="secondary"
              className="bg-orange-50 shadow-sm border-orange-200 text-orange-700"
            >
              {offerResult.freeQuantity} FREE
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
                onQuantityChange(
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
            <span className="w-8 text-center">{product.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={product?.sku_quantity <= product.quantity}
              onClick={() =>
                onQuantityChange(
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
          {hasOffer ? (
            <>
              <p className="font-medium text-gray-500 line-through">
                ₹{Math.round(offerResult.originalPrice)}
              </p>
              <p className="font-medium">
                ₹{Math.round(offerResult.discountedPrice)}
              </p>
              <small className="text-green-600">
                ₹{Math.round(offerResult.offerSavings)} saved
              </small>
              {offerResult.freeQuantity > 0 && (
                <div className="text-xs text-orange-600 mt-1">
                  {offerResult.freeQuantity} item
                  {offerResult.freeQuantity !== 1 ? "s" : ""} free
                </div>
              )}
            </>
          ) : product.discount ? (
            <>
              <p className="font-medium text-gray-500 line-through">
                ₹{Math.round(product.price * product.quantity)}
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
                        product.discount.discountValue * product.quantity
                    )}
                  </p>
                  <small className="text-green-600">
                    ₹{product.discount.discountValue} off
                  </small>
                </>
              )}
            </>
          ) : (
            <p className="font-medium">
              ₹{Math.round(product.price * product.quantity)}
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.sku)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
