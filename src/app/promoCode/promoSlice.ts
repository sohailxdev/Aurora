import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"
import { BASE_URL } from "@/lib/constant"
import type { PromoCode, PromoCodeResponse } from "./type"
import { isPromoCodeValid } from "./PromoCode"
import type { RootState } from "../store"
import { toast } from "sonner"
import type { ProductType } from "../Product/type"

// Define the state interface
interface PromoCodeState {
  promoCodes: PromoCodeResponse | null
  selectedPromo: PromoCode | null
  promoDiscount: number | undefined
  discountedProducts: ProductType[] | undefined
  loading: boolean
  error: string | null
}

// Initial state
const initialState: PromoCodeState = {
  promoCodes: null,
  selectedPromo: null,
  promoDiscount: 0,
  discountedProducts: [],
  loading: false,
  error: null,
}

// Helper function to check if any items have offers applied (free items)
const hasAnyOffersApplied = (products: ProductType[] | null): boolean => {
  if (!products) return false

  return products.some((product) => {
    return product.offer_result?.hasOfferDiscount && product.offer_result?.freeQuantity > 0
  })
}

// Helper function to get products eligible for promo codes
const getPromoEligibleProducts = (products: ProductType[] | null): ProductType[] => {
  if (!products) return []

  return products.filter((product) => {
    // Include products without offer objects
    if (!product.offer) {
      return true
    }

    // Include products with offer objects but have remaining quantities not covered by offers
    if (product.offer_result && product.offer_result.remainingQuantity > 0) {
      return true
    }

    return false
  })
}

// Helper function to calculate subtotal of promo-eligible products only
const getPromoEligibleSubtotal = (products: ProductType[] | null): number => {
  if (!products) return 0

  return products.reduce((total, product) => {
    // If no offer object, include full quantity
    if (!product.offer) {
      return total + product.price * product.quantity
    }

    // If has offer object, only include remaining quantity not covered by offers
    if (product.offer_result && product.offer_result.remainingQuantity > 0) {
      return total + product.price * product.offer_result.remainingQuantity
    }

    return total
  }, 0)
}

