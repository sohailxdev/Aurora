"use client"

import { useMemo } from "react"
import { getTotalOfferSavings, getTotalFreeItems, getOfferSummary } from "@/app/cart/cartApi"

export function useOfferCalculation(products: any[]) {
  return useMemo(() => {
    const totalSavings = getTotalOfferSavings(products)
    const totalFreeItems = getTotalFreeItems(products)
    const offerSummary = getOfferSummary(products)

    const hasOffers = totalSavings > 0

    const getProductOfferResult = (sku: string) => {
      for (const product of products) {
        const attributes = Array.isArray(product.attributes) ? product.attributes : [product]
        const attr = attributes.find((a: any) => a.sku === sku)
        if (attr?.offer_result) {
          return attr.offer_result
        }
      }
      return null
    }

    return {
      totalSavings,
      totalFreeItems,
      offerSummary,
      hasOffers,
      getProductOfferResult,
    }
  }, [products])
}
