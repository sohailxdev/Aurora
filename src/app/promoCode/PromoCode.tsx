import { PromoCode } from "./type";

export const isPromoCodeValid = (
  promoCode: PromoCode | null,
  subtotal: number
): boolean => {
  // Check if promo code is active
  if (promoCode) {
    if (!promoCode.status) return false;

    // Check if minimum amount requirement is met
    if (subtotal < promoCode.minimumAmount) return false;
    return true;
  } else {
    return false;
  }
};

export interface DiscountedProduct {
  [key: string]: any;
  promoDiscount?: {
    type: string;
    value: number;
    originalPrice: number;
    discountedPrice: number;
  };
  discount?: {
    valueType: string;
    discountValue: number;
  };
  price: number;
  quantity: number;
}

export const applyPromoCode = async (
  promoCode: PromoCode,
  products: any[]
): Promise<{
  discountedProducts: DiscountedProduct[];
  totalDiscount: number;
}> => {
  let totalDiscount = 0;
  let productsForDiscount = [] as any;

  // Check if minimum amount requirement is met
  const subtotal = products.reduce((sum, product) => {
    let price = product.price * product.quantity;
    // If product has discount, calculate discounted price
    if (product.discount) {
      if (product.discount.valueType === "PERCENTAGE") {
        price = price - (price * product.discount.discountValue) / 100;
      } else {
        price = price - product.discount.discountValue * product.quantity;
      }
    }
    return sum + price;
  }, 0);

  if (subtotal < promoCode.minimumAmount) {
    throw new Error(
      `Minimum order amount of ₹${promoCode.minimumAmount} required`
    );
  }

  // For PERCENTAGE type, only include products without existing discounts
  // For AMOUNT type, include all products
  if (promoCode.valueType === "PERCENTAGE") {
    productsForDiscount = products.filter((p) => !p.discount);

    // If no eligible products for percentage discount
    if (productsForDiscount.length === 0) {
      throw new Error(
        "This percentage promo code cannot be applied to products with existing discounts"
      );
    }
  } else {
    // For AMOUNT type, all products are eligible
    productsForDiscount = products;
  }

  // Apply discount to each product
  const discountedProducts = products.map((product: DiscountedProduct) => {
    // For PERCENTAGE type, skip products with existing discounts
    if (promoCode.valueType === "PERCENTAGE" && product.discount) {
      return product;
    }

    // Calculate original and already discounted prices
    const originalPrice = product.price * product.quantity;
    let currentPrice = originalPrice;

    // If product has a discount, calculate the already discounted price
    if (product.discount) {
      if (product.discount.valueType === "PERCENTAGE") {
        currentPrice =
          originalPrice -
          (originalPrice * product.discount.discountValue) / 100;
      } else if (product.discount.valueType === "AMOUNT") {
        currentPrice =
          originalPrice - product.discount.discountValue * product.quantity;
      }
    }

    // Apply promo discount based on type
    if (promoCode.valueType === "PERCENTAGE") {
      // For PERCENTAGE, apply directly to original price (only for products without discount)
      const discountAmount = (originalPrice * promoCode.value) / 100;
      const discountedPrice = originalPrice - discountAmount;
      totalDiscount += discountAmount;

      return {
        ...product,
        promoDiscount: {
          type: "PERCENTAGE",
          value: promoCode.value,
          originalPrice,
          discountedPrice,
        },
      };
    } else if (promoCode.valueType === "AMOUNT") {
      // For AMOUNT, distribute proportionally based on quantity and price
      const totalEligiblePrice = productsForDiscount.reduce(
        (sum: number, p: any) => {
          let price = p.price * p.quantity;
          // If product has discount, use discounted price
          if (p.discount) {
            if (p.discount.valueType === "PERCENTAGE") {
              price = price - (price * p.discount.discountValue) / 100;
            } else {
              price = price - p.discount.discountValue * p.quantity;
            }
          }
          return sum + price;
        },
        0
      );

      // Calculate proportional discount
      const proportionalDiscount =
        (currentPrice / totalEligiblePrice) * promoCode.value;
      const finalPrice = Math.max(0, currentPrice - proportionalDiscount);
      totalDiscount += currentPrice - finalPrice;

      return {
        ...product,
        promoDiscount: {
          type: "AMOUNT",
          value: proportionalDiscount,
          originalPrice: currentPrice, // Use current price (after regular discount if any)
          discountedPrice: finalPrice,
        },
      };
    }

    return product;
  });

  // Ensure total discount doesn't exceed promo value for AMOUNT type
  if (promoCode.valueType === "AMOUNT") {
    totalDiscount = Math.min(totalDiscount, promoCode.value);
  }

  return {
    discountedProducts,
    totalDiscount,
  };
};