// Async thunk for fetching promo codes
export const fetchPromoCodes = createAsyncThunk("promoCode/fetchPromoCodes", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/promoCode/userList`)
    return response.data
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return rejectWithValue("Failed to fetch promo codes")
  }
})

// Async thunk for applying promo code (updated with new logic)
export const applyPromoCode = createAsyncThunk(
  "promoCode/applyPromoCode",
  async (
    {
      promoCode,
      products,
      subtotal,
    }: {
      promoCode: PromoCode | null
      products: ProductType[] | null
      subtotal: number
    },
    { rejectWithValue },
  ) => {
    try {
      // If no promo code, return empty result
      if (!promoCode) {
        return {
          discountedProducts: [],
          totalDiscount: 0,
          selectedPromo: null,
        }
      }

      // Get products eligible for promo codes
      const eligibleProducts = getPromoEligibleProducts(products)

      if (eligibleProducts.length === 0) {
        toast.error("No items are eligible for promo code discount")
        return {
          selectedPromo: null,
          promoDiscount: 0,
          discountedProducts: [],
        }
      }

      // Calculate subtotal of eligible products only
      const eligibleSubtotal = getPromoEligibleSubtotal(products)

      // Check if promo code is valid based on eligible products subtotal
      if (!isPromoCodeValid(promoCode, eligibleSubtotal)) {
        toast.error(
          `Promo code requires minimum ₹${promoCode.minimumAmount} on eligible items (current: ₹${Math.round(eligibleSubtotal)})`,
        )
        return rejectWithValue(`Promo code requires minimum ₹${promoCode.minimumAmount} on eligible items`)
      }

      let totalDiscount = 0
      let productsForDiscount: ProductType[] = []

      // For PERCENTAGE type, only include products without existing discounts
      // For AMOUNT type, include all eligible products
      if (promoCode.valueType === "PERCENTAGE") {
        productsForDiscount = eligibleProducts.filter((p) => !p.discount)

        if (productsForDiscount.length === 0) {
          toast.error("This percentage promo code cannot be applied to products with existing discounts")
          return rejectWithValue("This percentage promo code cannot be applied to products with existing discounts")
        }
      } else {
        // For AMOUNT type, all eligible products
        productsForDiscount = eligibleProducts
      }

      // Apply discount to each product
      const discountedProducts = products?.map((product) => {
        // Create a clean product without promo discount
        const cleanProduct = { ...product, promoDiscount: undefined }

        // Skip products with offer objects that don't have remaining quantities
        if (product.offer && (!product.offer_result || product.offer_result.remainingQuantity === 0)) {
          return cleanProduct
        }

        // For PERCENTAGE type, skip products with existing discounts
        if (promoCode.valueType === "PERCENTAGE" && product.discount) {
          return cleanProduct
        }

        // Calculate eligible quantity and price
        let eligibleQuantity = product.quantity
        let currentPrice = product.price * product.quantity

        // If product has offer object, only apply promo to remaining quantity
        if (product.offer && product.offer_result) {
          eligibleQuantity = product.offer_result.remainingQuantity
          currentPrice = product.price * eligibleQuantity

          if (eligibleQuantity === 0) {
            return cleanProduct
          }
        }

        // Apply regular discount to current price if present (only for non-offer items)
        if (product.discount && !product.offer) {
          if (product.discount.valueType === "PERCENTAGE") {
            currentPrice = currentPrice - (currentPrice * product.discount.discountValue) / 100
          } else if (product.discount.valueType === "AMOUNT") {
            currentPrice = currentPrice - product.discount.discountValue * eligibleQuantity
          }
        }

        // Apply promo discount based on type
        if (promoCode.valueType === "PERCENTAGE") {
          // For PERCENTAGE, apply to eligible quantity price
          const originalPrice = product.price * eligibleQuantity
          const discountAmount = (originalPrice * promoCode.value) / 100
          const discountedPrice = originalPrice - discountAmount
          totalDiscount += discountAmount

          return {
            ...cleanProduct,
            promoDiscount: {
              type: "PERCENTAGE",
              value: promoCode.value,
              originalPrice,
              discountedPrice,
              eligibleQuantity,
            },
          }
        } else if (promoCode.valueType === "AMOUNT") {
          // For AMOUNT, distribute proportionally based on eligible price
          const totalEligiblePrice = productsForDiscount.reduce((sum, p) => {
            let price = p.price * p.quantity
            let quantity = p.quantity

            // If product has offer, only consider remaining quantity
            if (p.offer && p.offer_result) {
              quantity = p.offer_result.remainingQuantity
              price = p.price * quantity
            }

            if (p.discount && !p.offer) {
              if (p.discount.valueType === "PERCENTAGE") {
                price = price - (price * p.discount.discountValue) / 100
              } else {
                price = price - p.discount.discountValue * quantity
              }
            }
            return sum + price
          }, 0)

          // Calculate proportional discount
          const proportionalDiscount = (currentPrice / totalEligiblePrice) * promoCode.value
          const finalPrice = Math.max(0, currentPrice - proportionalDiscount)
          totalDiscount += currentPrice - finalPrice

          return {
            ...cleanProduct,
            promoDiscount: {
              type: "AMOUNT",
              value: proportionalDiscount,
              originalPrice: currentPrice,
              discountedPrice: finalPrice,
              eligibleQuantity,
            },
          }
        }

        // Return product without changes if no discount applies
        return cleanProduct
      })

      // Ensure total discount doesn't exceed promo value for AMOUNT type
      if (promoCode.valueType === "AMOUNT") {
        totalDiscount = Math.min(totalDiscount, promoCode.value)
      }

      toast.success(`Promo code ${promoCode.promoName} applied successfully!`)

      return {
        discountedProducts,
        totalDiscount,
        selectedPromo: promoCode,
      }
    } catch (error) {
      console.error("Error applying promo code:", error)
      return rejectWithValue("Failed to apply promo code")
    }
  },
)

// New thunk to validate and potentially remove promo code when offers change
export const validatePromoWithOffers = createAsyncThunk(
  "promoCode/validatePromoWithOffers",
  async (
    {
      products,
      currentPromo,
      currentPromoDiscount,
    }: {
      products: ProductType[] | null
      currentPromo: PromoCode | null
      currentPromoDiscount: number
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      if (!currentPromo || !products) {
        return { shouldKeepPromo: false }
      }

      // Get eligible products for promo
      const eligibleProducts = getPromoEligibleProducts(products)

      if (eligibleProducts.length === 0) {
        // No eligible products left, remove promo
        toast.info("Promo code removed as no items are eligible")
        dispatch(clearPromoCode())
        return { shouldKeepPromo: false }
      }

      // Check if remaining eligible products meet minimum amount
      const eligibleSubtotal = getPromoEligibleSubtotal(products)

      if (!isPromoCodeValid(currentPromo, eligibleSubtotal)) {
        toast.info(`Promo code removed as eligible items don't meet minimum amount of ₹${currentPromo.minimumAmount}`)
        dispatch(clearPromoCode())
        return { shouldKeepPromo: false }
      }

      // Re-apply promo to eligible products only
      const result = await dispatch(
        applyPromoCode({
          promoCode: currentPromo,
          products,
          subtotal: eligibleSubtotal,
        }),
      )

      return { shouldKeepPromo: true }
    } catch (error) {
      console.error("Error validating promo with offers:", error)
      return rejectWithValue("Failed to validate promo code")
    }
  },
)

// Create the slice
export const promoCodeSlice = createSlice({
  name: "promoCode",
  initialState,
  reducers: {
    clearPromoCode: (state) => {
      state.selectedPromo = null
      state.promoDiscount = 0
      state.discountedProducts = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch promo codes
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action: PayloadAction<PromoCodeResponse>) => {
        state.loading = false
        state.promoCodes = action.payload
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Apply promo code
      .addCase(applyPromoCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.loading = false
        state.selectedPromo = action.payload.selectedPromo
        state.promoDiscount = action.payload.totalDiscount
        state.discountedProducts = action.payload.discountedProducts
      })
      .addCase(applyPromoCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Validate promo with offers
      .addCase(validatePromoWithOffers.fulfilled, (state, action) => {
        if (!action.payload.shouldKeepPromo) {
          state.selectedPromo = null
          state.promoDiscount = 0
          state.discountedProducts = []
        }
      })
  },
})

// Export actions and reducer
export const { clearPromoCode } = promoCodeSlice.actions

// Selectors
export const selectPromoCodes = (state: RootState) => state.promoCode.promoCodes
export const selectSelectedPromo = (state: RootState) => state.promoCode.selectedPromo
export const selectPromoDiscount = (state: RootState) => state.promoCode.promoDiscount
export const selectDiscountedProducts = (state: RootState) => state.promoCode.discountedProducts
export const selectPromoLoading = (state: RootState) => state.promoCode.loading

export default promoCodeSlice.reducer
