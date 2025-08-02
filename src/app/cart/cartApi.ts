import axios from "axios"
import { BASE_URL } from "@/lib/constant"
import type { CartItems } from "./types"

// Offer calculation interfaces
interface OfferItem {
  sku: string
  productId: string
  price: number
  quantity: number
  offer?: {
    name: string
    buyQuantity: number
    getQuantity: number
    offerId: number
    status: boolean
  }
  discount?: any // Regular discount object - will be removed if offer exists
}

interface OfferResult {
  originalPrice: number
  discountedPrice: number
  freeQuantity: number
  paidQuantity: number
  offerSavings: number
  hasOfferDiscount: boolean
  remainingQuantity: number // Quantity not covered by offers (eligible for promo)
  appliedOffers: Array<{
    offerName: string
    timesApplied: number
    totalFreeItems: number
    totalSavings: number
  }>
}

// Enhanced attribute interface
interface EnhancedAttribute {
  [key: string]: any
  offer_result?: OfferResult
  effective_price?: number
  original_price?: number
  final_price?: number // Price after offer but before promo
  is_offer_eligible?: boolean // Has offer object
  has_offer_applied?: boolean // Actually has free items from offer
  discount?: any // Will be null if offer exists
}

/**
 * Remove discount objects when offer objects exist with status=true
 * This prevents conflicts between offers and discounts
 */
const removeDiscountIfOfferExists = (items: OfferItem[]): OfferItem[] => {
  return items.map((item) => {
    if (item.offer && item.offer.status) {
      // Remove discount object if offer exists and is active
      return {
        ...item,
        discount: undefined,
      }
    }
    return item
  })
}

/**
 * ✅ UPDATED: Enhanced offer calculation with improved sorting logic
 * Now prioritizes higher quantity items when prices are equal
 */
