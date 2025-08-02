import { useState, useEffect, useRef } from "react";
import { ProductCard } from "./product-card";
import {
  fetchProductAsync,
  selectProductEntity,
  selectProductLoading,
  sortedProduct,
} from "@/app/Product/productSlice";
import { Attribute, Image, Product, ProductResponse } from "@/app/Product/type";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { ProductCardSkeleton } from "./product-card-skeleton";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export interface ProductCardI extends Product {
  productId: string;
  attribute: Attribute[];
  name: string;
  type: string;
  brand: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  images: string[];
  colors: string[];
  subheading: string;
  desc: string;
}
export interface ExtractedProductData extends Product {
  type: string;
  originalPrice: number;
  images: Image[];
  colors: string[];
  size: string[];
}

export const extractProductData = (
  data: ProductResponse
): ExtractedProductData[] => {
  const d = data?.content?.map((product) => {
    const highestPrice = Math.max(
      ...product.attributes.map((attr) => +attr.price)
    );

    // Flatten images
    const allImages = product.attributes.flatMap((attr) =>
      attr.imgs.map((img) => ({
        ...img,
        sku: attr.sku, // Attach SKU for sorting later
      }))
    );

    // Remove duplicate images by image_id
    const uniqueImagesMap = new Map();

    // First, add images where SKU matches defaultSku
    product.attributes.forEach((attr) => {
      if (attr.sku === product.defaultSku) {
        attr.imgs.forEach((img) => {
          uniqueImagesMap.set(img.img_Id, { ...img, sku: attr.sku });
        });
      }
    });

    // Then, add remaining images normally
    allImages.forEach((img) => {
      if (!uniqueImagesMap.has(img.img_Id)) {
        uniqueImagesMap.set(img.img_Id, img);
      }
    });

    const uniqueImages = Array.from(uniqueImagesMap.values());

    // Check if defaultSku is present in any attribute's SKU
    const defaultSkuExists = product.attributes.some(
      (attr) => attr.sku === product.defaultSku
    );

    return {
      ...product,
      type: product.productTypeName,
      originalPrice: highestPrice,
      discountedPrice: Math.min(
        ...product.attributes.map((attr) => {
          const discountTypePercentage =
            attr.discount?.valueType === "PERCENTAGE";

          const isDiscountAvailable = !!attr.discount;

          return isDiscountAvailable
            ? discountTypePercentage
              ? Math.ceil(
                  attr.price - (attr.price * attr.discount.discountValue) / 100
                )
              : Math.ceil(attr.price - attr.discount.discountValue)
            : attr.price;
        })
      ),
      discountPercentage: (
        ((highestPrice -
          Math.min(
            ...product.attributes.map((attr) => {
              const discountTypePercentage =
                attr.discount?.valueType === "PERCENTAGE";

              const isDiscountAvailable = !!attr.discount;

              return isDiscountAvailable
                ? discountTypePercentage
                  ? Math.ceil(
                      attr.price -
                        (attr.price * attr.discount.discountValue) / 100
                    )
                  : Math.ceil(attr.price - attr.discount.discountValue)
                : attr.price;
            })
          )) /
          highestPrice) *
        100
      ).toFixed(2),
      images: uniqueImages,
      defaultSku: defaultSkuExists
        ? product.defaultSku
        : product.attributes[0].sku,
      colors: Array.from(new Set(product.attributes.map((attr) => attr.color))),
      size: [
        ...new Set(product.attributes.map((attr: Attribute) => attr.size)),
      ],
      attributes: product.attributes.map((attr) => {
        const discountTypePercentage =
          attr.discount?.valueType === "PERCENTAGE";

        const isDiscountAvailable = !!attr.discount;

        const newPriceForPercentage = isDiscountAvailable
          ? discountTypePercentage
            ? (attr.discount.discountValue > attr.price
                ? attr.price
                : attr.price - (attr.price * attr.discount.discountValue) / 100
              )?.toFixed(2)
            : (attr.discount.discountValue > attr.price
                ? attr.price
                : attr.price - attr.discount.discountValue
              )?.toFixed(2)
          : attr.price;

        return {
          ...attr,
          price: newPriceForPercentage,
          ogPrice: attr.price,
          discount: attr.discount ? attr.discount : 0,
        };
      }),
    };
  });
  return d as ExtractedProductData[];
};

