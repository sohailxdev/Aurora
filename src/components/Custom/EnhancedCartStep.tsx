"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Circle, Minus, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import OfferSummary from "./OfferSummary"
import { useOfferCalculation } from "@/hooks/useOfferCalculation"

interface EnhancedCartStepProps {
  products: any[]
  isProductsLoading: boolean
  onQuantityChange: (productId: string, skuId: string, oldQty: number, newQty: number, availableQty: number) => void
  onRemoveItem: (sku: string) => void
  cartSummaryComponent: React.ReactNode
}

export default function EnhancedCartStep({
  products,
  isProductsLoading,
  onQuantityChange,
  onRemoveItem,
  cartSummaryComponent,
}: EnhancedCartStepProps) {
  const { totalSavings, totalFreeItems, hasOffers, getProductOfferResult } = useOfferCalculation(products)

  if (isProductsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] h-max">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] h-max">
        <DotLottieReact className="w-60 h-60" src="/bnjWHaOEjk.lottie" loop autoplay />
        <p className="text-3xl font-bold">No items in cart</p>
        <p className="text-lg text-gray-500">Add some items to your cart</p>
        <Link to="/category" className="mt-4 text-primary hover:underline">
          <Button variant={"secondary"} className="hover:invert">
            Continue shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Offer Summary at the top if there are offers */}
        {hasOffers && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-green-800 flex items-center gap-2">
                🎉 Great! You're saving with offers
              </h3>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ₹{Math.round(totalSavings)} saved
              </Badge>
            </div>
            {totalFreeItems > 0 && (
              <p className="text-sm text-green-700">
                You're getting {totalFreeItems} item{totalFreeItems !== 1 ? "s" : ""} absolutely FREE!
              </p>
            )}
          </div>
        )}

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product, i) => {
            const offerResult = getProductOfferResult(product.sku)
            const hasOfferDiscount = offerResult?.hasOfferDiscount

            return (
              <div key={i} className="flex border gap-4 p-4 rounded-md relative">
                {/* Free item indicator */}
                {hasOfferDiscount && offerResult.freeQuantity > 0 && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <Badge className="bg-orange-500 text-white shadow-lg">{offerResult.freeQuantity} FREE</Badge>
                  </div>
                )}

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
                    <Circle className="text-gray-50 border rounded-full" fill={`#${product?.color?.split("-")[1]}`} />
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

                    {hasOfferDiscount && offerResult.freeQuantity > 0 && (
                      <Badge variant="secondary" className="bg-orange-50 shadow-sm border-orange-200 text-orange-700">
                        {offerResult.freeQuantity} item{offerResult.freeQuantity !== 1 ? "s" : ""} free
                      </Badge>
                    )}

                    {product.discount && (
                      <Badge variant="secondary" className="bg-blue-50 shadow-sm border-blue-200 text-blue-700">
                        {product.discount.valueType === "PERCENTAGE"
                          ? `${product.discount.discountValue}% off`
                          : `₹${product.discount.discountValue} off`}
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
                            product.sku_quantity,
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
                            product.sku_quantity,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Offer explanation */}
                    {hasOfferDiscount && (
                      <div className="text-xs text-green-600">
                        Pay for {offerResult.paidQuantity}, get {offerResult.freeQuantity} free
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col justify-between">
                  <div className="text-right">
                    {hasOfferDiscount ? (
                      // Product with offer discount
                      <>
                        <p className="font-medium text-gray-500 line-through">
                          ₹{Math.round(offerResult.originalPrice)}
                        </p>
                        <p className="font-medium text-green-600">₹{Math.round(offerResult.discountedPrice)}</p>
                        <small className="text-green-600">₹{Math.round(offerResult.offerSavings)} saved</small>
                        {offerResult.freeQuantity > 0 && (
                          <div className="text-xs text-orange-600 mt-1">{offerResult.freeQuantity} free</div>
                        )}
                      </>
                    ) : product.discount ? (
                      // Product with regular discount
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
                                  (product.price * product.quantity * product.discount.discountValue) / 100,
                              )}
                            </p>
                            <small className="text-green-600">{product.discount.discountValue}% off</small>
                          </>
                        ) : (
                          <>
                            <p className="font-medium">
                              ₹
                              {Math.round(
                                product.price * product.quantity - product.discount.discountValue * product.quantity,
                              )}
                            </p>
                            <small className="text-green-600">₹{product.discount.discountValue} off</small>
                          </>
                        )}
                      </>
                    ) : (
                      // Regular product with no discount
                      <p className="font-medium">₹{Math.round(product.price * product.quantity)}</p>
                    )}
                  </div>

                  <Button variant="ghost" size="icon" onClick={() => onRemoveItem(product.sku)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detailed Offer Summary */}
        {hasOffers && <OfferSummary products={products} className="mt-6" />}
      </div>

      {/* Cart Summary */}
      <div className="lg:col-span-1">{cartSummaryComponent}</div>
    </div>
  )
}
