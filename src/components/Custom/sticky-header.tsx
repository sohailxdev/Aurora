// src/components/Custom/sticky-header.tsx
import { useState, useEffect } from "react";
import { SlidersHorizontal, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomDropdown } from "./CustomDropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import FilterTabs from "./FilterTabs";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";
import { selectProductEntity } from "@/app/Product/productSlice";
import { useNavbarVisibility } from "@/context/NavbarVisiblityContext";

export function StickyHeader() {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [params, setParams] = useState<string>("");
  const navigate = useNavigate();
  const { visible } = useNavbarVisibility();

  const sortOptions = [
    { value: "sort=price", label: "Price: Low to High" },
    { value: "sort=-price", label: "Price: High to Low" },
    { value: "sort=createdDate&order=DESC", label: "Latest" },
  ];

  const product = useAppSelector(selectProductEntity);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: string) => {
    const params = new URLSearchParams(location.search);
    const [key, value] = e.split("=");

    params.set(key, value);

    navigate(`?${params.toString()}`);
  };

  return (
    <header
      className={`sticky rounded-b-2xl border-b bg z-40 transition-shadow bg-white ${
        isSticky ? "shadow-md" : ""
      }`}
      style={{
        top: visible ? "86px" : "0px", // Adjusted for Navbar height (88px) + border (4px)
        transition: "top 0s ease-in-out", // Match Navbar's 300ms transition
      }}
    >
      <div
        className={`container max-w-7xl mx-auto ${
          isSticky ? "border-none" : ""
        }`}
      >
        <div className="grid grid-cols-3 items-center justify-between py-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="flex hover:bg-transparent items-center justify-start gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full max-w-sm p-0 sm:max-w-md">
              <SheetHeader className="border-b px-6 py-4">
                <div className="flex items-center justify-center">
                  <SheetTitle>Filter</SheetTitle>
                </div>
              </SheetHeader>
              <FilterTabs
                setOpen={setOpen}
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
                params={params}
                setParams={setParams}
              />
            </SheetContent>
          </Sheet>

          <div className="text-sm font-medium text-center text-muted-foreground">
            {product?.totalElements ?? 0} products
          </div>
          <div className="flex justify-end mr-5">
            <CustomDropdown
              icon={<SortDesc size={16} />}
              title="Sort by"
              options={sortOptions}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
