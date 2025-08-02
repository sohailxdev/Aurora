import { Pageable, Sort } from "../Product/type";

export interface ProductImage {
  img_name: string;
  img_url: string;
  img_type: string;
}
export interface ProductImage {
  img_name: string;
  img_url: string;
  img_type: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  productSubheading: string;
  productDescription: string;
  sku: string;
  images: ProductImage[] | null;
  color: string;
  price: number;
  quantity: number;
  size:string;
  remainingQuantity: number; // Nullable field as per JSON
  returns: Returns[];
}

export interface Returns {
  returnId: string;
  returnDate: string;
  appliedQuantity: string;
}
export interface Order {
  orderId: number;
  orderStatus: string;
  orderDate: string;
  deliveredOn: string;
  paymentMethod: string;
  paymentStatus: string;
  orderAmount: number;
  totalitems: number;
  transactionId: string;
  items: OrderItem[];
}

export interface OrderResponse {
  content: Order[];
  pageable?: Pageable;
  last?: boolean;
  totalPages?: number;
  totalElements?: number;
  sort?: Sort;
  numberOfElements?: number;
  first?: boolean;
  size?: number;
  number?: number;
  empty?: boolean;
}
