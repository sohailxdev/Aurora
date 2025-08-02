import { Discount } from "@/app/Product/type";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const openLoginModal = (redirectTo: string) => {
  const urlObject = new URL(window.location.href);

  // Set auth=login to open modal
  urlObject.searchParams.set("auth", "login");

  // Ensure the redirect path is only encoded once
  urlObject.searchParams.set("redirect", redirectTo);

  // Update the URL properly
  window.history.pushState({}, "", urlObject.toString());
};

export const closeLoginModal = () => {
  const currentUrl = new URL(window.location.href);

  // Remove login modal params
  currentUrl.searchParams.delete("auth");
  currentUrl.searchParams.delete("redirect");

  window.history.pushState({}, "", currentUrl.toString());
};

export const calculateDiscountedPrice = (price: number, discount: Discount) => {
  if (!discount) return price;
  if (discount.valueType === "PERCENTAGE") {
    return Math.ceil(price - (price * discount.discountValue) / 100);
  } else if (discount.valueType === "AMOUNT") {
    return Math.ceil(price - discount.discountValue);
  }
  return price;
};
