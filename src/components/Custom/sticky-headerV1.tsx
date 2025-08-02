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
import { useNavbarVisibility } from "@/context/NavbarVisiblityContext";

type StickyHeaderV1Props = {
  collection: number;
};

export function StickyHeaderV1({ collection }: StickyHeaderV1Props) {
  const [isSticky, setIsSticky] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [params, setParams] = useState<string>("");
  const navigate = useNavigate();
  const { visible } = useNavbarVisibility();

  const sortOptions = [
    // { value: "relevance", label: "Relevance" },
    { value: "sort=price", label: "Price: Low to High" },
    { value: "sort=-price", label: "Price: High to Low" },
    { value: "sort=created_Date", label: "Latest" },
    // { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e: string) => {
    const params = new URLSearchParams(location.search);
    const [key, value] = e.split("="); // Assuming e is like "sortBy=price" or "query=jeans"

    params.set(key, value); // This updates or adds the key

    navigate(`?${params.toString()}`);
  };

  return (
    <header
      className={`sticky  rounded-b-2xl top-[7rem] px-2 max-sm:top-[9%]  z-30 transition-shadow ${
        isSticky ? "shadow-md" : ""
      }`}
      style={{
        top: visible ? "86px" : "0px", // Adjusted for Navbar height (88px) + border (4px)
        transition: "top 0s ease-in-out", // Match Navbar's 300ms transition
      }}
    >
      <div className="container max-w-7xl mx-auto border-b">
        <div className="flex items-center justify-between py-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <Button variant="ghost" className="text">
                  Filter
                </Button>
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
          <div className="text-sm text-center text-muted-foreground">
            {collection ?? 0} products
          </div>
          <div className="max-md:pr-3">
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