const calculateOfferDiscounts = (items: OfferItem[]): Map<string, OfferResult> => {
  const results = new Map<string, OfferResult>()

  // Remove discounts for items with offers first
  const cleanedItems = removeDiscountIfOfferExists(items)

  // Group items by offer name for cross-item offer calculation
  const offerGroups = new Map<string, OfferItem[]>()

  cleanedItems.forEach((item) => {
    if (item.offer && item.offer.status) {
      const offerName = item.offer.name
      if (!offerGroups.has(offerName)) {
        offerGroups.set(offerName, [])
      }
      offerGroups.get(offerName)!.push(item)
    }
  })

  // Process each offer group
  offerGroups.forEach((groupItems, offerName) => {
    if (groupItems.length === 0) return

    // Get offer details
    const offer = groupItems[0].offer!
    const { buyQuantity, getQuantity } = offer

    // Create expanded items array with individual units and their prices
    const expandedItems: Array<{
      sku: string
      price: number
      isPaid: boolean
      originalIndex: number
      itemReference: OfferItem
    }> = []

    // Expand each item into individual units
    groupItems.forEach((item, itemIndex) => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          sku: item.sku,
          price: item.price,
          isPaid: true, // Initially mark all as paid
          originalIndex: itemIndex,
          itemReference: item,
        })
      }
    })

    // ✅ NEW CHANGE: Enhanced sorting with quantity priority for same-priced items
    // Primary sort: by price (highest to lowest) for optimal savings
    // Secondary sort: by quantity (highest to lowest) when prices are equal for better user experience
    expandedItems.sort((a, b) => {
      // Primary sort: by price (highest first)
      if (b.price !== a.price) {
        return b.price - a.price
      }
      // Secondary sort: by quantity (highest first) when prices are equal
      // This ensures items with more quantity get offer priority when prices match
      return b.itemReference.quantity - a.itemReference.quantity
    })

    // Apply offer logic across all items with same offer name
    let processedIndex = 0
    let timesApplied = 0

    while (processedIndex + buyQuantity + getQuantity <= expandedItems.length) {
      // Keep the next buyQuantity items as paid (highest priced items, or highest quantity if same price)
      processedIndex += buyQuantity

      // Mark the next getQuantity items as free (next highest priced items, or highest quantity if same price)
      for (let i = 0; i < getQuantity && processedIndex < expandedItems.length; i++) {
        expandedItems[processedIndex].isPaid = false
        processedIndex++
      }

      timesApplied++
    }

    // Calculate results for each original item with detailed tracking
    const skuResults = new Map<
      string,
      {
        paidCount: number
        freeCount: number
        remainingCount: number
        totalSavings: number
      }
    >()

    // Initialize results for each SKU
    groupItems.forEach((item) => {
      skuResults.set(item.sku, {
        paidCount: 0,
        freeCount: 0,
        remainingCount: 0,
        totalSavings: 0,
      })
    })

    // Count paid, free, and remaining items for each SKU
    expandedItems.forEach((item) => {
      const result = skuResults.get(item.sku)!

      if (item.isPaid) {
        // Check if this item was part of an offer cycle
        const itemIndex = expandedItems.indexOf(item)
        const totalCycleSize = buyQuantity + getQuantity
        const cycleNumber = Math.floor(itemIndex / totalCycleSize)
        const positionInCycle = itemIndex % totalCycleSize

        if (cycleNumber < timesApplied && positionInCycle < buyQuantity) {
          // This item was part of a "buy" portion of an offer
          result.paidCount++
        } else {
          // This item is remaining (not part of any offer cycle)
          result.remainingCount++
        }
      } else {
        // This item is free
        result.freeCount++
        result.totalSavings += item.price
      }
    })

    // Create final results for each original item
    groupItems.forEach((item) => {
      const skuResult = skuResults.get(item.sku)!
      const originalPrice = item.price * item.quantity
      const discountedPrice = item.price * (skuResult.paidCount + skuResult.remainingCount)

      const result: OfferResult = {
        originalPrice,
        discountedPrice,
        freeQuantity: skuResult.freeCount,
        paidQuantity: skuResult.paidCount,
        remainingQuantity: skuResult.remainingCount, // Quantity eligible for promo codes
        offerSavings: skuResult.totalSavings,
        hasOfferDiscount: skuResult.freeCount > 0,
        appliedOffers: [
          {
            offerName,
            timesApplied,
            totalFreeItems: skuResult.freeCount,
            totalSavings: skuResult.totalSavings,
          },
        ],
      }

      results.set(item.sku, result)
    })
  })

  return results
}

/**
 * Calculate final price - no discount if offer exists
 */
const calculateDiscountPrice = (price: number, quantity: number, discount: any, hasOffer = false): number => {
  // Don't apply discount if item has an offer
  if (hasOffer || !discount) return price * quantity

  if (discount.valueType === "PERCENTAGE") {
    return Math.round(price * quantity - (price * quantity * discount.discountValue) / 100)
  } else if (discount.valueType === "AMOUNT") {
    return Math.round(price * quantity - discount.discountValue * quantity)
  }

  return price * quantity
}

/**
 * Helper function to get total offer savings across all items
 */
export const getTotalOfferSavings = (items: any[]): number => {
  return items.reduce((total, item) => {
    const attributes = Array.isArray(item.attributes) ? item.attributes : [item]
    return (
      total +
      attributes.reduce((attrTotal: number, attr: any) => {
        return attrTotal + (attr.offer_result?.offerSavings || 0)
      }, 0)
    )
  }, 0)
}

/**
 * Helper function to get total free items
 */
export const getTotalFreeItems = (items: any[]): number => {
  return items.reduce((total, item) => {
    const attributes = Array.isArray(item.attributes) ? item.attributes : [item]
    return (
      total +
      attributes.reduce((attrTotal: number, attr: any) => {
        return attrTotal + (attr.offer_result?.freeQuantity || 0)
      }, 0)
    )
  }, 0)
}

/**
 * Helper function to get offer summary by offer name
 */