export function ProductGrid() {
  const loading = useAppSelector(selectProductLoading);
  const product = useAppSelector(selectProductEntity);
  const ITEMS_PER_PAGE = Number(
    useAppSelector(selectProductEntity)?.content.length
  );
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [visibleProducts, setVisibleProducts] = useState<
    ExtractedProductData[]
  >([]);
  const params = useLocation().search;
  const pathname = useLocation().pathname;
  const apiCheck = decodeURIComponent(params);
  const attribute = apiCheck.split("=");

  // Refs for scroll restoration
  const scrollPositionRef = useRef(0);
  const hasRestoredScroll = useRef(false);
  const productGridRef = useRef(null);
  const scrollListenerActive = useRef(true);

  // Create a unique key for this page
  const scrollPositionKey = `scroll-position-${pathname}${params}`;

  // Function to save scroll position to both sessionStorage and localStorage
  const saveScrollPosition = () => {
    scrollPositionRef.current = window.scrollY;
    sessionStorage.setItem(
      scrollPositionKey,
      scrollPositionRef.current.toString()
    );
    localStorage.setItem(
      scrollPositionKey,
      scrollPositionRef.current.toString()
    );
  };

  // Function to restore scroll position
  const restoreScrollPosition = () => {
    if (hasRestoredScroll.current) return;

    // Try localStorage first (persists through refresh), then sessionStorage (persists only in session)
    const savedPosition =
      localStorage.getItem(scrollPositionKey) ||
      sessionStorage.getItem(scrollPositionKey);

    if (savedPosition && visibleProducts.length > 0) {
      // Temporarily disable scroll listener to prevent interference
      scrollListenerActive.current = false;

      setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedPosition),
          behavior: "instant", // Use instant instead of smooth for more accurate restoration
        });
        hasRestoredScroll.current = true;

        // Re-enable scroll listener after a short delay
        setTimeout(() => {
          scrollListenerActive.current = true;
        }, 100);
      }, 150); // Slightly longer delay to ensure DOM is fully rendered
    }
  };

  // Save scroll position periodically with throttling
  const throttledSaveScroll = () => {
    let lastSave = 0;
    const throttleTime = 500; // Save at most every 500ms

    return () => {
      const now = Date.now();
      if (now - lastSave >= throttleTime) {
        saveScrollPosition();
        lastSave = now;
      }
    };
  };

  const throttledSave = useRef(throttledSaveScroll());

  // Add this useEffect to clear localStorage when the session ends
  useEffect(() => {
    // Function to handle session end (tab/window closing)
    const handleSessionEnd = () => {
      // Clear only localStorage entries related to scroll positions
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("scroll-position-")) {
          localStorage.removeItem(key);
        }
      });
    };

    // Listen for beforeunload but with a check to identify actual session closing
    // vs just a refresh
    const handleBeforeUnload = () => {
      // Store a timestamp to detect rapid reopening (refresh)
      sessionStorage.setItem("lastSessionClose", Date.now().toString());

      // We'll clear localStorage on session end
      handleSessionEnd();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check on mount if this is a new session or just a refresh
    const lastClose = sessionStorage.getItem("lastSessionClose");
    const now = Date.now();

    // If lastClose exists and the difference is more than 5 seconds,
    // consider the previous session closed properly
    if (lastClose && now - parseInt(lastClose) > 5000) {
      // This is a genuinely new session, not a refresh
      // Clear any previous localStorage entries
      handleSessionEnd();
    }

    return () => {
      // Cleanup
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const fetchProduct = async (attribute: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        attribute
          ? `${BASE_URL}/api/products/6${attribute}`
          : `${BASE_URL}/api/products/6`
      );
      if (res.status === 200) {
        return dispatch(sortedProduct(res.data));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) throw error?.response?.data;
      else throw "Something went wrong!";
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reset the restored flag when URL changes
    hasRestoredScroll.current = false;

    if (attribute[0] === "?query") {
      fetchProduct(`/search?query=${attribute[1]}`);
    } else if (attribute[0] === "?sortBy") {
      fetchProduct(`/filter${params}`);
    } else if (attribute[0].length >= 1) {
      fetchProduct(`/filter${params}&page=0`);
    } else {
      fetchProduct("?page=0");
    }

    // Save position before URL changes
    return () => {
      saveScrollPosition();
    };
  }, [apiCheck]);

  // useEffect(() => {
  //   if (product) {
  //     setVisibleProducts(extractProductData(product)?.slice(0, ITEMS_PER_PAGE));
  //   }
  // }, [product]);

  useEffect(() => {
    if (product) {
      // If filters are applied (params present), merge attributes for same productId
      if (params && params.length > 0) {
        const mergedContent = product.content.map((prod, _, arr) => {
          const allAttrs = arr
            .filter((p) => p.productId === prod.productId)
            .flatMap((p) => p.attributes);

          // Set defaultSku to the sku of the first attribute (if exists)
          const newDefaultSku =
            allAttrs.length > 0 ? prod.attributes[0].sku : prod.defaultSku;

          return {
            ...prod,
            attributes: allAttrs,
            defaultSku: newDefaultSku,
          };
        });

        const mergedProductResponse: ProductResponse = {
          ...product,
          content: mergedContent,
        };

        setVisibleProducts(
          extractProductData(mergedProductResponse)?.slice(0, ITEMS_PER_PAGE)
        );
      } else {
        // No filters, show normal product
        setVisibleProducts(
          extractProductData(product)?.slice(0, ITEMS_PER_PAGE)
        );
      }
    }
  }, [product]);

  useEffect(() => {
    if (visibleProducts.length > 0) {
      restoreScrollPosition();
    }
  }, [visibleProducts]);

  // Handle page visibility changes (for when user returns to the tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When tab becomes visible again, we might want to restore position
        if (visibleProducts.length > 0 && !hasRestoredScroll.current) {
          restoreScrollPosition();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [visibleProducts]);

  // Save scroll position on page reload/beforeunload (separate from session ending)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      saveScrollPosition(); // Save on unmount as well
    };
  }, []);

  const handleScroll = () => {
    // Skip if scroll listener is temporarily disabled
    if (!scrollListenerActive.current) return;

    // Save scroll position periodically during scrolling
    throttledSave.current();

    // Handle infinite scrolling
    if (isLoading || !product) return;

    const lastPage = product.last === true;
    const bottomReached =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 500;
    if (bottomReached && !lastPage) {
      setIsLoading(true);
      loadMoreItems();
    }
  };

  // Update loading state when product changes
  useEffect(() => {
    setIsLoading(false);
  }, [product]);

  const loadMoreItems = async () => {
    if (!product) return;

    const page = product.pageable?.pageNumber ?? 0;
    const lastPage = product.last === true;
    const nextPage = +page + 1;

    // Don't proceed if we're on the last page
    if (lastPage) {
      return;
    }

    const key = attribute?.[0];
    const value = attribute?.[1];

    // Determine API endpoint based on query type
    let endpoint = "";
    if (key === "?query") {
      endpoint = `/search?query=${value}&page=${nextPage}`;
    } else if (key && key.length >= 1) {
      endpoint = `/filter${params}&page=${nextPage}`;
    } else {
      endpoint = `?page=${nextPage}`;
    }

    // Fetch more data
    await dispatch(fetchProductAsync(endpoint));
  };

  useEffect(() => {
    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, [product, isLoading]);

  return (
    <>
      <div
        ref={productGridRef}
        className="max-w-7xl relative container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        {visibleProducts?.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <DotLottieReact
              className="w-60 mx-auto my-auto h-60"
              src="/bnjWHaOEjk.lottie"
              loop
              autoplay
            />
            <p className="text-xl font-bold">No products found.</p>
          </div>
        )}

        {visibleProducts?.map((product, index) => (
          <ProductCard
            key={`product-${product.productId}-${index}`}
            {...product}
          />
        ))}

        {/* Show skeletons at the bottom only when loading more */}
        {(loading || isLoading) && (
          <>
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={`pagination-loading-${index}`} />
            ))}
          </>
        )}
      </div>
    </>
  );
}
