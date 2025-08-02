import { BASE_URL } from "@/lib/constant";
import axios from "axios";

export const addToWishList = async ({
  productId,
  color,
}: {
  productId: string;
  color: string;
}) => {
  try {
    const res = await axios.post(
      BASE_URL + `/api/wishlist/add?productId=${productId}&color=${color}`
    );
    if (res.status === 200) {
      return res.data;
    } else {
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};

export const fetchWishlistItems = async (attribute: string) => {
  try {
    const res = await axios.get(
      attribute
        ? `${BASE_URL}/api/wishlist/list${attribute}`
        : `${BASE_URL}/api/wishlist/list`
    );
    if (res.status === 200) {
      return res.data;
    } else {
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};

export const removeFromWishList = async ({
  productId,
  color,
}: {
  productId: string;
  color: string;
}) => {
  try {
    const res = await axios.delete(
      BASE_URL + `/api/wishlist/remove?productId=${productId}&color=${color}`
    );
    if (res.status === 200) {
      return res.data;
    } else {
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};