export const getOfferSummary = (
  items: any[],
): Record<string, { totalSavings: number; totalFreeItems: number; timesApplied: number }> => {
  const summary: Record<string, { totalSavings: number; totalFreeItems: number; timesApplied: number }> = {}

  items.forEach((item) => {
    const attributes = Array.isArray(item.attributes) ? item.attributes : [item]
    attributes.forEach((attr: any) => {
      if (attr.offer_result?.appliedOffers) {
        attr.offer_result.appliedOffers.forEach((appliedOffer: any) => {
          const { offerName, totalSavings, totalFreeItems, timesApplied } = appliedOffer
          if (!summary[offerName]) {
            summary[offerName] = { totalSavings: 0, totalFreeItems: 0, timesApplied: 0 }
          }
          summary[offerName].totalSavings += totalSavings
          summary[offerName].totalFreeItems += totalFreeItems
          summary[offerName].timesApplied = Math.max(summary[offerName].timesApplied, timesApplied)
        })
      }
    })
  })

  return summary
}

/**
 * Get items eligible for promo codes with detailed quantity tracking
 * Items are eligible if they don't have offer objects OR have remaining quantities not covered by offers
 */
export const getPromoEligibleItems = (items: any[]): any[] => {
  const eligibleItems: any[] = []

  items.forEach((item) => {
    const attributes = Array.isArray(item.attributes) ? item.attributes : [item]
    attributes.forEach((attr: any) => {
      const quantity = Number.parseInt(attr.cart_quantity || attr.quantity || "0")
      if (quantity <= 0) return

      // If item has no offer object, it's fully eligible for promo codes
      if (!attr.offer) {
        eligibleItems.push({
          ...attr,
          eligible_quantity: quantity,
          product_id: item.product_id || item.id,
          promo_eligible_reason: "no_offer",
        })
        return
      }

      // If item has offer object but has remaining quantity not covered by offers
      if (attr.offer_result && attr.offer_result.remainingQuantity > 0) {
        eligibleItems.push({
          ...attr,
          eligible_quantity: attr.offer_result.remainingQuantity,
          product_id: item.product_id || item.id,
          promo_eligible_reason: "remaining_after_offer",
        })
      }
    })
  })

  return eligibleItems
}

/**
 * Calculate subtotal after offers but before promo codes
 * This is the base for promo code calculations
 */
export const getSubtotalAfterOffers = (items: any[]): number => {
  return items.reduce((total, item) => {
    const attributes = Array.isArray(item.attributes) ? item.attributes : [item]
    return (
      total +
      attributes.reduce((attrTotal: number, attr: any) => {
        const quantity = Number.parseInt(attr.cart_quantity || "0")
        if (quantity <= 0) return attrTotal

        // If item has offer, use offer price
        if (attr.offer_result?.hasOfferDiscount) {
          return attrTotal + attr.offer_result.discountedPrice
        }

        // If item has offer object but no discount applied, use original price for remaining quantity
        if (attr.offer && attr.offer_result) {
          const remainingQuantity = attr.offer_result.remainingQuantity || 0
          const paidQuantity = attr.offer_result.paidQuantity || 0
          return attrTotal + attr.price * (paidQuantity + remainingQuantity)
        }

        // Only apply discount if no offer object exists
        if (!attr.offer && attr.discount) {
          return attrTotal + calculateDiscountPrice(attr.price, quantity, attr.discount, false)
        }

        // Otherwise use regular price
        return attrTotal + attr.price * quantity
      }, 0)
    )
  }, 0)
}

