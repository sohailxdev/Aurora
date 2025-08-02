import { Product, ProductResponse } from "@/app/Product/type";
import { ProductCard } from "@/components/Custom/product-card";
import {
  ExtractedProductData,
  extractProductData,
} from "@/components/Custom/product-grid";
import { StickyHeaderV1 } from "@/components/Custom/sticky-headerV1";
import { BASE_URL } from "@/lib/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type Collection = {
  id: number;
  collectionName: string;
  description: string;
  bannerImage: string | null;
  skus: {
    id: number;
    productId: number;
    productName: string;
    productDescription: string;
    skuDetails: {
      fit: string;
      sku: string;
      imgs: {
        img_Id: number;
        img_url: string;
        img_name: string;
        img_type: string;
      }[];
      size: string;
      color: string;
      price: number;
      keyName: string;
      pattern: string;
      quantity: number;
      discount?: {
        valueType: "PERCENTAGE" | "FIXED";
        discountValue: number;
      };
    };
  }[];
};

const extractProductDataFromCollection = (
  collectionData: Collection
): ExtractedProductData[] => {
  // Check if we have valid skus array
  if (!collectionData?.skus || !Array.isArray(collectionData.skus)) {
    return [];
  }

  // Group SKUs by productId
  const productMap = new Map();

  collectionData.skus
    .filter((sku) => sku && sku.skuDetails) // ✅ removes null & bad entries
    .forEach((sku) => {
      if (!productMap.has(sku.productId)) {
        productMap.set(sku.productId, {
          productId: sku.productId,
          productName: sku.productName,
          productDescription: sku.productDescription,
          attributes: [],
        });
      }

      // Convert skuDetails to attribute format expected by the original function
      const attribute = {
        ...sku.skuDetails,
        sku: sku.skuDetails.sku,
        price: sku.skuDetails.price,
        size: sku.skuDetails.size,
        color: sku.skuDetails.color,
        pattern: sku.skuDetails.pattern,
        quantity: sku.skuDetails.quantity,
        imgs: sku.skuDetails.imgs || [],
        discount: sku.skuDetails.discount || null,
      };

      productMap.get(sku.productId).attributes.push(attribute);
    });

  // Convert map to array
  const productsArray = Array.from(productMap.values());

  // Now we can use the original extractProductData logic but with our adjusted data
  return productsArray.map((product) => {
    const highestPrice = Math.max(
      ...product.attributes.map((attr) => +attr.price)
    );

    // Flatten images
    let allImages = product.attributes.flatMap((attr) =>
      attr.imgs.map((img) => ({
        ...img,
        sku: attr.sku, // Attach SKU for sorting later
      }))
    );

    // Remove duplicate images by image_id
    const uniqueImagesMap = new Map();

    // Define a defaultSku (first one if not specified)
    const defaultSku = product.defaultSku || product.attributes[0]?.sku;

    // First, add images where SKU matches defaultSku
    product.attributes.forEach((attr) => {
      if (attr.sku === defaultSku) {
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

    return {
      ...product,
      id: product.productId,
      name: product.productName,
      desc: product.productDescription,
      type: product.productTypeName || "Unknown",
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
      defaultSku: defaultSku,
      colors: Array.from(new Set(product.attributes.map((attr) => attr.color))),
      size: [...new Set(product.attributes.map((attr) => attr.size))],
      attributes: product.attributes.map((attr) => {
        const discountTypePercentage =
          attr.discount?.valueType === "PERCENTAGE";

        const isDiscountAvailable = !!attr.discount;

        const newPriceForPercentage = isDiscountAvailable
          ? discountTypePercentage
            ? Math.ceil(
                attr.price - (attr.price * attr.discount.discountValue) / 100
              )
            : Math.ceil(attr.price - attr.discount.discountValue)
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
};

const extractEachSkuAsProduct = (
  collectionData: Collection
): ExtractedProductData[] => {
  if (!collectionData?.skus || !Array.isArray(collectionData.skus)) return [];

  return collectionData.skus
    .filter((sku) => sku && sku.skuDetails)
    .map((sku) => {
      const attr = {
        ...sku.skuDetails,
        sku: sku.skuDetails.sku,
        price: sku.skuDetails.price,
        size: sku.skuDetails.size,
        color: sku.skuDetails.color,
        pattern: sku.skuDetails.pattern,
        quantity: sku.skuDetails.quantity,
        imgs: sku.skuDetails.imgs || [],
        discount: sku.skuDetails.discount || null,
      };

      const highestPrice = +attr.price;

      const discountedPrice = attr.discount
        ? attr.discount.valueType === "PERCENTAGE"
          ? Math.ceil(
              attr.price - (attr.price * attr.discount.discountValue) / 100
            )
          : Math.ceil(attr.price - attr.discount.discountValue)
        : attr.price;

      const discountPercentage = attr.discount
        ? (((attr.price - discountedPrice) / attr.price) * 100).toFixed(2)
        : "0.00";

      const uniqueImages = attr.imgs.map((img) => ({
        ...img,
        sku: attr.sku,
      }));

      return {
        id: `${sku.productId}-${attr.sku}`,
        productId: sku.productId,
        name: sku.productName,
        desc: sku.productDescription,
        type: "Unknown",
        originalPrice: highestPrice,
        discountedPrice,
        discountPercentage,
        images: uniqueImages,
        defaultSku: attr.sku,
        colors: [attr.color],
        size: [attr.size],
        attributes: [
          {
            ...attr,
            price: discountedPrice,
            ogPrice: attr.price,
            discount: attr.discount ? attr.discount : 0,
          },
        ],
        tags: [],
        sku: attr.sku,
        subheading: "",
        description: sku.productDescription || "",
        productName: sku.productName || "",
        category: "",
        collection: "",
        brand: "",
        rating: 0,
        reviews: [],
        stockStatus: attr.quantity > 0 ? "In Stock" : "Out of Stock",
        groupCompanyId: 0,
        companyId: 0,
        locationId: 0,
        branchId: 0,
        collectionId: 0,
        collectionName: "",
        collectionType: "",
        collectionImages: [],
      };
    });
};

function Collection() {
  const { id } = useParams();
  const [collection, setCollection] = useState<ExtractedProductData[]>([]);
  const [data, setData] = useState<Collection>();
  const [collectionName, setCollectionName] = useState<string>("");
  const params = useLocation().search;
  const apiCheck = decodeURIComponent(params);
  const attribute = apiCheck.split("=");

  const fetchCollection = async (id: string) => {
    try {
      const response = await axios.get(
        BASE_URL + `/api/collections/user/${id}`
      );
      setCollectionName(response.data.collectionName);
      setData(response.data);
      setCollection(extractEachSkuAsProduct(response.data));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) throw error.response?.data;
      else throw "Something went wrong";
    }
  };

  const fetchFilterCollection = async (attribute: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/collections${attribute}&collectionId=${id}`
      );
      if (res.status === 200) {
        setCollection(extractProductData(res.data));
      } else {
      }
    } catch (error) {
      if (axios.isAxiosError(error)) throw error?.response?.data;
      else throw "Something went wrong!";
    }
  };

  useEffect(() => {
    attribute[0] === "?query"
      ? fetchFilterCollection(`/search?keyword=${attribute[1]}`)
      : attribute[0] == "?sort"
      ? fetchFilterCollection(`/test/filter${params}`)
      : attribute[0].length > 1
      ? fetchFilterCollection(`/test/filter${params}`)
      : fetchCollection(id || "");
  }, [params]);

  useEffect(() => {
    fetchCollection(id || "");
  }, [id]);

  return (
    <main>
      <StickyHeaderV1 collection={collection.length} />
      <div className="px-14 py-10 max-w-7xl">
        <h1 className="text-4xl md:text-5xl CustomFontThin font-light text-neutral-900 mb-6">
          {data?.collectionName || "Collections"}
        </h1>
        <p className="text-neutral-700 max-w-3xl text-base md:text-lg leading-relaxed CustomFontThin">
          {data?.description ||
            "Discover our latest collection of products. Explore a wide range of styles and designs that cater to every taste and preference."}
        </p>
      </div>
      <div className="container mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 px-4 ">
        {collection?.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </main>
  );
}

export default Collection;
