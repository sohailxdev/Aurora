import type React from "react";
import { useEffect, useState } from "react";
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, openLoginModal } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  addToCart,
  fetchCartAsync,
  selectCartProducts,
} from "@/app/cart/cartSlice";
import type { ExtractedProductData } from "./product-grid";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  addWishlistAsync,
  fetchWishlistAsync,
  removeWishlistAsync,
  selectWishlistProducts,
} from "@/app/wishList/wishlistSlice";
import { toast } from "sonner";
import type { Attribute } from "@/app/Product/type";
import { useSwipeable } from "react-swipeable";

interface SelectImageType {
  img_Id: string;
  img_name: string;
  img_type: string;
  img_url: string;
}

export function ProductCard(product: ExtractedProductData) {
  const { name, images, colors, subheading } = product;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [selectedColor, setSelectedColor] = useState<string>();
  const token = localStorage.getItem("token") || "";
  const [selectedImages, setSelectedImages] = useState<SelectImageType[]>();
  const [selectedPrice, setSelectedPrice] = useState<string | number>();
  const [isDiscount, setIsDiscount] = useState(false);
  const [ogPrice, setOgPrice] = useState<string | number>();
  const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(
    null
  );
  const navigate = useNavigate();
  const [discountBadge, setDiscountBadge] = useState<{
    value: number;
    type: string;
  } | null>(null);
  const [offerBadge, setOfferBadge] = useState<{
    name: string;
    getQuantity: number;
    buyQuantity: number;
  } | null>(null);

  const dispatch = useAppDispatch();
  const wishListItems = useAppSelector(selectWishlistProducts);
  const isInWishlist = wishListItems?.content.find(
    (d) =>
      d.productId == product.productId && d.attributes[0].color == selectedColor
  );

  useEffect(() => {
    if ((token || token.length > 0) && !wishListItems) {
      dispatch(fetchWishlistAsync());
    }
  }, [wishListItems, dispatch]);

  const cartItems = useAppSelector(selectCartProducts);

  // Initialize with default SKU
  useEffect(() => {
    const defaultAttribute = product.attributes?.find(
      (attr) => attr.sku === product.defaultSku
    );

    if (defaultAttribute) {
      setSelectedAttribute(defaultAttribute);
      setSelectedSize(defaultAttribute.size);
      setSelectedColor(defaultAttribute.color);
      setSelectedPrice(defaultAttribute.price);
      setOgPrice(defaultAttribute.ogPrice);
      setIsDiscount(!!defaultAttribute.discount);

      if (defaultAttribute.discount && !defaultAttribute.offer) {
        setDiscountBadge({
          value: defaultAttribute.discount.discountValue,
          type: defaultAttribute.discount.valueType,
        });
      } else {
        setDiscountBadge(null);
      }

      if (defaultAttribute.offer) {
        setOfferBadge({
          name: defaultAttribute.offer.name,
          buyQuantity: defaultAttribute.offer.buyQuantity,
          getQuantity: defaultAttribute.offer.getQuantity,
        });
      } else {
        setOfferBadge(null);
      }

      // Set images for default SKU
      const uniqueImagesMap = new Map();
      product.attributes.forEach((attr) => {
        if (attr.color === defaultAttribute.color) {
          attr.imgs.forEach((img) => {
            uniqueImagesMap.set(img.img_Id, { ...img, sku: attr.sku });
          });
        }
      });

      setSelectedImages(Array.from(uniqueImagesMap.values()));
    }
  }, [product]);

  const handleColorSelection = (color: string) => {
    // Find attributes with the selected color
    const attributesWithColor = product.attributes.filter(
      (attr) => attr.color === color
    );

    if (attributesWithColor.length === 0) return;

    // Check if the current selected size exists in the new color
    const sameSize = attributesWithColor.find(
      (attr) => attr.size === selectedSize
    );

    // Select either the same size or the first available size
    const newSelectedAttribute = sameSize || attributesWithColor[0];

    setSelectedAttribute(newSelectedAttribute);
    setSelectedSize(newSelectedAttribute.size);
    setSelectedColor(color);
    setSelectedPrice(newSelectedAttribute.price);
    setOgPrice(newSelectedAttribute.ogPrice);
    setIsDiscount(!!newSelectedAttribute.discount);

    if (newSelectedAttribute.discount && !newSelectedAttribute.offer) {
      setDiscountBadge({
        value: newSelectedAttribute.discount.discountValue,
        type: newSelectedAttribute.discount.valueType,
      });
    } else {
      setDiscountBadge(null);
    }
    if (newSelectedAttribute.offer) {
      setOfferBadge({
        name: newSelectedAttribute.offer.name,
        buyQuantity: newSelectedAttribute.offer.buyQuantity,
        getQuantity: newSelectedAttribute.offer.getQuantity,
      });
    } else {
      setOfferBadge(null);
    }
    // Update images for the selected color
    const uniqueImagesMap = new Map();
    attributesWithColor.forEach((attr) => {
      attr.imgs.forEach((img) => {
        uniqueImagesMap.set(img.img_Id, { ...img, sku: attr.sku });
      });
    });

    setSelectedImages(Array.from(uniqueImagesMap.values()));
  };

  const handleSizeSelection = (size: string) => {
    // Find the attribute with the selected color and size
    const newSelectedAttribute = product.attributes.find(
      (attr) => attr.color === selectedColor && attr.size === size
    );

    if (!newSelectedAttribute) return;

    setSelectedAttribute(newSelectedAttribute);
    setSelectedSize(size);
    setSelectedPrice(newSelectedAttribute.price);
    setOgPrice(newSelectedAttribute.ogPrice);
    setIsDiscount(!!newSelectedAttribute.discount);

    if (newSelectedAttribute.discount && !newSelectedAttribute.offer) {
      setDiscountBadge({
        value: newSelectedAttribute.discount.discountValue,
        type: newSelectedAttribute.discount.valueType,
      });
    } else {
      setDiscountBadge(null);
    }
    if (newSelectedAttribute.offer) {
      setOfferBadge({
        name: newSelectedAttribute.offer.name,
        buyQuantity: newSelectedAttribute.offer.buyQuantity,
        getQuantity: newSelectedAttribute.offer.getQuantity,
      });
    } else {
      setOfferBadge(null);
    }
  };

  const nextImage = () => {
    setDirection("right");
    setCurrentImageIndex((prev) => {
      const imagesArray =
        selectedImages && selectedImages.length > 0 ? selectedImages : images;
      return (prev + 1) % imagesArray.length;
    });
  };

  const prevImage = () => {
    setDirection("left");
    setCurrentImageIndex((prev) => {
      const imagesArray =
        selectedImages && selectedImages.length > 0 ? selectedImages : images;
      return (prev - 1 + imagesArray.length) % imagesArray.length;
    });
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => nextImage(),
    onSwipedRight: () => prevImage(),
    trackMouse: true, // Allows mouse dragging as swipe
  });

  const handleInteractiveClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleAddToCart = async () => {
    if (!selectedAttribute) return;

    try {
      dispatch(
        addToCart({
          productId: product.productId,
          skuId: selectedAttribute.sku,
          quantity: 1,
          sku_quantity: selectedAttribute.quantity,
        })
      );

      if (
        cartItems &&
        cartItems.find((item) => item.sku_id == selectedAttribute.sku)
      ) {
        toast.info("Product already in cart", {
          duration: 1000,
          position: "top-center",
        });

        return;
      } else {
        await dispatch(
          fetchCartAsync(JSON.parse(localStorage.getItem("cart") || ""))
        );
        toast.success(`Product added to cart`, {
          duration: 1000,
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleWishList = async (val: string) => {
    try {
      if (!token || token.length == 0) {
        openLoginModal("/category");
      } else if (val == "add") {
        await dispatch(
          addWishlistAsync({
            productId: product.productId,
            color: selectedColor ?? "",
          })
        );
        dispatch(fetchWishlistAsync());
      } else {
        await dispatch(
          removeWishlistAsync({
            productId: product.productId,
            color: selectedColor ?? "",
          })
        );
        dispatch(fetchWishlistAsync());
      }
    } catch (error) {
      toast.error("Something went wrong.", {
        duration: 1000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="min-h-[40vh] group relative flex flex-col gap-1 text-white ">
      <Link
        preventScrollReset={true}
        className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100"
        to={`/category/products/${product.productId}/${
          selectedAttribute ? selectedAttribute.sku : product.defaultSku
        }`}
      >
        {/* Wishlist Button */}
        {/* <Button
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            isInWishlist ? handleWishList("remove") : handleWishList("add");
          }}
          variant="outline"
          size="icon"
          className="h-8 w-8 absolute z-10 top-2 right-2 rounded-full bg-white/80 backdrop-blur shadow"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild />
              <TooltipContent>
                <p>
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Heart
            className="h-4 w-4"
            fill={isInWishlist ? "red" : "none"}
            stroke={isInWishlist ? "none" : "currentColor"}
          />
        </Button> */}

        {/* Discount Badge */}
        {discountBadge && (
          <div className="absolute top-2 left-2 z-10 bg-[#777047] text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow">
            {discountBadge.type === "PERCENTAGE"
              ? `${discountBadge.value}% OFF`
              : `₹${discountBadge.value} OFF`}
          </div>
        )}
        {offerBadge && (
          <div className="absolute top-9 left-2 z-10 bg-teal-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow">
            {offerBadge.name}
          </div>
        )}

        {/* Image Slider */}
        <div
          {...swipeHandlers}
          className={cn(
            "relative h-full w-full flex transition-transform duration-500",
            direction === "right" ? "translate-x-0" : "-translate-x-full"
          )}
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {(selectedImages || images)?.map((image, index) => (
            <LazyLoadImage
              effect="blur"
              key={index}
              src={image.img_url}
              alt={`${name} ${index}`}
              className="object-cover border rounded-xl w-full h-full flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.01]"
              wrapperProps={{
                style: { transitionDelay: "0.3s", minWidth: "100%" },
              }}
            />
          ))}
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
          {(selectedImages || images)?.map((_, idx) => (
            <div
              key={idx}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                idx === currentImageIndex ? "bg-black" : "bg-white/80"
              )}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 items-center justify-between p-2 opacity-0 hidden md:flex group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(event) => {
              handleInteractiveClick(event);
              prevImage();
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={(event) => {
              handleInteractiveClick(event);
              nextImage();
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="px-2  flex flex-col gap-2 w-full items-center ">
        {/* Title + Subheading */}
        <div className="w-full">
          <h3 className="text-sm sm:text-base font-medium line-clamp-2 leading-snug text-black">
            {selectedAttribute?.title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {subheading}
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-start items-start sm:items-center mt-0.5   w-full">
            <div className="flex items-center gap-2">
              {isDiscount && !selectedAttribute.offer && (
                <s className="text-white text-sm">₹{ogPrice}</s>
              )}
              <span className="text-sm font-semibold text-amber-500">
                ₹{selectedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
      </div>
    </div>
  );
}
