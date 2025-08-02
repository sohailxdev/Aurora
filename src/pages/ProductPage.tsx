import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { ImageModal } from "@/components/Custom/ImageModal";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ProductGrid } from "@/components/Custom/product-grid";
import ProductSpecifications from "@/components/Custom/ProductStats";
import { SizeChartDialog } from "@/components/Custom/SizeChartDialog";
import { useSwipeable } from "react-swipeable";

import {
  addToCart,
  fetchCartAsync,
  selectCartProducts,
} from "@/app/cart/cartSlice";
import { cn, openLoginModal } from "@/lib/utils";
import type { Attribute, ProductById } from "@/app/Product/type";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectUser } from "@/app/User/userSlice";
import {
  addWishlistAsync,
  fetchWishlistAsync,
  removeWishlistAsync,
  selectWishlistProducts,
} from "@/app/wishList/wishlistSlice";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import ShareModal from "@/components/Custom/ShareModal";
import ProductReviews from "@/components/ProductReviews";

export default function ProductPage() {
  const { productId, sku } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSku, setSelectedSku] = useState<Attribute>();
  const [isDiscount, setIsDiscount] = useState(false);
  const [ogPrice, setOgPrice] = useState<string | number>();
  const [selectedFit, setSelectedFit] = useState<string>("Regular"); // Default fit set to "Regular"
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<
    Record<string, string>
  >({});
  const [currentIndex, setCurrentIndex] = useState(0); // Carousel state
  const [overallRating, setOverallRating] = useState<{
    rating: number;
    totalReviews: number;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token") || "";
  const [product, setProduct] = useState<ProductById>({
    productId: "",
    tags: [],
    defaultSku: "",
    name: "",
    subheading: "",
    description: "",
    groupCompanyId: null,
    companyId: null,
    locationId: null,
    branchId: null,
    status: "",
    attributes: [],
    createdDate: "",
    productType: {
      id: "",
      productType: "",
      groupCompanyId: "",
      companyId: "",
      categoryMappingId: "",
    },
    lowStockThreshold: "",
    listOfColors: [],
    listOfSizes: [],
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        BASE_URL + `/api/products/get/${productId}?groupCompanyId=6`
      );
      const result = {
        ...res.data,
        defaultSku: sku ? sku : res.data.defaultSku,
      };
      const uniqueColors = [
        ...new Set(
          result.attributes.map((attr: Attribute) => attr.color || "default")
        ),
      ];
      const uniqueSizes = [
        ...new Set(result.attributes.map((attr: Attribute) => attr.size)),
      ];
      const uniqueFits = [
        ...new Set(
          result.attributes.map((attr: Attribute) => attr.fit || "Regular")
        ),
      ];
      const defaultAttribute = result.attributes.find(
        (d: Attribute) => d.sku === result.defaultSku
      );
      setSelectedSize(defaultAttribute?.size || "");
      setSelectedColor(defaultAttribute?.color || "default");
      setSelectedFit(defaultAttribute?.fit || "Regular");
      setSelectedSku(defaultAttribute);
      setIsDiscount(!!defaultAttribute?.discount);
      setOgPrice(defaultAttribute?.price);
      setProduct({
        ...result,
        listOfColors: uniqueColors,
        listOfSizes: uniqueSizes,
        listOfFits: uniqueFits,
      });
    } catch {
      toast.error("Failed to load product details. Please try again later.");
    }
  };
  const fetchOverallRating = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/reviews/product/${productId}?groupCompanyId=6`
      );
      setOverallRating({
        rating: response.data.overallRating,
        totalReviews: response.data.totalReviews,
      });
    } catch (error) {
      console.error("Error fetching overall rating:", error);
    }
  };

  useEffect(() => {
    fetchData();
    if (productId) {
      fetchOverallRating();
    }
  }, [productId]);

  const wishListItems = useAppSelector(selectWishlistProducts);
  useEffect(() => {
    if ((token || token.length > 0) && !wishListItems) {
      dispatch(fetchWishlistAsync());
    }
  }, [wishListItems]);

  const cartItems = useAppSelector(selectCartProducts);
  useEffect(() => {
    if (!cartItems) {
      if (localStorage.getItem("cart")) {
        dispatch(
          fetchCartAsync(JSON.parse(localStorage.getItem("cart") || ""))
        );
      }
    }
  }, [cartItems]);

  const isInWishlist = wishListItems?.content.find(
    (d) =>
      d.productId == product.productId && d.attributes[0].color == selectedColor
  );

  const filteredSizes = product.attributes
    .filter((attr) => attr.color === selectedColor && attr.fit === selectedFit)
    .map((attr) => attr.size);

  // const [emblaRef, emblaApi] = useEmblaCarousel();
  // const [selectedIndex, setSelectedIndex] = useState(0);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { isAuthenticated } = useAppSelector(selectUser);

  const navigate = useNavigate();

  const openModal = (src: string) => {
    setSelectedImage(src);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const handleAttributeChange = (attributeKey: string, value: string) => {
    setSelectedAttributeValues((prev) => ({
      ...prev,
      [attributeKey]: value,
    }));
    setCurrentIndex(0); // Reset image carousel to first image when attributes change
  };

  const imagesTransform = useTransform(
    scrollYProgress,
    [0, 1],
    ["translateY(0%)", "translateY(0%)"]
  );

  // useEffect(() => {
  //   if (emblaApi) {
  //     emblaApi.on("select", () => {
  //       setSelectedIndex(emblaApi.selectedScrollSnap());
  //     });
  //   }
  // }, [emblaApi]);

  useEffect(() => {
    if (imagesRef.current) {
      const { height } = imagesRef.current.getBoundingClientRect();
      document.body.style.height = `${height}px`;
    }
    return () => {
      document.body.style.height = "auto";
    };
  }, []);

  const dispatch = useAppDispatch();

  const handleSku = (color: string, size: string, fit: string) => {
    setSelectedSku(
      product.attributes.find(
        (d) => d.color === color && d.size === size && d.fit === fit
      )
    );
    setIsDiscount(
      !!product.attributes.find(
        (d) => d.color === color && d.size === size && d.fit === fit
      )?.discount
    );
    setOgPrice(
      product.attributes.find(
        (d) => d.color === color && d.size === size && d.fit === fit
      )?.price
    );
    setQuantity(1);
  };

  const handleSizeChange = (size: string) => {
    // Check if the size is available for the current color and fit
    const isSizeAvailableForColorAndFit = product.attributes.some(
      (attr) =>
        attr.size === size &&
        attr.color === selectedColor &&
        attr.fit === selectedFit
    );

    if (isSizeAvailableForColorAndFit) {
      setSelectedSize(size);
      handleSku(selectedColor, size, selectedFit);
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Check if the current size and fit are available for the new color
    const isSizeAndFitAvailableForColor = product.attributes.some(
      (attr) =>
        attr.size === selectedSize &&
        attr.fit === selectedFit &&
        attr.color === color
    );

    if (!isSizeAndFitAvailableForColor) {
      // Find the first available attribute for this color that matches the current fit if possible
      const availableAttributeWithSameFit = product.attributes.find(
        (attr) => attr.color === color && attr.fit === selectedFit
      );

      if (availableAttributeWithSameFit) {
        setSelectedSize(availableAttributeWithSameFit.size);
        handleSku(color, availableAttributeWithSameFit.size, selectedFit);
      } else {
        // If no attribute with the same fit, find any attribute with this color
        const anyAttributeWithColor = product.attributes.find(
          (attr) => attr.color === color
        );

        if (anyAttributeWithColor) {
          setSelectedSize(anyAttributeWithColor.size);
          setSelectedFit(anyAttributeWithColor.fit);
          handleSku(
            color,
            anyAttributeWithColor.size,
            anyAttributeWithColor.fit
          );
        }
      }
    } else {
      handleSku(color, selectedSize, selectedFit);
    }
  };

  const handleFitChange = (fit: string) => {
    setSelectedFit(fit);

    // Check if the current size is available for the new fit and selected color
    const isSizeAvailableForFitAndColor = product.attributes.some(
      (attr) =>
        attr.size === selectedSize &&
        attr.color === selectedColor &&
        attr.fit === fit
    );

    // If not available, find the first available size for this fit and color
    if (!isSizeAvailableForFitAndColor) {
      const availableAttribute = product.attributes.find(
        (attr) => attr.color === selectedColor && attr.fit === fit
      );

      if (availableAttribute) {
        setSelectedSize(availableAttribute.size);
        handleSku(selectedColor, availableAttribute.size, fit);
      }
    } else {
      // If available, just update the SKU
      handleSku(selectedColor, selectedSize, fit);
    }
  };

  // Carousel navigation
  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % (selectedSku?.imgs?.length || 1));
  };

  const previousImage = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + (selectedSku?.imgs?.length || 1)) %
        (selectedSku?.imgs?.length || 1)
    );
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => previousImage(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const canAddToCart = () => {
    return selectedSize && selectedSku && +selectedSku.quantity > 0;
  };

  const isOutOfStock = () => {
    // Check if the product is out of stock for the current selection
    if (!selectedSku) return true;
    return +selectedSku.quantity === 0;
  };

  // const handleInteractiveClick = (event: React.MouseEvent) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  // };

  const handleAddToCart = async () => {
    if (
      cartItems?.find(
        (a) => a.sku_id == selectedSku?.sku && a.product_id == product.productId
      )
    ) {
      toast.success("Product already added in cart!", {
        duration: 1000,
        position: "top-center",
      });
    } else {
      dispatch(
        addToCart({
          productId: product.productId,
          skuId: selectedSku?.sku,
          quantity: quantity,
          sku_quantity: selectedSku?.quantity,
        })
      );
      toast.success("Product added to cart", {
        duration: 1000,
        position: "top-center",
      });
      await dispatch(
        fetchCartAsync(JSON.parse(localStorage.getItem("cart") || "[]"))
      );
    }
  };

  const getAttributeKeys = (attributes: Attribute[]): string[] => {
    if (!attributes || attributes.length === 0) return [];
    const firstAttr = attributes[0];
    // Filter out keys that are not product attributes (e.g., imgs, quantity, price, sku, title, careInstructions, keyName, videos, discount)
    const nonAttributeKeys = [
      "imgs",
      "quantity",
      "price",
      "sku",
      "title",
      "careInstructions",
      "keyName",
      "videos",
      "discount",
    ];
    return Object.keys(firstAttr).filter(
      (key) => !nonAttributeKeys.includes(key)
    );
  };
  const getUniqueOptions = (attributes: Attribute[], key: string): string[] => {
    const options = new Set<string>();
    attributes.forEach((attr) => {
      if (attr[key as keyof Attribute]) {
        options.add(attr[key as keyof Attribute] as string);
      }
    });
    return Array.from(options).sort(); // Sort options for consistent display
  };

  const getFilteredOptionsForAttribute = (
    currentAttributeKey: string,
    allAttributes: Attribute[],
    currentSelectedValues: Record<string, string>
  ): string[] => {
    const compatibleSkus = allAttributes.filter((sku) => {
      return Object.entries(currentSelectedValues).every(([key, value]) => {
        // Only check other attributes, not the one we are currently filtering options for
        if (key === currentAttributeKey) return true;
        return sku[key as keyof Attribute] === value;
      });
    });
    return getUniqueOptions(compatibleSkus, currentAttributeKey);
  };

  const handleWishList = async (val: string) => {
    try {
      if (!token || token.length == 0) {
        openLoginModal("/category");
      } else if (val == "add") {
        await dispatch(
          addWishlistAsync({
            productId: product.productId,
            color: selectedColor,
          })
        );
        dispatch(fetchWishlistAsync());
      } else {
        await dispatch(
          removeWishlistAsync({
            productId: product.productId,
            color: selectedColor,
          })
        );
        dispatch(fetchWishlistAsync());
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleCheckout = () => {
    try {
      const checkoutData = {
        productId: product.productId,
        skuId: selectedSku?.sku,
        quantity: quantity,
        sku_quantity: selectedSku?.quantity,
      };

      sessionStorage.setItem("checkoutProduct", JSON.stringify([checkoutData]));

      const urlObject = new URL(window.location.href);
      urlObject.searchParams.set("source", "direct");
      window.history.replaceState(null, "", urlObject.toString());

      if (isAuthenticated) {
        navigate("/user/checkout?source=direct");
        return;
      } else {
        openLoginModal("/user/checkout?source=direct");
      }
    } catch {
      toast.error("Something went wrong.");
      return;
    }
  };

  const handleNotify = async () => {
    try {
      // await axios.post(BASE_URL + "/api/notify", {
      //   productId: product.productId,
      //   skuId: selectedSku.sku,
      // });
      toast.success("We will notify you when product is available", {
        duration: 1000,
        position: "top-center",
      });
    } catch {
      toast.error("Something went wrong!");
    }
  };

  const StarRating = ({
    rating,
    size = "w-4 h-4",
  }: {
    rating: number;
    size?: string;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const attributeKeys = useMemo(() => {
    return product ? getAttributeKeys(product.attributes) : [];
  }, [product]);

  return (
    <div ref={containerRef} className="p-2 bg-white">
      <div className=" mx-auto lg:px-4 px-2 lg:py-8 py-0">
        <div className="flex flex-col-reverse sm:grid sm:grid-cols-1 sm:gap-8 lg:grid-cols-2">
          {/* Left: Scrollable Image Gallery */}
          <>
            <motion.div
              ref={imagesRef}
              style={{ transform: imagesTransform }}
              className="relative hidden sm:block "
            >
              <span className="absolute z-20 top-4 right-4">
                <ShareModal />
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedSku?.imgs?.map((img, i) => (
                  <motion.div
                    key={i}
                    className="relative border aspect-[3/4] w-full overflow-hidden rounded-lg cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentIndex(i);
                      openModal(img.img_url);
                    }}
                  >
                    <LazyLoadImage
                      effect="blur"
                      key={i}
                      src={img.img_url || "/placeholder.svg"}
                      alt={`products image ${i + 1}`}
                      className="object-cover  w-full h-full"
                      wrapperProps={{
                        style: { transitionDelay: "0.2s", minWidth: "100%" },
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <ImageModal
              isOpen={!!selectedImage}
              onClose={closeModal}
              images={selectedSku?.imgs || []}
              initialIndex={currentIndex}
            />
          </>
          <motion.div
            ref={imagesRef}
            style={{ transform: imagesTransform }}
            className="relative block sm:hidden lg:w-1/2 order-1 lg:order-1"
          >
            <span className="absolute z-20 top-4 right-4">
              <ShareModal />
            </span>
            <div className="relative aspect-[3/4]">
              {/* Navigation Buttons */}

              {/* Main Image */}
              <div
                {...swipeHandlers}
                className="relative w-full h-full overflow-hidden rounded-2xl group cursor-pointer"
                onClick={() =>
                  openModal(selectedSku?.imgs?.[currentIndex]?.img_url || "")
                }
              >
                <LazyLoadImage
                  effect="blur"
                  src={
                    selectedSku?.imgs?.[currentIndex]?.img_url ||
                    "/placeholder.svg"
                  }
                  alt={`Product image ${currentIndex + 1}`}
                  className="object-cover w-full h-full transition-all duration-300 group-hover:scale-110"
                  wrapperProps={{
                    style: { transitionDelay: "0.2s", minWidth: "100%" },
                  }}
                />
              </div>
            </div>

            {/* Thumbnail Previews */}
            <div className="flex justify-center gap-3 mb-5 sm:gap-4 mt-6">
              {selectedSku?.imgs?.slice(0, 5).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                    currentIndex === index
                      ? "ring-2 ring-black"
                      : "hover:ring-1 hover:ring-gray-200"
                  }`}
                >
                  <LazyLoadImage
                    effect="blur"
                    src={img.img_url || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                    wrapperProps={{
                      style: { transitionDelay: "0.2s", minWidth: "100%" },
                    }}
                  />
                </button>
              ))}
            </div>

            <ImageModal
              isOpen={!!selectedImage}
              onClose={closeModal}
              images={selectedSku?.imgs || []}
              initialIndex={currentIndex}
            />
          </motion.div>
          {/* Right: Sticky products Details */}
          <div className="lg:sticky  font-opensans lg:top-36 lg:h-fit container mx-auto">
            <div className="space-y-3">
              {/* products Title & Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-5xl tracking-tighter  font-cursive">
                    {selectedSku?.title || product.name}
                  </h1>
                  <Heart
                    size={26}
                    fill="none"
                    stroke="currentColor"
                    aria-label="Add to wishlist"
                  />
                </div>
                <p className="text-3xl text-justify pr-9 text-gray-400 font-cursive tracking-normal">
                  {product.subheading}
                </p>
                {/* Price */}
                <div className="flex items-center  font-cursive gap-3">
                  {isDiscount && (
                    <s className="font-bold text-2xl">₹{ogPrice}</s>
                  )}
                  <span className="font-bold  text-2xl">
                    ₹
                    {(() => {
                      const discountTypePercentage =
                        selectedSku?.discount?.valueType === "PERCENTAGE";

                      const isDiscountAvailable = !!selectedSku?.discount;

                      const newPriceForPercentage = isDiscountAvailable
                        ? discountTypePercentage
                          ? Math.ceil(
                              selectedSku.price -
                                (selectedSku.price *
                                  selectedSku.discount.discountValue) /
                                  100
                            )
                          : Math.ceil(
                              selectedSku.price -
                                selectedSku.discount.discountValue
                            )
                        : selectedSku?.price;

                      return newPriceForPercentage;
                    })()}
                  </span>
                  {isDiscount && selectedSku?.discount && (
                    <span className=" text-green-600 font-bold text-2xl">
                      {selectedSku.discount.valueType === "PERCENTAGE"
                        ? `${selectedSku.discount.discountValue}% off`
                        : `₹${selectedSku.discount.discountValue} off`}
                    </span>
                  )}
                </div>
              </div>

              {attributeKeys.map((key) => {
                const uniqueOptions = getUniqueOptions(product.attributes, key);
                const filteredOptions = getFilteredOptionsForAttribute(
                  key,
                  product.attributes,
                  selectedAttributeValues
                );

                const formattedKey = key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase());

                return (
                  <div key={key}>
                    {uniqueOptions.length === 1 ? (
                      // Render as a simple bullet point if only one option
                      <div className="flex items-center gap-2 ">
                        <span className="text-lg">•</span>
                        <p className="font-medium">
                          {formattedKey}: {uniqueOptions[0]}
                        </p>
                      </div>
                    ) : (
                      // Render as buttons if multiple options
                      <>
                        <p className="mb-2 font-medium ">
                          Select {formattedKey}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {uniqueOptions.map((option, i) => {
                            const isSelected =
                              selectedAttributeValues[key] === option;
                            const isDisabled =
                              !filteredOptions.includes(option);

                            return (
                              <Button
                                key={i}
                                variant={isSelected ? "default" : "outline"}
                                onClick={() =>
                                  handleAttributeChange(key, option)
                                }
                                className={cn(
                                  "min-w-[4rem] ",
                                  isSelected &&
                                    "bg-white text-black hover:bg-white/90",
                                  !isSelected &&
                                    "border-gray-600 hover:bg-gray-800",
                                  isDisabled &&
                                    "opacity-50 cursor-not-allowed border-dashed border-gray-700 text-gray-500 line-through"
                                )}
                                disabled={isDisabled}
                              >
                                {option}
                              </Button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Quantity */}
              <div>
                <p className="mb-2 font-medium text-">Quantity</p>
                <div className="flex items-center gap-2 ">
                  {+(selectedSku?.quantity ?? 0) == 0 ? (
                    <span className="text-destructive font-medium text-lg">
                      Out of stock
                    </span>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[3rem] text-center text-">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        disabled={+(selectedSku?.quantity ?? 0) <= +quantity}
                        onClick={() => {
                          setQuantity(quantity + 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                {+(selectedSku?.quantity ?? 0) == 0 ? (
                  ""
                ) : +(selectedSku?.quantity ?? 0) <= 7 &&
                  +(selectedSku?.quantity ?? 0) != quantity ? (
                  <p className="text-destructive font-medium">
                    Only few items left
                  </p>
                ) : +(selectedSku?.quantity ?? 0) === 1 ? (
                  <p className="text-destructive font-medium">
                    Only 1 stock left
                  </p>
                ) : +(selectedSku?.quantity ?? 0) <= quantity ? (
                  <p className="text-destructive font-medium">
                    No more stock left!
                  </p>
                ) : (
                  ""
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    if (canAddToCart()) handleAddToCart();
                    else if (isOutOfStock()) handleNotify();
                  }}
                  className="flex-1"
                  variant="outline"
                  disabled={!selectedColor || !selectedSize || !selectedFit}
                >
                  {isOutOfStock() ? "Notify Me" : "Add to Cart"}
                </Button>
                {+(selectedSku?.quantity ?? 0) > 0 && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      if (canAddToCart()) handleCheckout();
                      else if (isOutOfStock()) handleNotify();
                    }}
                    disabled={!selectedColor || !selectedSize || !selectedFit}
                  >
                    {isOutOfStock() ? "Notify Me" : "Buy Now"}
                  </Button>
                )}
              </div>

              {/* Product Details Accordion */}
              <Card className="divide-y ">
                <div className="p-4">
                  <h3 className="font-medium ">Description</h3>
                  <p
                    className="mt-2 text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <ProductSpecifications /> */}
      <div className="container mx-auto mb-10">
        <div className="font-semibold font-opensans m-4 text-xl text-white">
          You may also like ⟶
        </div>

        <ProductGrid />
      </div>

      {overallRating && overallRating.totalReviews > 0 && (
        <ProductReviews productId={productId || ""} />
      )}
    </div>
  );
}
