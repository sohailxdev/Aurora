import { Discount, Offer } from "../Product/type";

export interface ProductImage {
  img_Id: string;
  img_url: string;
  img_name: string;
  img_type: string;
}

export interface ProductAttribute {
  fit: string;
  sku: string;
  title: string;
  imgs: ProductImage[];
  size: string;
  color: string;
  price: string;
  pattern: string;
  quantity: string;
  cart_quantity: string;
  discount: Discount;
  offer: Offer;
}

export interface ProductType {
  categoryMappingId: string;
  companyId: string;
  groupCompanyId: string;
  id: string;
  productType: string;
}

export interface CartProductDetails {
  product_id: string;
  branchId: string;
  groupCompanyId: string;
  description: string;
  tags: string[];
  defaultSku: string;
  companyId: string;
  createdDate: string;
  locationId: string;
  name: string;
  attributes: ProductAttribute[];
  subheading: string;
  productType: ProductType;
  status: string;
  sku_id: string;
  sku: string;
}

export interface CartProduct {
  quantity: string;
  user_id: string;
  product_id: string;
  sku_id: string;
  id: string;
  product_details: CartProductDetails;
}
export interface CartItems {
  product_details: CartProductDetails;
  // matchedItems: { product_details: CartProductDetails }[];
  // unmatchedItems: { productId: string; skuId: string }[];
}
