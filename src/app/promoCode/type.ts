export interface PromoCode {
  id: number | string;
  promoName: string;
  description: string;
  valueType: "PERCENTAGE" | "AMOUNT";
  value: number;
  minimumAmount: number;
  isVisible: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: boolean;
  selectAll: boolean;
  promoOn: "CATEGORY" | "PRODUCT" | "SHIPPING" | "USER_SEGMENT";
}

export interface Pageable {
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PromoCodeResponse {
  content: PromoCode[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}
