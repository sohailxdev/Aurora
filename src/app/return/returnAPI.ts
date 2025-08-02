import { BASE_URL } from "@/lib/constant";
import axios from "axios";

export const fetchOrders = async () => {
  try {
    const res = await axios.get(BASE_URL + `/api/orders/customer`);
    if (res.status === 200) {
      return res.data;
    } else {
    }
  } catch (error) {
    if (axios.isAxiosError(error)) throw error?.response?.data;
    else throw "Something went wrong!";
  }
};
