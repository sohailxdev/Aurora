export type ProductResponse = {
  content: Product[];
  wishListProds?: string[];
  pageable?: Pageable;
  last?: boolean;
  totalPages?: string;
  totalElements?: string;
  sort?: Sort;
  numberOfElements?: string;
  first?: boolean;
  size?: string;
  number?: string;
  empty?: boolean;
};

export interface Product {
  productId: string;
  tags: string | null;
  defaultSku: string;
  sku: string;
  name: string;
  subheading: string;
  description: string;
  groupCompanyId: string;
  companyId: string;
  locationId: string;
  branchId: string;
  attributes: Attribute[];
  createdDate: string;
  productType: ProductType;
  productTypeId: string;
  productTypeName: string;
}

export type Discount = {
  status: boolean;
  valueType: string;
  discountId: string;
  discountOn: string;
  discountName: string;
  discountValue: number;
};
export type Offer = {
  buyQuantity: number;
  getQuantity: number;
  selectAll: boolean;
  status: boolean;
  name: string;
};

export type Attribute = {
  imgs: Image[];
  title: string;
  size: string;
  color: string;
  price: number;
  ogPrice: number;
  sku: string;
  variation_id: string;
  quantity: string;
  sku_quantity: string;
  discount: Discount;
  offer: Offer;
  fit: string;
};

export type Image = {
  img_Id: string;
  img_url: string;
  img_name: string;
  img_type: string;
};

export interface ProductType {
  id: string;
  productType: string;
  groupCompanyId: string;
  companyId: string;
  categoryMappingId: string;
  name: string;
  price: number;
  quantity: number;
  sku_quantity: number;
  image: string;
  sku: string;
  color: string;
  size: string;
  fit: string;
  discount: Discount;
  offer: Offer;
  promoDiscount?: {
    type: "PERCENTAGE" | "AMOUNT";
    value: number;
    originalPrice: number;
    discountedPrice: number;
  };
}

export type Pageable = {
  sort: Sort;
  pageNumber: string;
  pageSize: string;
  offset: string;
  unpaged: boolean;
  paged: boolean;
};

export type Sort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export interface ProductById {
  productId: string;
  tags: string[];
  defaultSku: string;
  name: string;
  subheading: string;
  description: string;
  groupCompanyId: string | null;
  companyId: string | null;
  locationId: string | null;
  branchId: string | null;
  status: string;
  attributes: Attribute[];
  createdDate: string;
  productType: {
    id: string;
    productType: string;
    groupCompanyId: string;
    companyId: string;
    categoryMappingId: string;
  };
  lowStockThreshold: string | null;
  listOfColors: string[];
  listOfSizes: string[];
}
