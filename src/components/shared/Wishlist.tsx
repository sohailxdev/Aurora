import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchWishlistAsync,
  selectWishlistProducts,
} from "@/app/wishList/wishlistSlice";
import { useEffect, useState } from "react";
import {
  ExtractedProductData,
  extractProductData,
} from "../Custom/product-grid";
import { ProductCard } from "../Custom/product-card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const wishListItems = useAppSelector(selectWishlistProducts);
  const [wishListProds, setWishListProds] = useState<ExtractedProductData[]>(
    []
  );

  const fetchData = async () => {
    try {
      const items = await dispatch(fetchWishlistAsync("")).unwrap();
      const data = extractProductData(items);
      setWishListProds(data);
    } catch (error) {}
  };

  useEffect(() => {
    if (!wishListItems) {
      fetchData();
    } else {
      setWishListProds(extractProductData(wishListItems));
    }
  }, [wishListItems,dispatch]);

  return (
    <div className="max-w-7xl container p-8 mt-3 mx-auto grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <h1 className="col-span-full text-2xl text-[#857862] font-bold border-b">
        Wishlist
      </h1>
      {wishListProds.length == 0 ? (
        <div className="flex flex-col min-h-[50vh] col-span-full">
          <h1 className="text-xl font-semibold text-gray-800">
            Your Wishlist is Empty
          </h1>
          <h2 className="text-md text-gray-600 mt-2">
            Looks like you haven't added any items yet. Start exploring and add
            your favorites now!
          </h2>
          <Button className="w-fit mt-4" onClick={() => navigate(`/category`)}>
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          {wishListProds?.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </>
      )}
    </div>
  );
};

export default Wishlist;
