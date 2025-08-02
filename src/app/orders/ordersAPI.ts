import { BASE_URL } from "@/lib/constant";
import axios from "axios";
import { Order, OrderItem } from "./types";

export const fetchOrders = async (params: number) => {
  try {
    const res = await axios.get(
      BASE_URL + `/api/orders/customer?page=${params}`
    );
    if (res.status === 200) {
      return {
        ...res.data,
        content: res.data.content.map((order: Order) => ({
          ...order,
          items: order.items.map((item: OrderItem) => ({
            ...item,
            remainingQuantity: item.remainingQuantity ?? item.quantity,
          })),
        })),
      };
    } else {
      throw new Error("Unexpected response status");
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};