export const fetchCartItems = async (
  prod: { productId: string; skuId: string; quantity: string }[],
  source?: string,
) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/cart`, prod)
    if (res.status === 200) {
      const { unmatchedItems, matchedItems } = res.data

      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const cartFromSession = JSON.parse(sessionStorage.getItem("checkoutProducts") || "[]")

      let updatedCart

      if (source == "direct") {
        updatedCart = cartFromSession.filter(
          (item: any) =>
            !unmatchedItems.some(
              (unmatched: any) => unmatched.productId === item.productId && unmatched.skuId === item.skuId,
            ),
        )
      } else {
        updatedCart = cart.filter(
          (item: any) =>
            !unmatchedItems.some(
              (unmatched: any) => unmatched.productId === item.productId && unmatched.skuId === item.skuId,
            ),
        )
      }

      updatedCart = updatedCart.map((item: any) => {
        const matchedItem = matchedItems.find(
          (matched: any) =>
            matched.product_details.product_id === item.productId &&
            matched.product_details.attributes.some((att: any) => att.sku === item.skuId),
        )
        if (matchedItem) {
          const matchedAttribute = matchedItem.product_details.attributes.find((att: any) => att.sku === item.skuId)
          return {
            ...item,
            sku_quantity: matchedAttribute ? matchedAttribute.quantity : item.sku_quantity,
          }
        }
        return item
      })

      if (source == "cart") {
        localStorage.setItem("cart", JSON.stringify(updatedCart))
      }

      // Collect all items with offers for cross-attribute offer calculation
      const allOfferItems: OfferItem[] = []

      matchedItems.forEach((d: CartItems) => {
        const productDetails = d.product_details

        productDetails.attributes.forEach((att) => {
          const cartItem = prod.find((p) => p.productId == productDetails.product_id && p.skuId == att.sku)

          if (cartItem && Number.parseInt(cartItem.quantity) > 0) {
            // Include all items (both with and without offers) for processing
            allOfferItems.push({
              sku: att.sku,
              productId: productDetails.product_id,
              price: att.price,
              quantity: Number.parseInt(cartItem.quantity),
              offer: att.offer,
              discount: att.discount,
            })
          }
        })
      })

      // Calculate offer discounts with enhanced cross-item logic and improved sorting
      const offerResults = calculateOfferDiscounts(allOfferItems)

      // Process the matched items and apply offer calculations
      const processedItems = matchedItems.map((d: CartItems) => {
        const productDetails = d.product_details

        return {
          ...productDetails,
          sku_id: productDetails.attributes[0].sku,
          attributes: productDetails.attributes.map((att): EnhancedAttribute => {
            const cartItem = prod.find((p) => p.productId == productDetails.product_id && p.skuId == att.sku)
            const offerResult = offerResults.get(att.sku)
            const quantity = Number.parseInt(cartItem?.quantity || "0")
            const hasOffer = !!(att.offer && att.offer.status)

            // Remove discount if offer exists
            const cleanDiscount = hasOffer ? undefined : att.discount

            // Calculate final price based on priority: Offer > Discount (only if no offer object) > Regular Price
            let finalPrice = att.price * quantity
            let effectivePrice = att.price

            if (offerResult?.hasOfferDiscount) {
              // Offer takes priority
              finalPrice = offerResult.discountedPrice
              effectivePrice = offerResult.discountedPrice / Math.max(1, quantity)
            } else if (offerResult && !offerResult.hasOfferDiscount) {
              // Has offer object but no free items - use original price for all quantities
              finalPrice = att.price * quantity
              effectivePrice = att.price
            } else if (!hasOffer && cleanDiscount) {
              // Apply discount only if no offer object exists
              finalPrice = calculateDiscountPrice(att.price, quantity, cleanDiscount, false)
              effectivePrice = finalPrice / Math.max(1, quantity)
            }

            return {
              ...att,
              cart_quantity: cartItem ? cartItem.quantity : "0",
              offer_result: offerResult,
              effective_price: effectivePrice,
              original_price: att.price,
              final_price: finalPrice,
              is_offer_eligible: hasOffer, // Has offer object
              has_offer_applied: !!offerResult?.hasOfferDiscount, // Actually has free items
              discount: cleanDiscount, // Null if offer exists
            }
          }),
        }
      })

      return processedItems
    } else {
      throw new Error("Failed to fetch cart items")
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data
    else throw "Something went wrong!"
  }
}
