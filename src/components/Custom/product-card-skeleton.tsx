import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="min-h-[50vh] group relative flex flex-col justify-between">
      {/* Image Area */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full bg-gray-200" />
        {/* Wishlist Button Placeholder */}
        <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full bg-gray-200" />
        {/* Discount Badge Placeholder */}
        <Skeleton className="absolute top-2 left-2 h-6 w-16 rounded-full bg-gray-200" />
      </div>

      {/* Content Area */}
      <div className="mt-4 flex flex-col gap-2">
        {/* Product Name and Subheading */}
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="h-6 w-32 bg-gray-200" />
            <Skeleton className="h-4 w-24 mt-1 bg-gray-200" />
          </div>
        </div>

        {/* Price */}
        <div className="flex ml-2 items-start flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16 bg-gray-200" />
            <Skeleton className="h-5 w-12 bg-gray-200" />
          </div>
          <Skeleton className="h-4 w-20 bg-gray-200" />
        </div>

        {/* Color Buttons */}
        <div className="flex ml-2 items-center gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4 rounded-full bg-gray-200" />
          ))}
        </div>

        {/* Size Buttons */}
        <div className="grid gap-2">
          <div className="ml-2 grid grid-cols-5 gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded bg-gray-200" />
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Skeleton className="mt-2 h-10 w-full rounded bg-gray-200" />
      </div>
    </div>
  );
}
